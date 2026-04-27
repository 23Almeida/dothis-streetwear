"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function LoginForm() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentReset, setSentReset] = useState(false);
  const supabase = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });
  }, [supabase, router]);

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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSentReset(true);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <Link href="/" className="text-2xl font-black tracking-[0.3em] text-white">
          DOTHIS
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-white mt-8 mb-2">
          {mode === "login" ? "Entrar" : "Recuperar Senha"}
        </h1>
        <p className="text-neutral-500 text-sm">
          {mode === "login" ? "Acesse sua conta para continuar" : "Enviaremos um link para seu email"}
        </p>
      </div>

      {mode === "login" ? (
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

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Entrar
          </Button>
        </form>
      ) : sentReset ? (
        <div className="text-center flex flex-col gap-4">
          <p className="text-green-400 font-bold">Email enviado!</p>
          <p className="text-neutral-400 text-sm">Verifique sua caixa de entrada e clique no link para redefinir sua senha.</p>
          <button
            onClick={() => { setMode("login"); setSentReset(false); }}
            className="text-xs text-neutral-500 hover:text-white transition-colors"
          >
            Voltar ao login
          </button>
        </div>
      ) : (
        <form onSubmit={handleForgot} className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Enviar link de recuperação
          </Button>

          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            className="text-xs text-neutral-500 hover:text-white transition-colors text-center"
          >
            Voltar ao login
          </button>
        </form>
      )}

      {mode === "login" && (
        <div className="mt-8 text-center flex flex-col gap-3">
          <p className="text-sm text-neutral-500">
            Não tem conta?{" "}
            <Link href="/register" className="text-white hover:underline">
              Criar conta
            </Link>
          </p>
          <button
            type="button"
            onClick={() => { setMode("forgot"); setError(""); }}
            className="text-xs text-neutral-600 hover:text-white transition-colors"
          >
            Esqueceu a senha?
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-16 px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
