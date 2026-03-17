import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Package, ShoppingBag, Users, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const profile = profileData as any;
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-neutral-950 border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <span className="text-xs font-black tracking-[0.4em] uppercase text-white">
            DOTHIS <span className="text-neutral-500">Admin</span>
          </span>

          {/* Nav links - horizontal on top bar */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <link.icon size={14} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-600 hidden sm:block">
            {profile?.full_name || user.email}
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:block">Ver site</span>
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden fixed top-14 left-0 right-0 z-40 bg-neutral-950 border-b border-white/10 flex overflow-x-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white whitespace-nowrap flex-shrink-0"
          >
            <link.icon size={14} />
            {link.label}
          </Link>
        ))}
      </div>

      {/* Page Content */}
      <div className="pt-14 sm:pt-14 flex-1">
        {children}
      </div>
    </div>
  );
}
