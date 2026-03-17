"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = useSupabase();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-6">✉️</div>
          <h1 className="text-2xl font-black text-white mb-3">Verifique seu email</h1>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Enviamos um link de confirmação para <strong className="text-white">{email}</strong>.
            Clique no link para ativar sua conta.
          </p>
          <Link href="/login">
            <Button variant="outline">Ir para o Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-black tracking-[0.3em] text-white">
            DOTHIS
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white mt-8 mb-2">
            Criar Conta
          </h1>
          <p className="text-neutral-500 text-sm">
            Junte-se à comunidade DOTHIS
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <Input
            type="text"
            label="Nome Completo"
            placeholder="Seu nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Criar Conta
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Já tem conta?{" "}
            <Link href="/login" className="text-white hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
