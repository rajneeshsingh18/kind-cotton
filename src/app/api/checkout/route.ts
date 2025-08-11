// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/lib/db";

// Ensure environment variables are set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}



type IncomingCartItem = {
  id: string; // variant id
  title: string;
  price: number; // client-side price, will be verified server-side
  img: string;
  quantity: number;
};




// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: [item.img],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    
    // ✅ THE FIX: Use the reliable environment variable for the base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error("Stripe Error:", err.message);
    return NextResponse.json({ error: "Error creating checkout session." }, { status: 500 });
  }
}