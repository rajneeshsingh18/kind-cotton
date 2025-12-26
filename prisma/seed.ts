import { PrismaClient, Size } from "@prisma/client";

const db = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("🌱 Starting seed process...");

  // --- CREATE CATEGORIES ---
  console.log("Creating categories...");
  const tShirtsCategory = await db.category.upsert({
    where: { name: "T-Shirts" },
    update: {},
    create: {
      name: "T-Shirts",
    },
  });

  const hoodiesCategory = await db.category.upsert({
    where: { name: "Hoodies" },
    update: {},
    create: {
      name: "Hoodies",
    },
  });
  console.log("✅ Categories created.");

  // --- CREATE PRODUCTS ---
  console.log("Creating products with .webp images...");
  const classicTee = await db.product.create({
    data: {
      name: "Classic Cotton Tee",
      description: "A timeless, comfortable t-shirt made from 100% premium cotton. Perfect for everyday wear.",
      category: {
        connect: { id: tShirtsCategory.id },
      },
      // --- CREATE VARIANTS FOR THIS PRODUCT ---
      variants: {
        create: [
          // Paths updated to .webp
          { color: "Black", size: Size.M, price: 499.00, stock: 100, images: ["/images/products/black_tee.webp"] },
          { color: "Black", size: Size.L, price: 499.00, stock: 80, images: ["/images/products/black_tee.webp"] },
          { color: "White", size: Size.S, price: 499.00, stock: 90, images: ["/images/products/white_tee.webp"] },
          { color: "White", size: Size.M, price: 499.00, stock: 110, images: ["/images/products/white_tee.webp"] },
        ],
      },
    },
  });

  const vintageWashTee = await db.product.create({
    data: {
      name: "Vintage Wash Tee",
      description: "Get that worn-in feel from day one with our super-soft vintage wash t-shirt.",
      category: {
        connect: { id: tShirtsCategory.id },
      },
      // --- CREATE VARIANTS FOR THIS PRODUCT ---
      variants: {
        create: [
          // Paths updated to .webp
          { color: "Charcoal", size: Size.M, price: 1500.00, stock: 50, images: ["/images/products/charcoal_tee.webp"] },
          { color: "Charcoal", size: Size.L, price: 1500.00, stock: 45, images: ["/images/products/charcoal_tee.webp"] },
          { color: "Navy", size: Size.XL, price: 1500.00, stock: 60, images: ["/images/products/navy_tee.webp"] },
        ],
      },
    },
  });

  console.log("✅ Products and variants created with .webp images.");
  console.log("🌱 Seed process finished successfully!");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await db.$disconnect();
  });