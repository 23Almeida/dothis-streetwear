import Link from "next/link";
import { XCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = { title: "Pagamento Recusado — DOTHIS" };

export default function CheckoutFalhaPage() {
  return (
    <div className="min-h-screen bg-black pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <XCircle size={64} className="text-red-400" />
        </div>

        <h1 className="text-3xl font-black text-white mb-3">Pagamento Recusado</h1>
        <p className="text-neutral-400 mb-8">
          Não foi possível processar o pagamento. Verifique os dados do cartão e tente novamente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout">
            <Button variant="primary" size="lg">Tentar Novamente</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">Voltar ao Shop</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
