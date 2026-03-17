"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Metadata } from "next";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou senha incorretos");
      setLoading(false);
      return;
    }

    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-black tracking-[0.3em] text-white">
            DOTHIS
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white mt-8 mb-2">
            Entrar
          </h1>
          <p className="text-neutral-500 text-sm">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-3">
          <p className="text-sm text-neutral-500">
            Não tem conta?{" "}
            <Link href="/register" className="text-white hover:underline">
              Criar conta
            </Link>
          </p>
          <Link href="#" className="text-xs text-neutral-600 hover:text-white transition-colors">
            Esqueceu a senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
