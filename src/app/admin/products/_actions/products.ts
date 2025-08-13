"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Size } from "@prisma/client";

// Define schemas for validating the incoming form data
const addProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
});

const variantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.nativeEnum(Size),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  images: z.string().url("Image must be a valid URL").min(1, "Image is required"),
});

// This is the Server Action function
export async function addProduct(prevState: unknown, formData: FormData) {
  const productData = Object.fromEntries(formData.entries());

  const productResult = addProductSchema.safeParse(productData);
  if (!productResult.success) {
    return productResult.error.flatten().fieldErrors;
  }

  const variantsJson = formData.get("variants") as string;
  if (!variantsJson) {
    return { generalError: "At least one variant is required." };
  }
  
  try {
    const variants = JSON.parse(variantsJson);
    const variantsResult = z.array(variantSchema).safeParse(variants);

    if (!variantsResult.success) {
      return { generalError: "One or more variants have invalid data." };
    }

    // If validation passes, create the product and its variants in the database
    await db.product.create({
      data: {
        name: productResult.data.name,
        description: productResult.data.description,
        categoryId: productResult.data.categoryId,
        variants: {
          create: variantsResult.data.map(variant => ({
            ...variant,
            images: [variant.images], // Wrap the single image URL in an array
            lemonSqueezyVariantId: "placeholder", // We'll handle this later
          })),
        },
      },
    });

  } catch (e: any) {
    console.error("Database Error:", e.message);
    return { generalError: "Failed to create product. Please check your input." };
  }

  // After success, update the cache and redirect the user
  revalidatePath("/admin/products");
  redirect("/admin/products");
}