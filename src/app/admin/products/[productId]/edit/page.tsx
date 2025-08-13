import db from "@/lib/db";
import { EditProductForm } from "./_components/EditProductForm";

export default async function EditProductPage({ params }: { params: { productId: string }}) {
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: params.productId },
      include: { variants: true },
    }),
    db.category.findMany(),
  ]);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <EditProductForm product={product} categories={categories} />
    </div>
  );
}