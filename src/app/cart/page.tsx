"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const sub = subtotal();
  const shipping = sub > 299 ? 0 : 29.9;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={64} className="mx-auto text-neutral-700 mb-6" />
          <h1 className="text-2xl font-black text-white mb-3">Carrinho Vazio</h1>
          <p className="text-neutral-500 text-sm mb-8">
            Adicione produtos para continuar
          </p>
          <Link href="/shop">
            <Button size="lg">Ir às Compras</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black tracking-tight text-white mb-10">
          Carrinho ({items.length} {items.length === 1 ? "item" : "itens"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 py-6 border-b border-white/10"
              >
                <div className="w-24 h-32 bg-neutral-900 relative overflow-hidden flex-shrink-0">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link
                        href={`/shop/${item.product.slug}`}
                        className="font-medium text-white hover:text-neutral-300 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.size} · {item.color}
                      </p>
                    </div>
                    <p className="font-bold text-white whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-neutral-700">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-9 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-600 hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
                    >
                      <Trash2 size={14} />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-950 border border-white/10 p-6 sticky top-24">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white mb-6">
                Resumo do Pedido
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Frete</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-400">Grátis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-neutral-600">
                    Frete grátis acima de {formatPrice(299)}
                  </p>
                )}
                <hr className="border-white/10 my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button variant="primary" fullWidth size="lg" className="mt-6">
                  Finalizar Compra
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="ghost" fullWidth className="mt-2 text-xs text-neutral-500">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
