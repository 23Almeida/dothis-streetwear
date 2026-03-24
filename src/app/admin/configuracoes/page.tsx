import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { defaultSettings } from "@/lib/settings";
import SettingsEditor from "./SettingsEditor";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await (supabase as any)
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  // Load current settings
  const { data: rows } = await (supabase as any)
    .from("site_settings").select("key, value");

  const settings: any = { ...defaultSettings };
  if (rows) {
    for (const row of rows) {
      settings[row.key] = { ...settings[row.key], ...row.value };
    }
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white">Configurações do Site</h1>
          <p className="text-neutral-500 text-sm mt-1">Edite todos os textos, links e informações do site aqui.</p>
        </div>
        <SettingsEditor initialSettings={settings} />
      </div>
    </div>
  );
}
