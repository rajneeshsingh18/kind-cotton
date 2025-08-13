import db from "@/lib/db";
import { AddProductForm } from "./_components/AddProductForm";

export default async function AddProductPage() {
  const categories = await db.category.findMany();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <AddProductForm categories={categories} />
    </div>
  );
}