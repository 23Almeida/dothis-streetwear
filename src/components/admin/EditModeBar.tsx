"use client";

import { Pencil, X, Eye } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function EditModeBar() {
  const { isAdmin, isEditMode, toggleEditMode } = useSiteContent();

  if (!isAdmin) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 shadow-2xl transition-all duration-200 ${
        isEditMode
          ? "bg-blue-600 text-white"
          : "bg-neutral-900 border border-white/20 text-white"
      }`}
    >
      {isEditMode ? (
        <Eye size={14} className="opacity-70" />
      ) : (
        <Pencil size={14} className="opacity-70" />
      )}
      <span className="text-[11px] font-bold tracking-widest uppercase select-none">
        {isEditMode ? "Editando Página" : "Admin"}
      </span>

      <button
        onClick={toggleEditMode}
        className={`flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 transition-colors ${
          isEditMode
            ? "bg-white/20 hover:bg-white/30"
            : "bg-white text-black hover:bg-neutral-200"
        }`}
      >
        {isEditMode ? (
          <>
            <X size={11} /> Sair
          </>
        ) : (
          <>
            <Pencil size={11} /> Editar
          </>
        )}
      </button>

      {!isEditMode && (
        <Link
          href="/admin"
          className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors"
        >
          Painel →
        </Link>
      )}
    </div>
  );
}
