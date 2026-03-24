"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Logo3D from "./Logo3D";
import EditableSection from "@/components/editor/EditableSection";
import { useSite } from "@/context/SiteContext";

export default function HeroClient() {
  const { settings } = useSite();
  const hero = settings.hero;

  return (
    <EditableSection
      section="hero"
      label="Hero"
      fields={[
        { key: "subtitle", label: "Subtítulo (ex: DROP 2026)", placeholder: "DROP 2026" },
        { key: "description", label: "Descrição", placeholder: "Peças limitadas...", rows: 3 },
        { key: "ctaText", label: "Texto do botão", placeholder: "Shop Now" },
        { key: "ctaLink", label: "Link do botão", placeholder: "/shop" },
        { key: "backgroundImage", label: "URL da foto de fundo", type: "url", placeholder: "https://..." },
      ]}
    >
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {hero.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold tracking-[0.5em] uppercase text-neutral-400 mb-10">
            {hero.subtitle}
          </p>
          <div className="mb-10">
            <Logo3D />
          </div>
          <p className="text-base sm:text-lg text-neutral-300 max-w-md mx-auto mb-10 leading-relaxed">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={hero.ctaLink}>
              <Button size="lg" variant="primary">{hero.ctaText}</Button>
            </Link>
            <Link href="/shop?tag=new">
              <Button size="lg" variant="outline">Novidades</Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/30 animate-pulse" />
          <span className="text-[10px] tracking-widest uppercase text-neutral-600">Scroll</span>
        </div>
      </section>
    </EditableSection>
  );
}
