import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpayOrderId },
    });

    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // Update Order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING', // Or whatever status indicates paid
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RAZORPAY_VERIFY_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
