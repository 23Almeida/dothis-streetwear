"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Logo3D from "./Logo3D";
import EditableText from "@/components/admin/EditableText";
import { EditBgButton } from "@/components/admin/EditableImage";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function Hero() {
  const { content } = useSiteContent();
  const bgImage = content["hero.bg_image"] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      {/* Admin: editar imagem de fundo */}
      <EditBgButton contentKey="hero.bg_image" label="Trocar Fundo" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <EditableText
          contentKey="hero.badge"
          tag="p"
          className="text-xs font-bold tracking-[0.5em] uppercase text-neutral-400 mb-10"
        />

        {/* Logo 3D girando */}
        <div className="mb-10">
          <Logo3D />
        </div>

        <EditableText
          contentKey="hero.subtitle"
          tag="p"
          multiline
          className="text-base sm:text-lg text-neutral-300 max-w-md mx-auto mb-10 leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/shop">
            <Button size="lg" variant="primary">
              <EditableText contentKey="hero.cta_primary" className="inline" />
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" variant="outline">
              <EditableText contentKey="hero.cta_secondary" className="inline" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/30 animate-pulse" />
        <span className="text-[10px] tracking-widest uppercase text-neutral-600">Scroll</span>
      </div>
    </section>
  );
}
