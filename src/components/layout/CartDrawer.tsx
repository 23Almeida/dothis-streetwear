"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();
  const sub = subtotal();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-neutral-950 border-l border-white/10 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <span className="font-bold tracking-widest uppercase text-sm">
              Carrinho ({items.length})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-neutral-700" />
              <p className="text-neutral-400 text-sm">Seu carrinho está vazio</p>
              <Button variant="outline" onClick={closeCart}>
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-white/5"
                >
                  {/* Image */}
                  <div className="w-20 h-24 bg-neutral-900 flex-shrink-0 relative overflow-hidden">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {item.size} · {item.color}
                    </p>
                    <p className="text-sm font-bold text-white mt-2">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-white/20">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-white/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-400">Subtotal</span>
              <span className="font-bold">{formatPrice(sub)}</span>
            </div>
            <p className="text-xs text-neutral-600 mb-4">
              Frete calculado no checkout
            </p>
            <Link href="/checkout" onClick={closeCart}>
              <Button variant="primary" fullWidth size="lg">
                Finalizar Compra
              </Button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-xs text-neutral-500 hover:text-white transition-colors mt-3"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
