import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
// import { prisma } from '@/lib/db';
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
    const { mobile, email, name } = body;

    if (!mobile) {
      return new NextResponse('Mobile number is required', { status: 400 });
    }

    // Create or fetch Razorpay customer
    // First, try to find existing customer by contact (mobile)
    let razorpayCustomer;

    try {
      // Try to create a new customer
      razorpayCustomer = await razorpay.customers.create({
        name: name || session.user.name || 'Customer',
        email: email || session.user.email || undefined,
        contact: mobile,
        fail_existing: 0, // Don't fail if customer already exists
      });
    } catch (error: unknown) {
      const err = error as { statusCode?: number; error?: { description?: string } };
      // If customer already exists, try to fetch by contact
      if (err.statusCode === 400 && err.error?.description?.includes('already exists')) {
        // Search for existing customer by contact
        try {
          const customers = await razorpay.customers.all({
            count: 1,
          });

          // Find customer with matching contact
          const matchingCustomer = customers.items?.find(
            (customer: { contact?: string | number }) => String(customer.contact) === mobile
          );

          if (matchingCustomer) {
            razorpayCustomer = matchingCustomer;
          } else {
            // If not found, try to create with different approach
            razorpayCustomer = await razorpay.customers.create({
              name: name || session.user.name || 'Customer',
              email: email || session.user.email || undefined,
              contact: mobile,
            });
          }
        } catch (searchError) {
          console.error('[RAZORPAY_CUSTOMER_SEARCH]', searchError);
          // Fallback: try creating again without fail_existing
          razorpayCustomer = await razorpay.customers.create({
            name: name || session.user.name || 'Customer',
            email: email || session.user.email || undefined,
            contact: mobile,
          });
        }
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      customerId: razorpayCustomer.id,
      contact: razorpayCustomer.contact,
    });
  } catch (error: unknown) {
    console.error('[RAZORPAY_CUSTOMER_POST]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create Razorpay customer';
    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    return new NextResponse(
      errorMessage,
      { status: statusCode }
    );
  }
}

