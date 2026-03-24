"use client";

import Link from "next/link";
import Image from "next/image";
import { useSite } from "@/context/SiteContext";
import EditableSection from "@/components/editor/EditableSection";

const shopLinks = [
  { href: "/shop", label: "Todos os Produtos" },
  { href: "/shop?category=camisetas", label: "Camisetas" },
  { href: "/shop?category=moletons", label: "Moletons" },
  { href: "/shop?category=calcas", label: "Calças" },
  { href: "/shop?category=jaquetas", label: "Jaquetas" },
];

const infoLinks = [
  { href: "/sobre", label: "Sobre a Marca" },
  { href: "/contato", label: "Contato" },
  { href: "/faq", label: "FAQ" },
  { href: "/trocas", label: "Trocas e Devoluções" },
  { href: "/envio", label: "Política de Envio" },
];

const accountLinks = [
  { href: "/account", label: "Minha Conta" },
  { href: "/account/orders", label: "Meus Pedidos" },
  { href: "/login", label: "Login" },
];

export default function FooterClient() {
  const { settings } = useSite();
  const { brand, social } = settings;

  return (
    <footer className="bg-neutral-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

          {/* Brand — editável */}
          <EditableSection
            section="brand"
            label="Identidade"
            className="col-span-2 md:col-span-1"
            fields={[
              { key: "name", label: "Nome da marca", placeholder: "DOTHIS" },
              { key: "description", label: "Descrição", rows: 3, placeholder: "Streetwear nacional..." },
            ]}
          >
            <div>
              <Link href="/">
                <Image src={brand.logo} alt={brand.name} width={100} height={34} className="object-contain" />
              </Link>
              <p className="mt-4 text-sm text-neutral-500 leading-relaxed">{brand.description}</p>
              <EditableSection
                section="social"
                label="Redes Sociais"
                fields={[
                  { key: "instagram", label: "Instagram (URL)", placeholder: "https://instagram.com/..." },
                  { key: "tiktok", label: "TikTok (URL)", placeholder: "https://tiktok.com/@..." },
                  { key: "twitter", label: "Twitter/X (URL)", placeholder: "https://twitter.com/..." },
                  { key: "youtube", label: "YouTube (URL)", placeholder: "https://youtube.com/..." },
                  { key: "whatsapp", label: "WhatsApp (número)", placeholder: "5511999999999" },
                ]}
              >
                <div className="flex gap-4 mt-6">
                  {social.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="Instagram">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="Twitter/X">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  )}
                  {social.youtube && (
                    <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="YouTube">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  )}
                  {social.tiktok && (
                    <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="TikTok">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
                    </a>
                  )}
                  {!social.instagram && !social.twitter && !social.youtube && !social.tiktok && (
                    <span className="text-xs text-neutral-700">Redes sociais</span>
                  )}
                </div>
              </EditableSection>
            </div>
          </EditableSection>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">Shop</h3>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">Informações</h3>
            <ul className="flex flex-col gap-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">Conta</h3>
            <ul className="flex flex-col gap-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-500 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">© {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="text-xs text-neutral-600 hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="text-xs text-neutral-600 hover:text-white transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
