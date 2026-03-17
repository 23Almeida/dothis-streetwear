import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
