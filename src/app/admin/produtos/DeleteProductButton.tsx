"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";

interface Props {
  id: string;
  name: string;
}

export default function DeleteProductButton({ id, name }: Props) {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabase();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Deletar "${name}"? Esta ação não pode ser desfeita.`)) return;
    setLoading(true);
    await (supabase as any).from("products").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-neutral-500 hover:text-red-500 transition-colors border border-white/10 hover:border-red-500/40 disabled:opacity-40"
    >
      <Trash2 size={14} />
    </button>
  );
}
