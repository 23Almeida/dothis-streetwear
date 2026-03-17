import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = { title: "Pedido Confirmado — DOTHIS" };

interface Props {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function CheckoutSucessoPage({ searchParams }: Props) {
  const { order_id } = await searchParams;
  const orderNum = order_id ? order_id.slice(-8).toUpperCase() : "";

  return (
    <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-400" />
        </div>

        <h1 className="text-3xl font-black text-white mb-3">Pedido Confirmado!</h1>
        <p className="text-neutral-400 mb-2">
          Pagamento aprovado com sucesso.
        </p>
        {orderNum && (
          <p className="text-neutral-600 text-sm mb-8">
            Pedido <span className="text-white font-mono font-bold">#{orderNum}</span>
          </p>
        )}
        <p className="text-neutral-500 text-sm mb-10">
          Você receberá um email de confirmação em breve. Acompanhe o status do seu pedido na sua conta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {order_id && (
            <Link href={`/account/orders/${order_id}`}>
              <Button variant="primary" size="lg">Ver Pedido</Button>
            </Link>
          )}
          <Link href="/shop">
            <Button variant="outline" size="lg">Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
