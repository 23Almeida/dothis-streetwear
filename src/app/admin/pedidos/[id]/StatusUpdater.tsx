"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import Button from "@/components/ui/Button";

const STATUS_OPTIONS = [
  { value: "pending",    label: "Aguardando" },
  { value: "confirmed",  label: "Confirmado" },
  { value: "processing", label: "Em Separação" },
  { value: "shipped",    label: "Enviado" },
  { value: "delivered",  label: "Entregue" },
  { value: "cancelled",  label: "Cancelado" },
];

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function StatusUpdater({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = useSupabase();
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    await (supabase as any).from("orders").update({ status }).eq("id", orderId);
    setSaved(true);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); setSaved(false); }}
        className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <Button
        onClick={handleSave}
        loading={loading}
        disabled={status === currentStatus && !saved}
        fullWidth
        variant={saved ? "secondary" : "primary"}
      >
        {saved ? "✓ Salvo!" : "Salvar Status"}
      </Button>
    </div>
  );
}
