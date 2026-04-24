import { createClient } from "@/lib/supabase/server";

export const DEFAULT_CONTENT: Record<string, string> = {
  "hero.badge": "Nova Coleção — Drop 2026",
  "hero.subtitle": "Streetwear nacional com identidade própria. Cada peça é uma declaração.",
  "hero.bg_image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920",
  "hero.cta_primary": "Ver Coleção",
  "hero.cta_secondary": "Novidades",
  "marquee.items": JSON.stringify([
    "Streetwear Nacional",
    "Drop Exclusivo",
    "Entrega Rápida",
    "Qualidade Premium",
    "Edição Limitada",
    "Estilo Urbano",
  ]),
  "featured.label": "Destaques",
  "featured.title": "Mais Vendidos",
  "featured.view_all": "Ver Tudo",
  "categories.label": "Categorias",
  "categories.title": "Explore por Estilo",
  "categories.items": JSON.stringify([
    { name: "Camisetas", slug: "camisetas", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800", span: "col-span-2 row-span-2" },
    { name: "Moletons",  slug: "moletons",  image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800", span: "col-span-1" },
    { name: "Calças",    slug: "calcas",    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800", span: "col-span-1" },
    { name: "Jaquetas",  slug: "jaquetas",  image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", span: "col-span-2" },
  ]),
  "newsletter.label": "Newsletter",
  "newsletter.title": "Seja o Primeiro a Saber",
  "newsletter.description": "Cadastre-se para receber drops exclusivos, promoções e novidades antes de todo mundo.",
  "footer.description": "Streetwear nacional com identidade própria. Feito para quem tem estilo, não segue regra.",
  "logo.src": "/Logo.png",
  "nav.links": JSON.stringify([
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=camisetas", label: "Camisetas" },
    { href: "/shop?category=moletons", label: "Moletons" },
    { href: "/shop?category=calcas", label: "Calças" },
    { href: "/shop?category=jaquetas", label: "Jaquetas" },
    { href: "/shop?category=acessorios", label: "Acessórios" },
  ]),
};

export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_content").select("key, value");
    const rows = (data ?? []) as { key: string; value: string }[];
    const overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULT_CONTENT, ...overrides };
  } catch {
    return { ...DEFAULT_CONTENT };
  }
}
