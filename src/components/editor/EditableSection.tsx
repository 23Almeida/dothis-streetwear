"use client";

import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import EditModal, { type EditField } from "./EditModal";
import type { SiteSettings } from "@/lib/settings";

interface EditableSectionProps {
  children: ReactNode;
  section: keyof SiteSettings;
  label: string;
  fields: EditField[];
  className?: string;
}

export default function EditableSection({ children, section, label, fields, className = "" }: EditableSectionProps) {
  const { editMode } = useSite();
  const [open, setOpen] = useState(false);

  if (!editMode) return <div className={className}>{children}</div>;

  return (
    <>
      <div
        className={`relative group cursor-pointer ${className}`}
        onClick={() => setOpen(true)}
      >
        {/* Highlight border */}
        <div className="absolute inset-0 border-2 border-orange-500/70 pointer-events-none z-10 group-hover:border-orange-400 transition-colors" />

        {/* Edit badge */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-wider px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Pencil size={10} />
          {label}
        </div>

        {/* Dim overlay on hover */}
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {children}
      </div>

      {open && (
        <EditModal
          section={section}
          title={label}
          fields={fields}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
