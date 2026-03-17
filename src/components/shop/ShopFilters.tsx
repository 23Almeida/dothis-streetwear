"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

const SIZES = ["P", "M", "G", "GG", "XGG"];

const SORT_OPTIONS = [
  { value: "newest", label: "Mais Novos" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "popular", label: "Populares" },
];

interface ShopFiltersProps {
  categories: Category[];
  totalCount: number;
}

export default function ShopFilters({ categories, totalCount }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeSort = searchParams.get("sort") || "newest";
  const activeSizes = searchParams.getAll("size");

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleSize = useCallback(
    (size: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll("size");
      params.delete("size");
      if (current.includes(size)) {
        current.filter((s) => s !== size).forEach((s) => params.append("size", s));
      } else {
        [...current, size].forEach((s) => params.append("size", s));
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-white/10">
        <SlidersHorizontal size={16} className="text-neutral-400" />
        <span className="text-xs font-bold tracking-widest uppercase text-white">
          Filtros
        </span>
        <span className="ml-auto text-xs text-neutral-600">
          {totalCount} produtos
        </span>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
          Ordenar por
        </h3>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("sort", opt.value)}
              className={cn(
                "text-left text-sm transition-colors",
                activeSort === opt.value
                  ? "text-white font-medium"
                  : "text-neutral-500 hover:text-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
          Categoria
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => updateParam("category", null)}
            className={cn(
              "text-left text-sm transition-colors",
              !activeCategory
                ? "text-white font-medium"
                : "text-neutral-500 hover:text-white"
            )}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                updateParam(
                  "category",
                  activeCategory === cat.slug ? null : cat.slug
                )
              }
              className={cn(
                "text-left text-sm transition-colors",
                activeCategory === cat.slug
                  ? "text-white font-medium"
                  : "text-neutral-500 hover:text-white"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
          Tamanho
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "w-10 h-10 text-xs font-medium border transition-all",
                activeSizes.includes(size)
                  ? "border-white bg-white text-black"
                  : "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {(activeCategory || activeSizes.length > 0) && (
        <button
          onClick={() => router.push("/shop")}
          className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-4 text-left"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
