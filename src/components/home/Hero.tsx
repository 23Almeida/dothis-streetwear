import Link from "next/link";
import Button from "@/components/ui/Button";
import Logo3D from "./Logo3D";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs font-bold tracking-[0.5em] uppercase text-neutral-400 mb-10">
          Nova Coleção — Drop 2024
        </p>

        {/* Logo 3D girando */}
        <div className="mb-10">
          <Logo3D />
        </div>

        <p className="text-base sm:text-lg text-neutral-300 max-w-md mx-auto mb-10 leading-relaxed">
          Streetwear nacional com identidade própria. Cada peça é uma declaração.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/shop">
            <Button size="lg" variant="primary">
              Ver Coleção
            </Button>
          </Link>
          <Link href="/shop?tag=new">
            <Button size="lg" variant="outline">
              Novidades
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/30 animate-pulse" />
        <span className="text-[10px] tracking-widest uppercase text-neutral-600">
          Scroll
        </span>
      </div>
    </section>
  );
}
