"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Youtube } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import { useSiteContent } from "@/contexts/SiteContentContext";

const footerLinks = {
  info: [
    { href: "/sobre", label: "Sobre a Marca" },
    { href: "/contato", label: "Contato" },
    { href: "/faq", label: "FAQ" },
    { href: "/trocas", label: "Trocas e Devoluções" },
    { href: "/envio", label: "Política de Envio" },
  ],
  account: [
    { href: "/account", label: "Minha Conta" },
    { href: "/account/orders", label: "Meus Pedidos" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Cadastrar" },
  ],
};

export default function Footer() {
  const { content, categories } = useSiteContent();
  const logoSrc = content["logo.src"] ?? "/Logo.png";

  return (
    <footer className="bg-neutral-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <Image
                src={logoSrc}
                alt="DOTHIS"
                width={100}
                height={34}
                className="object-contain"
              />
            </Link>
            <EditableText
              contentKey="footer.description"
              tag="p"
              multiline
              className="mt-4 text-sm text-neutral-500 leading-relaxed"
            />
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">
              Shop
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/shop" className="text-sm text-neutral-500 hover:text-white transition-colors">
                  Todos os Produtos
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">
              Informações
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-4">
              Conta
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} DOTHIS. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="text-xs text-neutral-600 hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="text-xs text-neutral-600 hover:text-white transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
