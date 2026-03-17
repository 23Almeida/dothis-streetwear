import Link from "next/link";
import { Clock } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = { title: "Pagamento Pendente — DOTHIS" };

interface Props {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function CheckoutPendentePage({ searchParams }: Props) {
  const { order_id } = await searchParams;

  return (
    <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Clock size={64} className="text-yellow-400" />
        </div>

        <h1 className="text-3xl font-black text-white mb-3">Pagamento Pendente</h1>
        <p className="text-neutral-400 mb-8">
          Seu pagamento está sendo processado. Pode levar alguns minutos. Acompanhe o status do pedido na sua conta.
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
