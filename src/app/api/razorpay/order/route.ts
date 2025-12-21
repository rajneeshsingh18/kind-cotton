import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { addressId } = body;

    if (!addressId) {
      return new NextResponse('Address ID is required', { status: 400 });
    }

    // Calculate cart total (fetching from DB to be safe)
    // For now, assuming we have a way to get cart total or passing it.
    // Better to fetch cart items from DB.
    // But for this task, I'll assume we create an Order first or calculate total here.
    // Let's assume we create the Order record here with PENDING status.

    // Fetch user's cart (assuming we have a Cart model or similar logic, 
    // but the prompt didn't mention Cart implementation details, so I'll assume we look up the user's active cart or passed items).
    // Wait, the schema has Order and OrderItem.
    // I need to know how the cart is stored.
    // The schema doesn't show a Cart model.
    // Maybe it's stored in local storage or a separate Cart table not shown?
    // Let's check if there is a Cart model in schema.
    // I viewed schema in step 22. No Cart model.
    // So maybe it's session based or local storage.
    // If local storage, the frontend passes items.
    // If so, we need to validate prices from DB.

    // For simplicity and "production level", I should validate prices.
    // I'll assume the frontend sends the items (variantId, quantity).
    
    const { items } = body; // Expecting { variantId, quantity }[]
    
    if (!items || items.length === 0) {
       return new NextResponse('No items in checkout', { status: 400 });
    }

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

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Create Order in DB
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

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('[RAZORPAY_ORDER_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
