"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { addItem } = useCartStore();

  const sizes = [...new Set(product.variants?.map((v) => v.size) || [])];
  const colors = [...new Set(product.variants?.map((v) => v.color) || [])];
  const isOnSale =
    product.compare_at_price && product.compare_at_price > product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Selecione um tamanho");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      setError("Selecione uma cor");
      return;
    }

    const variant = product.variants?.find(
      (v) => v.size === selectedSize && (colors.length === 0 || v.color === selectedColor)
    );

    for (let i = 0; i < quantity; i++) {
      addItem(
        product,
        selectedSize,
        selectedColor || "Único",
        variant
      );
    }

    setError("");
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase mb-8"
        >
          <ChevronLeft size={14} />
          Voltar ao Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square border-2 transition-all overflow-hidden ${
                      selectedImage === i
                        ? "border-white"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] bg-neutral-900 relative overflow-hidden">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag size={60} className="text-neutral-700" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isOnSale && <Badge variant="sale">Sale</Badge>}
                {product.tags.includes("new") && <Badge variant="new">New</Badge>}
                {product.tags.includes("limited") && (
                  <Badge variant="limited">Limited</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-white transition-colors mb-3"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {isOnSale && product.compare_at_price && (
                <>
                  <span className="text-lg text-neutral-500 line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                  <Badge variant="sale">
                    -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
                  Cor: <span className="text-white">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-medium border transition-all ${
                        selectedColor === color
                          ? "border-white bg-white text-black"
                          : "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
                  Tamanho: <span className="text-white">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 text-sm font-medium border transition-all ${
                        selectedSize === size
                          ? "border-white bg-white text-black"
                          : "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
                Quantidade
              </p>
              <div className="flex items-center border border-neutral-700 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs mb-4">{error}</p>
            )}

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              variant="primary"
              fullWidth
              disabled={product.stock === 0}
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
            </Button>

            {/* Details */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">SKU</span>
                  <span className="text-neutral-300 uppercase font-mono text-xs">
                    {product.slug.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Categoria</span>
                  <span className="text-neutral-300">{product.category?.name}</span>
                </div>
                {product.tags.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Tags</span>
                    <div className="flex gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="text-neutral-400 text-xs uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
