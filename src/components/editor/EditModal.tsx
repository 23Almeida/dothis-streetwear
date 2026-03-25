"use client";

import { useState, useEffect } from "react";
import { X, Save, Check } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import type { SiteSettings } from "@/lib/settings";

export interface EditField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url" | "email" | "checkbox";
  placeholder?: string;
  rows?: number;
}

interface EditModalProps {
  section: keyof SiteSettings;
  title: string;
  fields: EditField[];
  onClose: () => void;
}

export default function EditModal({ section, title, fields, onClose }: EditModalProps) {
  const { settings, updateSection, saving } = useSite();
  const current = settings[section] as Record<string, any>;

  const [form, setForm] = useState<Record<string, any>>({});
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setForm(Object.fromEntries(fields.map((f) => [f.key, current?.[f.key] ?? ""])));
  }, [section, current]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    const result = await updateSection(section, form);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError(result.error ?? "Erro ao salvar");
    }
  };

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-600 px-3 py-2.5 text-sm focus:outline-none focus:border-white";

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:w-[420px] h-full sm:h-auto sm:max-h-[90vh] bg-neutral-950 border-l border-white/10 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Editando</p>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                {field.label}
              </label>

              {field.type === "checkbox" ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.checked)}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="text-sm text-neutral-300">Ativado</span>
                </label>
              ) : field.rows ? (
                <textarea
                  value={form[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows}
                  className={`${inputClass} resize-y`}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>

        {saveError && (
          <div className="px-6 py-3 bg-red-950 border-t border-red-800 text-red-400 text-xs">
            {saveError}
          </div>
        )}

        <div className="flex items-center gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-xs font-black uppercase tracking-widest py-3 hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {saving ? <span className="animate-pulse">Salvando...</span>
              : saved ? <><Check size={14} /> Salvo!</>
              : <><Save size={14} /> Salvar</>}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 text-xs text-neutral-400 hover:text-white transition-colors border border-white/10 hover:border-white/40"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
