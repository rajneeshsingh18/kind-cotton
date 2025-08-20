import { Star } from "lucide-react";
import Image from "next/image";


type Product = {
  id: string;
  title: string;
  price: number;
  rating: string;
  img: string;
  tag?: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.img}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              {product.tag && (
                <div className="absolute top-3 left-3 bg-white/90 text-slate-900 text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                  {product.tag}
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-800">{product.title}</h3>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">{formatPrice(product.price)}</p>
                {product.rating && (
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <span>{product.rating}</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}