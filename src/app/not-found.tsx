import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-neutral-900 mb-6">404</p>
        <h1 className="text-2xl font-black text-white mb-3">
          Página não encontrada
        </h1>
        <p className="text-neutral-500 text-sm mb-10">
          O link que você acessou não existe ou foi removido.
        </p>
        <Link href="/">
          <Button size="lg">Voltar ao Início</Button>
        </Link>
      </div>
    </div>
  );
}
