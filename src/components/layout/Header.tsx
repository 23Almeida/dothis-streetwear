"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=camisetas", label: "Camisetas" },
  { href: "/shop?category=moletons", label: "Moletons" },
  { href: "/shop?category=calcas", label: "Calças" },
  { href: "/shop?category=jaquetas", label: "Jaquetas" },
  { href: "/shop?category=acessorios", label: "Acessórios" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { toggleCart, totalItems } = useCartStore();
  const { profile, signOut } = useAuth();
  const count = totalItems();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

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
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
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
                key={link.href}
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
    </>
  );
}
