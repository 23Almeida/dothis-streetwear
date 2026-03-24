"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, X, Eye, Settings, Package, ShoppingBag, Tag } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useAuth } from "@/hooks/useAuth";

export default function AdminBar() {
  const { profile } = useAuth();
  const { editMode, toggleEditMode, saving } = useSite();
  const [expanded, setExpanded] = useState(false);

  if (profile?.role !== "admin") return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">

      {/* Quick links (visible when expanded) */}
      {expanded && (
        <div className="flex items-center gap-2 bg-neutral-900 border border-white/20 px-3 py-2 shadow-2xl">
          <Link href="/admin" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-2 py-1 hover:bg-white/5">
            <Settings size={12} /> Dashboard
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <Link href="/admin/produtos" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-2 py-1 hover:bg-white/5">
            <Package size={12} /> Produtos
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <Link href="/admin/pedidos" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-2 py-1 hover:bg-white/5">
            <ShoppingBag size={12} /> Pedidos
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <Link href="/admin/cupons" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-2 py-1 hover:bg-white/5">
            <Tag size={12} /> Cupons
          </Link>
        </div>
      )}

      {/* Main bar */}
      <div className="flex items-center gap-0 bg-neutral-950 border border-white/20 shadow-2xl overflow-hidden">
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white hover:bg-white/5 transition-colors border-r border-white/10"
        >
          {expanded ? <X size={12} /> : <Settings size={12} />}
        </button>

        {/* Brand */}
        <span className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-neutral-600 border-r border-white/10">
          Admin
        </span>

        {/* Edit mode toggle */}
        <button
          onClick={toggleEditMode}
          className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
            editMode
              ? "bg-orange-500 text-black hover:bg-orange-400"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {editMode ? (
            <><Eye size={12} /> Sair do Editor</>
          ) : (
            <><Pencil size={12} /> Editar Site</>
          )}
        </button>

        {/* Saving indicator */}
        {saving && (
          <div className="px-3 py-2.5 border-l border-white/10">
            <span className="text-[10px] text-orange-400 animate-pulse font-bold uppercase tracking-widest">Salvando...</span>
          </div>
        )}
      </div>

      {/* Edit mode hint */}
      {editMode && (
        <p className="text-[10px] text-orange-400/70 uppercase tracking-widest">
          Clique em qualquer seção para editar
        </p>
      )}
    </div>
  );
}
