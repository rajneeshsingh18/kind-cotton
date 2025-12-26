import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Razorpay from 'razorpay';

// Initialize Razorpay with environment variables
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  console.log('[RAZORPAY_INIT] Checking environment variables...');
  console.log('[RAZORPAY_INIT] Key ID exists:', !!keyId);
  console.log('[RAZORPAY_INIT] Key Secret exists:', !!keySecret);
  console.log('[RAZORPAY_INIT] Key ID length:', keyId?.length || 0);
  console.log('[RAZORPAY_INIT] Key Secret length:', keySecret?.length || 0);

  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in environment variables');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export async function POST(req: Request) {
  try {
    console.log('[RAZORPAY_ORDER_POST] Starting order creation...');

    const session = await auth();
    if (!session?.user) {
      console.error('[RAZORPAY_ORDER_POST] No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('[RAZORPAY_ORDER_POST] User authenticated:', session.user.id);

    const body = await req.json();
    const { addressId, items } = body;

    console.log('[RAZORPAY_ORDER_POST] Request body:', { addressId, itemsCount: items?.length });

    if (!addressId) {
      return new NextResponse('Address ID is required', { status: 400 });
    }

    // Fetch address to get mobile number for Razorpay authentication
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      console.error('[RAZORPAY_ORDER_POST] Address not found:', addressId);
      return new NextResponse('Address not found', { status: 404 });
    }

    console.log('[RAZORPAY_ORDER_POST] Address found:', { id: address.id, mobile: address.mobile });

    if (!address.mobile) {
      return new NextResponse('Mobile number is required in shipping address. Please update your address with a mobile number.', { status: 400 });
    }

    if (!items || items.length === 0) {
      return new NextResponse('No items in checkout', { status: 400 });
    }

    console.log('[RAZORPAY_ORDER_POST] Calculating order total...');
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new Error(`Variant not found: ${item.variantId}`);
      }

      total += variant.price * item.quantity;
      orderItemsData.push({
        variantId: item.variantId,
        quantity: item.quantity,
        price: variant.price,
      });
    }

    console.log('[RAZORPAY_ORDER_POST] Order total calculated:', total);

    // Initialize Razorpay instance
    const razorpay = getRazorpayInstance();

    // Authenticate/Create Razorpay Customer first
    console.log('[RAZORPAY_ORDER_POST] Creating Razorpay customer...');
    let razorpayCustomerId: string | undefined;
    try {
      const customerData = {
        name: session.user.name || 'Customer',
        email: session.user.email || undefined,
        contact: address.mobile,
      };

      console.log('[RAZORPAY_CUSTOMER_CREATE] Customer data:', {
        name: customerData.name,
        email: customerData.email,
        contact: customerData.contact
      });

      const razorpayCustomer = await razorpay.customers.create(customerData);
      razorpayCustomerId = razorpayCustomer.id;
      console.log('[RAZORPAY_CUSTOMER_CREATE] Customer created successfully:', razorpayCustomerId);
    } catch (error: any) {
      console.error('[RAZORPAY_CUSTOMER_CREATE] Error details:', {
        statusCode: error.statusCode,
        errorCode: error.error?.code,
        errorDescription: error.error?.description,
        message: error.message,
        fullError: JSON.stringify(error, null, 2)
      });

      // If it's an authentication error, throw it immediately
      if (error.statusCode === 401) {
        console.error('[RAZORPAY_CUSTOMER_CREATE] Authentication failed - check your API keys');
        return new NextResponse(
          JSON.stringify({
            error: 'Razorpay authentication failed',
            message: 'Please check your Razorpay API credentials',
            details: error.error?.description || error.message
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // If it's a duplicate customer error, we can proceed without customer_id
      if (error.statusCode === 400 && error.error?.code === 'BAD_REQUEST_ERROR') {
        console.warn('[RAZORPAY_CUSTOMER_CREATE] Customer may already exist, proceeding without customer_id');
      } else {
        console.warn('[RAZORPAY_CUSTOMER_CREATE] Customer creation failed, proceeding with order creation');
      }
    }

    // Create Razorpay Order
    console.log('[RAZORPAY_ORDER_POST] Creating Razorpay order...');
    const orderData: {
      amount: number;
      currency: string;
      receipt: string;
      customer_id?: string;
    } = {
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    // Add customer_id if we successfully created/found the customer
    if (razorpayCustomerId) {
      orderData.customer_id = razorpayCustomerId;
      console.log('[RAZORPAY_ORDER_POST] Using customer_id:', razorpayCustomerId);
    } else {
      console.log('[RAZORPAY_ORDER_POST] Proceeding without customer_id');
    }

    console.log('[RAZORPAY_ORDER_CREATE] Order data:', orderData);

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(orderData);
      console.log('[RAZORPAY_ORDER_CREATE] Order created successfully:', razorpayOrder.id);
    } catch (error: any) {
      console.error('[RAZORPAY_ORDER_CREATE] Error details:', {
        statusCode: error.statusCode,
        errorCode: error.error?.code,
        errorDescription: error.error?.description,
        message: error.message,
        fullError: JSON.stringify(error, null, 2)
      });

      if (error.statusCode === 401) {
        return new NextResponse(
          JSON.stringify({
            error: 'Razorpay authentication failed',
            message: 'Please check your Razorpay API credentials',
            details: error.error?.description || error.message
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      throw error;
    }

    // Create Order in DB
    console.log('[RAZORPAY_ORDER_POST] Creating order in database...');
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: total,
        status: 'PENDING',
        shippingAddressId: addressId,
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: orderItemsData,
        },
      },
    });

    console.log('[RAZORPAY_ORDER_POST] Order created successfully in DB:', order.id);

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    console.error('[RAZORPAY_ORDER_POST] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      fullError: JSON.stringify(error, null, 2)
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Internal Error',
        message: error.message || 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
