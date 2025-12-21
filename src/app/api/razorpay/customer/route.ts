import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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
      interface RazorpayError {
        statusCode?: number;
        error?: {
          description?: string;
        };
      }
      
      const razorpayError = error as RazorpayError;
      
      // If customer already exists, try to fetch by contact
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('already exists')) {
        // Search for existing customer by contact
        try {
          const customers = await razorpay.customers.all({
            count: 1,
          });
          
          // Find customer with matching contact
          // Note: Razorpay's contact can be string | number, so we convert to string for comparison
          const matchingCustomer = customers.items?.find(
            (customer) => {
              const customerContact = customer.contact?.toString();
              return customerContact === mobile;
            }
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
    const statusCode = (error as { statusCode?: number })?.statusCode || 500;
    return new NextResponse(
      errorMessage,
      { status: statusCode }
    );
  }
}

