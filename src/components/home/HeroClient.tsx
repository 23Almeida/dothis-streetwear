"use client";

import Link from "next/link";
import Image from "next/image";
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        {hero.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${hero.backgroundImage}')`, opacity: 0.45 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.7em] uppercase text-neutral-500 mb-10">
            {hero.subtitle}
          </p>

          <div className="mb-10 flex items-center justify-center">
            <Image
              src="/Logo.png"
              alt="DOTHIS"
              width={300}
              height={100}
              className="object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              priority
            />
          </div>

          <p className="text-sm sm:text-base text-neutral-400 max-w-sm mx-auto mb-12 leading-relaxed tracking-wide">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <Link href={hero.ctaLink}>
              <button className="bg-white text-black text-xs font-black tracking-[0.2em] uppercase px-10 py-4 hover:bg-neutral-200 transition-all duration-200 active:scale-95">
                {hero.ctaText}
              </button>
            </Link>
            <Link
              href="/shop?tag=new"
              className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              Novidades <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-white/20 animate-pulse" />
          <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-700">Scroll</span>
        </div>
      </section>
    </EditableSection>
  );
}
