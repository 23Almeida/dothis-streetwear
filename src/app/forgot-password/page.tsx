"use client";

import { useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/hooks/useSupabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError("Não foi possível enviar o email. Verifique o endereço e tente novamente.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white mb-3 tracking-tight">Verifique seu email</h1>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Enviamos um link de redefinição para{" "}
            <strong className="text-white">{email}</strong>.
          </p>
          <Link href="/login">
            <Button variant="outline">Voltar ao Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-black tracking-[0.3em] text-white">
            DOTHIS
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white mt-8 mb-2">
            Esqueceu a senha?
          </h1>
          <p className="text-neutral-500 text-sm">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Enviar Link
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-xs text-neutral-600 hover:text-white transition-colors">
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}
