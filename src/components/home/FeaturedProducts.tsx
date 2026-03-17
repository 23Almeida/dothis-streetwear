import Link from "next/link";
import type { Product } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-2">
            Destaques
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Mais Vendidos
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-medium tracking-widest uppercase text-neutral-400 hover:text-white transition-colors border-b border-neutral-700 hover:border-white pb-0.5"
        >
          Ver Tudo
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
