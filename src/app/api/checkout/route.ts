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
  id: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const userSession = await auth();
    const { items }: { items: CartItem[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const variantIds = items.map((item) => item.id);
    const productVariants = await db.productVariant.findMany({
      where: { id: { in: variantIds } },
    });

    // Create the variant_quantities array
    const variantQuantities = items.map((item) => {
      const variant = productVariants.find(p => p.id === item.id);
      if (!variant) {
        throw new Error(`Product variant with ID ${item.id} not found.`);
      }
      const variantId = parseInt(variant.lemonSqueezyVariantId);
      if (isNaN(variantId)) {
        throw new Error(`Invalid Lemon Squeezy Variant ID for product: ${variant.id}`);
      }
      return {
        variant_id: variantId,
        quantity: item.quantity,
      };
    });

    // --- ✅ THE FIX: Corrected API Request Body Structure ---
    const payload = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            // email: userSession?.user?.email || undefined,
            // name: userSession?.user?.name || undefined,
            // The variant list goes here for multi-product checkouts
            variant_quantities: variantQuantities,
          }
        },
        relationships: {
          // The relationships object should ONLY contain the store
          store: {
            data: {
              type: 'stores',
              id: lemonsqueezyStoreId
            }
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
      console.error("Lemon Squeezy API Error:", error.errors || error);
      throw new Error("Lemon Squeezy API error");
    }

    const checkout = await response.json();
    const checkoutUrl = checkout.data.attributes.url;

    return NextResponse.json({ checkoutUrl });

  } catch (err: any) {
    console.error("Checkout Route Error:", err.message);
    return NextResponse.json({ error: "Error creating checkout session." }, { status: 500 });
  }
}