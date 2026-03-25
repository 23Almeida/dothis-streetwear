"use client";

import EditableSection from "@/components/editor/EditableSection";
import { useSite } from "@/context/SiteContext";

export default function MarqueeBar() {
  const { settings } = useSite();
  const raw = settings.marquee?.items || "Streetwear Nacional · Drop Exclusivo · Qualidade Premium";
  const items = raw.split("·").map((s) => s.trim()).filter(Boolean);

  const repeated = [...items, ...items, ...items];

  return (
    <EditableSection
      section="marquee"
      label="Faixa de Texto"
      fields={[{
        key: "items",
        label: "Frases (separadas por ·)",
        placeholder: "Streetwear Nacional · Drop Exclusivo · Qualidade Premium",
        rows: 3,
      }]}
    >
      <div className="bg-neutral-950 border-y border-white/5 text-white py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {repeated.map((item, i) => (
            <span key={i} className="text-[10px] font-bold tracking-[0.35em] uppercase mx-8 text-neutral-300">
              {item} <span className="mx-4 opacity-25 text-white">✦</span>
            </span>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
