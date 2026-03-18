"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Loader2, MapPin, Tag, CheckCircle, X } from "lucide-react";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

function calcShipping(state: string, subtotal: number): number {
  if (subtotal >= 299) return 0;
  const southeast = ["SP", "RJ", "MG", "ES"];
  const south = ["PR", "SC", "RS"];
  if (southeast.includes(state)) return 15;
  if (south.includes(state)) return 18;
  return 25;
}

interface CouponResult {
  couponId: string;
  code: string;
  discountAmount: number;
  description: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);

  const [address, setAddress] = useState({
    name: "",
    zip: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "SP",
    country: "Brasil",
  });

  const sub = subtotal();
  const shipping = calcShipping(address.state, sub);
  const discount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(0, sub + shipping - discount);

  const handleChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepLookup = async () => {
    const cep = address.zip.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          district: data.bairro || prev.district,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {}
    setCepLoading(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: sub }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setCouponError(data.error || "Cupom inválido");
      } else {
        setAppliedCoupon(data);
        setCouponCode("");
      }
    } catch {
      setCouponError("Erro ao validar cupom");
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.zip || !address.street || !address.number || !address.city) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          subtotal: sub,
          shipping,
          discount,
          total,
          couponId: appliedCoupon?.couponId ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Erro ao processar pagamento");
        setLoading(false);
        return;
      }

      clearCart();
      const isSandbox = process.env.NEXT_PUBLIC_MP_SANDBOX === "true";
      window.location.href = isSandbox ? data.sandboxInitPoint : data.initPoint;
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
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
        <h1 className="text-3xl font-black tracking-tight text-white mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Address */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-6">
                  Dados do Destinatário
                </h2>
                <Input
                  label="Nome completo"
                  placeholder="Seu nome"
                  value={address.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-6">
                  Endereço de Entrega
                </h2>

                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <Input
                      label="CEP"
                      placeholder="00000-000"
                      value={address.zip}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                        const formatted = v.length > 5 ? `${v.slice(0,5)}-${v.slice(5)}` : v;
                        handleChange("zip", formatted);
                      }}
                      onBlur={handleCepLookup}
                      required
                    />
                  </div>
                  <div className="flex items-end pb-0">
                    <button
                      type="button"
                      onClick={handleCepLookup}
                      disabled={cepLoading}
                      className="h-[46px] px-4 bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:border-white transition-colors flex items-center gap-2 text-xs"
                    >
                      {cepLoading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                      Buscar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Rua / Logradouro"
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
                    label="Complemento (opcional)"
                    placeholder="Apto 42, Bloco B..."
                    value={address.complement}
                    onChange={(e) => handleChange("complement", e.target.value)}
                  />
                  <Input
                    label="Bairro"
                    placeholder="Nome do bairro"
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
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Estado</label>
                    <select
                      value={address.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white"
                    >
                      {ESTADOS.map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
                  Cupom de Desconto
                </h2>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-950 border border-green-800 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-green-400">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600">{appliedCoupon.description} aplicado</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-neutral-500 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="PRIMEIRACOMPRA"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="h-[46px] px-4 bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:border-white transition-colors flex items-center gap-2 text-xs disabled:opacity-50"
                      >
                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />}
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-950 border border-white/10 p-6 sticky top-24">
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-6">
                  Resumo do Pedido
                </h2>

                <div className="flex flex-col gap-3 text-sm mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2">
                      <span className="text-neutral-400 truncate">
                        {item.product.name}{" "}
                        <span className="text-neutral-600">×{item.quantity}</span>
                      </span>
                      <span className="flex-shrink-0 text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <hr className="border-white/10 my-2" />

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
                  {sub < 299 && (
                    <p className="text-xs text-neutral-600">
                      Frete grátis para compras acima de {formatPrice(299)}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Desconto ({appliedCoupon.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <hr className="border-white/10 my-1" />

                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                  Ir para Pagamento
                </Button>

                <p className="text-xs text-neutral-600 text-center mt-4">
                  Pagamento seguro via Mercado Pago
                </p>
                <p className="text-xs text-neutral-600 text-center mt-1">
                  PIX · Cartão · Boleto
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
