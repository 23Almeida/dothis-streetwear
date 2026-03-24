"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Pencil } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { useSite } from "@/context/SiteContext";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const { addItem } = useCartStore();
  const { profile } = useAuth();
  const { editMode } = useSite();

  const isAdmin = profile?.role === "admin";
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
  const isNew = product.tags.includes("new");
  const isLimited = product.tags.includes("limited");
  const isSoldOut = product.stock === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, "M", "Preto");
  };

  return (
    <div className="relative group/card">
      {/* Admin edit button — visible in edit mode or on hover when admin */}
      {isAdmin && (editMode || isHovered) && (
        <Link
          href={`/admin/produtos/editar/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-wider px-2 py-1 hover:bg-orange-400 transition-colors"
        >
          <Pencil size={10} /> Editar
        </Link>
      )}

      <Link
        href={`/shop/${product.slug}`}
        className="block"
        onMouseEnter={() => {
          setIsHovered(true);
          if (product.images.length > 1) setImageIdx(1);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setImageIdx(0);
        }}
      >
        <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
          {product.images[imageIdx] ? (
            <Image
              src={product.images[imageIdx]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover/card:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
              <ShoppingBag size={40} className="text-neutral-700" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isSoldOut && <Badge variant="sold-out">Esgotado</Badge>}
            {!isSoldOut && isOnSale && <Badge variant="sale">Sale</Badge>}
            {!isSoldOut && isNew && <Badge variant="new">New</Badge>}
            {!isSoldOut && isLimited && <Badge variant="limited">Limited</Badge>}
          </div>

          {!isSoldOut && (
            <button
              onClick={handleQuickAdd}
              className={`absolute bottom-0 left-0 right-0 bg-white text-black py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
            >
              + Adicionar ao Carrinho
            </button>
          )}
        </div>

        <div className="pt-3 pb-1">
          <h3 className="text-sm font-medium text-white group-hover/card:text-neutral-300 transition-colors truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-white">{formatPrice(product.price)}</span>
            {isOnSale && product.compare_at_price && (
              <span className="text-xs text-neutral-500 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
