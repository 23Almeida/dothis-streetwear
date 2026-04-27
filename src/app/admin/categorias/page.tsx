"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2, Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then((d) => { setCategories(d.categories || []); setLoading(false); });
  }, []);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setError("");
  };

  const cancelEdit = () => { setEditingId(null); setEditName(""); };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    const res = await fetch("/api/categorias", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName.trim(), slug: slugify(editName.trim()) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Erro ao salvar"); setSaving(false); return; }
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, name: editName.trim(), slug: slugify(editName.trim()) } : c));
    setEditingId(null);
    setSaving(false);
  };

  const addCategory = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    setError("");
    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), slug: slugify(newName.trim()) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Erro ao criar"); setAdding(false); return; }
    setCategories((prev) => [...prev, data.category]);
    setNewName("");
    setAdding(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Excluir esta categoria? Produtos vinculados perderão a categoria.")) return;
    const res = await fetch("/api/categorias", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-1">Painel</p>
          <h1 className="text-3xl font-black text-white">Categorias</h1>
        </div>

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        {loading ? (
          <div className="flex items-center gap-2 text-neutral-500">
            <Loader2 size={16} className="animate-spin" /> Carregando...
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 border border-white/10 px-4 py-3">
                {editingId === cat.id ? (
                  <>
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(cat.id); if (e.key === "Escape") cancelEdit(); }}
                      className="flex-1 bg-neutral-900 border border-white/20 text-white px-3 py-1.5 text-sm outline-none focus:border-white"
                    />
                    <button onClick={() => saveEdit(cat.id)} disabled={saving} className="text-green-400 hover:text-green-300 p-1">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    </button>
                    <button onClick={cancelEdit} className="text-neutral-500 hover:text-white p-1">
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-sm text-white font-bold">{cat.name}</p>
                      <p className="text-[10px] text-neutral-600 font-mono">/shop?category={cat.slug}</p>
                    </div>
                    <button onClick={() => startEdit(cat)} className="text-neutral-500 hover:text-white p-1 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="text-neutral-700 hover:text-red-400 p-1 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* Nova categoria */}
            <div className="flex items-center gap-3 border border-dashed border-white/20 px-4 py-3 mt-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                placeholder="Nova categoria..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-neutral-600"
              />
              <button
                onClick={addCategory}
                disabled={adding || !newName.trim()}
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                {adding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                Adicionar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
