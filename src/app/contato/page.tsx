import { createClient } from "@/lib/supabase/server";
import { defaultSettings } from "@/lib/settings";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

async function getContactSettings() {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as any)
      .from("site_settings").select("value").eq("key", "contact").single();
    return { ...defaultSettings.contact, ...(data?.value || {}) };
  } catch {
    return defaultSettings.contact;
  }
}

export default async function ContatoPage() {
  const contact = await getContactSettings();

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-black tracking-tight text-white mb-4">Contato</h1>
        <p className="text-neutral-400 mb-12">Fale com a gente. Respondemos em até 24 horas.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="flex flex-col gap-6">
            {contact.email && (
              <div className="flex items-start gap-4">
                <Mail size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-white hover:text-neutral-300 transition-colors">{contact.email}</a>
                </div>
              </div>
            )}
            {contact.whatsapp && (
              <div className="flex items-start gap-4">
                <Phone size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">WhatsApp</p>
                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-neutral-300 transition-colors">+{contact.whatsapp}</a>
                </div>
              </div>
            )}
            {contact.hours && (
              <div className="flex items-start gap-4">
                <Clock size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Atendimento</p>
                  <p className="text-white">{contact.hours}</p>
                </div>
              </div>
            )}
            {contact.address && (
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Endereço</p>
                  <p className="text-white">{contact.address}</p>
                  {contact.city && <p className="text-neutral-400 text-sm">{contact.city}</p>}
                </div>
              </div>
            )}
            {!contact.email && !contact.whatsapp && (
              <p className="text-neutral-600 text-sm">Configure as informações de contato no painel admin.</p>
            )}
          </div>

          {/* FAQ link */}
          <div className="bg-neutral-950 border border-white/10 p-8 flex flex-col gap-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-white">Dúvidas Frequentes</h2>
            <p className="text-sm text-neutral-400">Confira nosso FAQ antes de entrar em contato. Pode ser que já tenhamos a resposta que você precisa.</p>
            <a href="/faq" className="text-sm font-bold text-white hover:text-neutral-300 transition-colors uppercase tracking-widest">
              Ver FAQ →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
