"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/hooks/useSupabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = useSupabase();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Não foi possível redefinir a senha. Tente solicitar um novo link.");
      setLoading(false);
      return;
    }

    router.push("/account");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-black tracking-[0.3em] text-white">
            DOTHIS
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white mt-8 mb-2">
            Nova Senha
          </h1>
          <p className="text-neutral-500 text-sm">
            Escolha uma nova senha para sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            label="Nova Senha"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Confirmar Senha"
            placeholder="Repita a nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Redefinir Senha
          </Button>
        </form>
      </div>
    </div>
  );
}
