import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import FooterClient from "@/components/layout/FooterClient";
import CartDrawer from "@/components/layout/CartDrawer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import AdminBar from "@/components/editor/AdminBar";
import { SiteProvider } from "@/context/SiteContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue" });

export const metadata: Metadata = {
  title: { default: "DOTHIS — Streetwear Nacional", template: "%s | DOTHIS" },
  description: "Streetwear nacional com identidade própria. Drops exclusivos, qualidade premium.",
  keywords: ["streetwear", "moda urbana", "roupas masculinas", "drop", "hype"],
  openGraph: {
    title: "DOTHIS — Streetwear Nacional",
    description: "Streetwear nacional com identidade própria.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans bg-[#0a0a0a] text-white antialiased`}>
        <SiteProvider>
          <AnnouncementBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <FooterClient />
          <CartDrawer />
          <AdminBar />
        </SiteProvider>
      </body>
    </html>
  );
}
