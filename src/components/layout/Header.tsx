"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User, Menu, X, Search, Pencil, Plus, Trash2, GripVertical } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/contexts/SiteContentContext";

interface NavLink { href: string; label: string; }

const FALLBACK_NAV: NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=camisetas", label: "Camisetas" },
  { href: "/shop?category=moletons", label: "Moletons" },
  { href: "/shop?category=calcas", label: "Calças" },
  { href: "/shop?category=jaquetas", label: "Jaquetas" },
  { href: "/shop?category=acessorios", label: "Acessórios" },
];

function parseNavLinks(raw: string | undefined): NavLink[] {
  if (!raw) return FALLBACK_NAV;
  try { return JSON.parse(raw); } catch { return FALLBACK_NAV; }
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [editNavOpen, setEditNavOpen] = useState(false);
  const [draftLinks, setDraftLinks] = useState<NavLink[]>([]);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toggleCart, totalItems } = useCartStore();
  const { profile, signOut } = useAuth();
  const { isAdmin, isEditMode, content, updateContent } = useSiteContent();
  const count = totalItems();

  useEffect(() => { setMounted(true); }, []);

  const navLinks = parseNavLinks(content["nav.links"]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const openNavEditor = () => {
    setDraftLinks(navLinks.map((l) => ({ ...l })));
    setEditNavOpen(true);
  };

  const saveNav = () => {
    updateContent("nav.links", JSON.stringify(draftLinks));
    setEditNavOpen(false);
  };

  const updateDraft = (i: number, field: keyof NavLink, val: string) => {
    setDraftLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  };

  const removeDraft = (i: number) => {
    setDraftLinks((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addDraft = () => {
    setDraftLinks((prev) => [...prev, { href: "/shop", label: "Novo Link" }]);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-black/95 backdrop-blur-sm border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/Logo.png"
                alt="DOTHIS"
                width={120}
                height={40}
                className="object-contain"
                style={{ width: "auto", height: "40px" }}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => { if (link.href.startsWith("/shop")) router.refresh(); }}
                  className={cn(
                    "text-xs font-medium tracking-widest uppercase transition-colors",
                    pathname === link.href
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin: edit nav button */}
              {isAdmin && isEditMode && (
                <button
                  onClick={openNavEditor}
                  className="flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 hover:bg-blue-500 transition-colors"
                >
                  <Pencil size={9} /> Nav
                </button>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                href="/shop"
                className="p-2 text-neutral-400 hover:text-white transition-colors"
              >
                <Search size={20} />
              </Link>

              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-widest uppercase bg-white text-black hover:bg-neutral-200 transition-colors"
                >
                  Admin
                </Link>
              )}

              {profile ? (
                <div className="relative group">
                  <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5"
                    >
                      Minha Conta
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5"
                    >
                      Meus Pedidos
                    </Link>
                    {profile.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5"
                      >
                        Admin
                      </Link>
                    )}
                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <User size={20} />
                </Link>
              )}

              <button
                onClick={toggleCart}
                className="p-2 text-neutral-400 hover:text-white transition-colors relative"
              >
                <ShoppingBag size={20} />
                {mounted && count > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white text-black text-[10px] font-bold flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 text-neutral-400 hover:text-white transition-colors lg:hidden"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black pt-16">
          <nav className="flex flex-col px-6 py-8 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-2xl font-bold tracking-widest uppercase text-white hover:text-neutral-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/10" />
            {profile ? (
              <>
                <Link href="/account" className="text-lg text-neutral-400 hover:text-white">
                  Minha Conta
                </Link>
                {profile.role === "admin" && (
                  <Link href="/admin" className="text-lg text-white font-bold">
                    ⚙ Admin
                  </Link>
                )}
                <button onClick={signOut} className="text-left text-lg text-neutral-400 hover:text-white">
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="text-lg text-neutral-400 hover:text-white">
                Entrar / Cadastrar
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Nav Editor Panel */}
      {editNavOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm" onClick={() => setEditNavOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-950 border-l border-white/10 z-[9999] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Editar Navegação</p>
                <h2 className="text-sm font-black text-white mt-0.5">Links do Menu</h2>
              </div>
              <button onClick={() => setEditNavOpen(false)} className="p-1.5 text-neutral-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Links list */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
              {draftLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 bg-neutral-900 border border-white/10 p-3">
                  <GripVertical size={14} className="text-neutral-600 flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <input
                      value={link.label}
                      onChange={(e) => updateDraft(i, "label", e.target.value)}
                      placeholder="Label"
                      className="bg-black border border-neutral-700 text-white px-2 py-1.5 text-xs outline-none focus:border-white w-full"
                    />
                    <input
                      value={link.href}
                      onChange={(e) => updateDraft(i, "href", e.target.value)}
                      placeholder="/shop?category=..."
                      className="bg-black border border-neutral-700 text-neutral-400 px-2 py-1.5 text-xs outline-none focus:border-white w-full font-mono"
                    />
                  </div>
                  <button
                    onClick={() => removeDraft(i)}
                    className="p-1.5 text-neutral-600 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                onClick={addDraft}
                className="flex items-center justify-center gap-2 border border-dashed border-white/20 text-neutral-500 hover:text-white hover:border-white/40 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
              >
                <Plus size={14} /> Adicionar Link
              </button>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-white/10 flex gap-3">
              <button
                onClick={saveNav}
                className="flex-1 bg-white text-black py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors"
              >
                Salvar Menu
              </button>
              <button
                onClick={() => setEditNavOpen(false)}
                className="px-4 py-3 border border-white/20 text-neutral-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
