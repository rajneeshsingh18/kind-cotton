import Image from "next/image";
import Link from "next/link";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PlusCircle} from "lucide-react";
import { ProductActions } from "./_components/ProductActions";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      variants: { orderBy: { price: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No products found.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/products/new">Add your first product</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-lg border shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Image</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const primaryVariant = product.variants[0];
                  const priceRange =
                    product.variants.length > 1
                      ? `${formatPrice(product.variants[0].price)} - ${formatPrice(
                          product.variants[product.variants.length - 1].price
                        )}`
                      : formatPrice(primaryVariant?.price || 0);
                  const totalStock = product.variants.reduce(
                    (acc, v) => acc + v.stock,
                    0
                  );

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                          <Image
                            src={primaryVariant?.images[0] || "/images/placeholder.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3">{priceRange}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            totalStock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ProductActions productId={product.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {products.map((product) => {
              const primaryVariant = product.variants[0];
              const priceRange =
                product.variants.length > 1
                  ? `${formatPrice(product.variants[0].price)} - ${formatPrice(
                      product.variants[product.variants.length - 1].price
                    )}`
                  : formatPrice(primaryVariant?.price || 0);
              const totalStock = product.variants.reduce(
                (acc, v) => acc + v.stock,
                0
              );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4"
                >
                  <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                    <Image
                      src={primaryVariant?.images[0] || "/images/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{priceRange}</p>
                    <p
                      className={`text-xs mt-1 ${
                        totalStock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Stock: {totalStock}
                    </p>
                  </div>
                  <ProductActions productId={product.id} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
