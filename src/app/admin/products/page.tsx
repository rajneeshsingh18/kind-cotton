import Image from "next/image";
import Link from "next/link";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Utility to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      variants: {
        orderBy: { price: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const primaryVariant = product.variants[0];
              const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={primaryVariant?.images[0] || "/images/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatPrice(primaryVariant?.price || 0)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{totalStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}