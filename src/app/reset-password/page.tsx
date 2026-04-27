"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function ResetForm() {
  const supabase = useSupabase();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the session in the URL hash after the user clicks the email link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("As senhas não coincidem"); return; }
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres"); return; }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/"), 2000);
  };

  if (done) {
    return (
      <div className="text-center">
        <p className="text-green-400 font-bold mb-2">Senha alterada com sucesso!</p>
        <p className="text-neutral-500 text-sm">Redirecionando...</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="text-center">
        <p className="text-neutral-400 text-sm">Link inválido ou expirado.</p>
        <Link href="/login" className="text-white text-sm hover:underline mt-4 inline-block">Voltar ao login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="password"
        label="Nova senha"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        type="password"
        label="Confirmar senha"
        placeholder="••••••••"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
        Salvar nova senha
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-black tracking-[0.3em] text-white">DOTHIS</Link>
          <h1 className="text-2xl font-black tracking-tight text-white mt-8 mb-2">Nova Senha</h1>
          <p className="text-neutral-500 text-sm">Digite sua nova senha abaixo</p>
        </div>
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
