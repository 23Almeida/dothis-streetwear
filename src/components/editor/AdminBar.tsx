"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, X, Eye, Settings, Package, ShoppingBag, Tag } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useAuth } from "@/hooks/useAuth";
import type { LucideIcon } from "lucide-react";

const ADMIN_LINKS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", Icon: Settings },
  { href: "/admin/produtos", label: "Produtos", Icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", Icon: ShoppingBag },
  { href: "/admin/cupons", label: "Cupons", Icon: Tag },
];

export default function AdminBar() {
  const { profile } = useAuth();
  const { editMode, toggleEditMode, saving } = useSite();
  const [expanded, setExpanded] = useState(false);

  if (profile?.role !== "admin") return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
      {expanded && (
        <div className="flex items-center gap-2 bg-neutral-900 border border-white/20 px-3 py-2 shadow-2xl">
          {ADMIN_LINKS.map(({ href, label, Icon }, i) => (
            <div key={href} className="flex items-center gap-2">
              {i > 0 && <div className="w-px h-4 bg-white/10" />}
              <Link
                href={href}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-2 py-1 hover:bg-white/5"
              >
                <Icon size={12} /> {label}
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center bg-neutral-950 border border-white/20 shadow-2xl overflow-hidden">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white hover:bg-white/5 transition-colors border-r border-white/10"
          aria-label={expanded ? "Fechar menu" : "Abrir menu"}
        >
          {expanded ? <X size={12} /> : <Settings size={12} />}
        </button>

        <span className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-neutral-600 border-r border-white/10">
          Admin
        </span>

        <button
          onClick={toggleEditMode}
          className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
            editMode ? "bg-orange-500 text-black hover:bg-orange-400" : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {editMode ? <><Eye size={12} /> Sair do Editor</> : <><Pencil size={12} /> Editar Site</>}
        </button>

        {saving && (
          <span className="px-3 py-2.5 border-l border-white/10 text-[10px] text-orange-400 animate-pulse font-bold uppercase tracking-widest">
            Salvando...
          </span>
        )}
      </div>

      {editMode && (
        <p className="text-[10px] text-orange-400/70 uppercase tracking-widest">
          Clique em qualquer seção para editar
        </p>
      )}
    </div>
  );
}
