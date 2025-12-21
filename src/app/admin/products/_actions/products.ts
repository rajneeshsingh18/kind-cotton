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
   images: z.string(), // ✅ Changed: Now allows any string, including empty
  // images: z.string().url("Image must be a valid URL").min(1, "Image is required"),
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

          })),
        },
      },
    });

  } catch (err: unknown) { // ✅ FIX: Changed from 'any' to 'unknown'
    const message = err instanceof Error ? err.message : "An unknown database error occurred";
    console.error("Database Error:", message);
    return { generalError: "Failed to create product. Please check your input." };
  }

  // After success, update the cache and redirect the user
  revalidatePath("/admin/products");
  redirect("/admin/products");
}



// New Server Action for updating a product
export async function updateProduct(productId: string, prevState: unknown, formData: FormData) {
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
    const variantsResult = z.array(variantSchema.extend({ dbId: z.string().optional() })).safeParse(variants);

    if (!variantsResult.success) {
      return { generalError: "One or more variants have invalid data." };
    }

    const { name, description, categoryId } = productResult.data;
    const submittedVariants = variantsResult.data;

    // Use a transaction to ensure all database operations succeed or fail together
    await db.$transaction(async (tx) => {
      // 1. Update the main product details
      await tx.product.update({
        where: { id: productId },
        data: { name, description, categoryId },
      });

      const existingVariantIds = (await tx.productVariant.findMany({
        where: { productId },
        select: { id: true },
      })).map(v => v.id);

      const submittedVariantDbIds = submittedVariants.map(v => v.dbId).filter(Boolean) as string[];

      // 2. Identify variants to delete
      const variantsToDelete = existingVariantIds.filter(id => !submittedVariantDbIds.includes(id));
      if (variantsToDelete.length > 0) {
        await tx.productVariant.deleteMany({
          where: { id: { in: variantsToDelete } },
        });
      }

      // 3. Update existing variants
      const variantsToUpdate = submittedVariants.filter(v => v.dbId);
      for (const variant of variantsToUpdate) {
        await tx.productVariant.update({
          where: { id: variant.dbId },
          data: {
            color: variant.color,
            size: variant.size,
            price: variant.price,
            stock: variant.stock,
            images: [variant.images],
          },
        });
      }

      // 4. Create new variants
      const variantsToCreate = submittedVariants.filter(v => !v.dbId);
      if (variantsToCreate.length > 0) {
        await tx.productVariant.createMany({
          data: variantsToCreate.map(variant => ({
            productId,
            color: variant.color,
            size: variant.size,
            price: variant.price,
            stock: variant.stock,
            images: [variant.images],

          })),
        });
      }
    });

  } catch (err: unknown) { // ✅ FIX: Changed from 'any' to 'unknown'
    const message = err instanceof Error ? err.message : "An unknown database error occurred";
    console.error("Database Error:", message);
    return { generalError: "Failed to update product." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}



// New Server Action for deleting a product
export async function deleteProduct(productId: string) {
  try {
    const product = await db.product.delete({
      where: { id: productId },
    });

    if (!product) {
      return { error: "Product not found." };
    }
    
    // Refresh the products page to show the updated list
    revalidatePath("/admin/products");
    
    return { success: "Product deleted successfully." };

  } catch (err: unknown) { // ✅ FIX: Changed variable name and added safe handling
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Delete Error:", message);
    return { error: "Failed to delete product." };
  }
}