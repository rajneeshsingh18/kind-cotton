import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

// --- Environment Variable Validation ---
const lemonsqueezyApiKey = process.env.LEMONSQUEEZY_API_KEY;
const lemonsqueezyStoreId = process.env.LEMONSQUEEZY_STORE_ID;

if (!lemonsqueezyApiKey || !lemonsqueezyStoreId) {
  throw new Error("Missing Lemon Squeezy API key or Store ID in .env");
}

const LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1/checkouts";

type CartItem = {
  id: string; // This is our internal DB variant ID
  quantity: number;
};

interface UserSession {
  user?: {
    id?: string;
    email?: string;
  };
}

export async function POST(request: Request) {
  try {
    const userSession = (await auth()) as UserSession;
    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const variantIds = items.map((item) => item.id);
    const productVariants = await db.productVariant.findMany({
      where: { id: { in: variantIds } },
    });

    if (productVariants.length !== items.length) {
      return NextResponse.json({ error: "One or more products in your cart could not be found." }, { status: 404 });
    }
    
    // ✅ Get the Lemon Squeezy ID for the FIRST item to use as the primary variant
    const primaryVariantId = productVariants[0].lemonSqueezyVariantId;
    if (!primaryVariantId) {
        throw new Error(`Primary product variant with ID ${productVariants[0].id} is missing its Lemon Squeezy ID.`);
    }

    // ✅ Prepare the variant quantities array for the checkout
    const variantQuantities = items.map(item => {
      const variant = productVariants.find(p => p.id === item.id);
      if (!variant || !variant.lemonSqueezyVariantId) {
        throw new Error(`Configuration error for variant ${item.id}`);
      }
      return {
        variant_id: parseInt(variant.lemonSqueezyVariantId), // Must be an integer
        quantity: item.quantity
      };
    });

    // ✅ Final Corrected Payload Structure
    const payload = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_options: { embed: true, media: false },
          checkout_data: {
            email: userSession?.user?.email,
            custom: { user_id: userSession?.user?.id },
            variant_quantities: variantQuantities,
          }
        },
        relationships: {
          store: {
            data: { type: 'stores', id: lemonsqueezyStoreId }
          },
          // ✅ FIX: A primary variant relationship IS required, even for multi-item checkouts.
          variant: {
            data: { type: 'variants', id: primaryVariantId.toString() }
          }
        }
      }
    };

    const response = await fetch(LEMONSQUEEZY_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${lemonsqueezyApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Lemon Squeezy API Error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: error.errors?.[0]?.detail || "An error occurred with our payment provider." },
        { status: response.status }
      );
    }

    const checkout = await response.json();
    return NextResponse.json({ 
      checkoutUrl: checkout.data.attributes.url 
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Checkout Route Error:", message);

    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}