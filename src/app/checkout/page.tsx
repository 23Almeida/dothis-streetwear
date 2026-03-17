"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useSupabase } from "@/hooks/useSupabase";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const ESTADOS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    name: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "SP",
    zip: "",
    country: "Brasil",
  });

  const sub = subtotal();
  const shipping = sub > 299 ? 0 : 29.9;
  const total = sub + shipping;

  const handleChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        subtotal: sub,
        shipping,
        total,
        shipping_address: address,
      })
      .select()
      .single();

    if (orderError || !order) {
      setError("Erro ao criar pedido. Tente novamente.");
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product.price,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("order_items").insert(orderItems);

    clearCart();
    router.push(`/account/orders/${order.id}?success=true`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-6">Seu carrinho está vazio</p>
          <Link href="/shop">
            <Button>Ir às Compras</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black tracking-tight text-white mb-10">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-6">
                Endereço de Entrega
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Nome Completo"
                    placeholder="Quem vai receber"
                    value={address.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="CEP"
                    placeholder="00000-000"
                    value={address.zip}
                    onChange={(e) => handleChange("zip", e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Rua / Avenida"
                    placeholder="Nome da rua"
                    value={address.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Número"
                  placeholder="123"
                  value={address.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  required
                />
                <Input
                  label="Complemento"
                  placeholder="Apto, bloco (opcional)"
                  value={address.complement}
                  onChange={(e) => handleChange("complement", e.target.value)}
                />
                <Input
                  label="Bairro"
                  placeholder="Seu bairro"
                  value={address.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  required
                />
                <Input
                  label="Cidade"
                  placeholder="Sua cidade"
                  value={address.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
                <Select
                  label="Estado"
                  value={address.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  options={ESTADOS}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-950 border border-white/10 p-6 sticky top-24">
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-6">
                  Resumo
                </h2>

                <div className="flex flex-col gap-3 text-sm mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2">
                      <span className="text-neutral-400 truncate">
                        {item.product.name}{" "}
                        <span className="text-neutral-600">×{item.quantity}</span>
                      </span>
                      <span className="flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <hr className="border-white/10" />

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

                  <hr className="border-white/10" />

                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs mb-4">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                >
                  Confirmar Pedido
                </Button>

                <p className="text-xs text-neutral-600 text-center mt-4">
                  Pagamento processado com segurança
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
