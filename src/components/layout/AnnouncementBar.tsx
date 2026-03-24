"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import EditableSection from "@/components/editor/EditableSection";

export default function AnnouncementBar() {
  const { settings } = useSite();
  const ann = settings.announcement;
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <EditableSection
      section="announcement"
      label="Barra de Anúncio"
      fields={[
        { key: "enabled", label: "Mostrar barra", type: "checkbox" },
        { key: "text", label: "Texto do anúncio", placeholder: "FRETE GRÁTIS acima de R$299" },
        { key: "link", label: "Link (opcional)", placeholder: "/shop" },
      ]}
    >
      {ann.enabled ? (
        <div className="bg-white text-black text-center py-2 px-4 text-xs font-bold tracking-widest uppercase relative">
          {ann.link ? (
            <Link href={ann.link} className="hover:underline">{ann.text}</Link>
          ) : (
            <span>{ann.text}</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}
    </EditableSection>
  );
}
