import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import EditModeBar from "@/components/admin/EditModeBar";
import { SiteContentProvider } from "@/contexts/SiteContentContext";
import { getSiteContent } from "@/lib/site-content";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "DOTHIS — Streetwear Nacional",
    template: "%s | DOTHIS",
  },
  description:
    "Streetwear nacional com identidade própria. Drops exclusivos, qualidade premium.",
  keywords: ["streetwear", "moda urbana", "roupas masculinas", "drop", "hype"],
  openGraph: {
    title: "DOTHIS — Streetwear Nacional",
    description: "Streetwear nacional com identidade própria.",
    type: "website",
    locale: "pt_BR",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteContent, isAdmin] = await Promise.all([
    getSiteContent(),
    (async () => {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        return (data as { role: string } | null)?.role === "admin";
      } catch {
        return false;
      }
    })(),
  ]);

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        <SiteContentProvider initial={siteContent} initialIsAdmin={isAdmin}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <EditModeBar />
        </SiteContentProvider>
      </body>
    </html>
  );
}
