export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
  };
  marquee: {
    items: string;
  };
  social: {
    instagram: string;
    twitter: string;
    youtube: string;
    whatsapp: string;
    tiktok: string;
  };
  contact: {
    email: string;
    whatsapp: string;
    address: string;
    city: string;
    hours: string;
  };
  pages: {
    sobre: string;
    faq: string;
    trocas: string;
    envio: string;
    privacidade: string;
    termos: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export const defaultSettings: SiteSettings = {
  brand: {
    name: "DOTHIS",
    tagline: "DROP 2026",
    description: "Streetwear nacional com identidade própria. Feito para quem tem estilo, não segue regra.",
    logo: "/Logo.png",
  },
  announcement: { enabled: false, text: "FRETE GRÁTIS acima de R$299", link: "/shop" },
  hero: {
    title: "DOTHIS",
    subtitle: "DROP 2026",
    description: "Peças limitadas. Estética brutal. Sem desculpas.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920",
  },
  marquee: {
    items: "Streetwear Nacional · Drop Exclusivo · Entrega Rápida · Qualidade Premium · Edição Limitada · Estilo Urbano",
  },
  social: { instagram: "", twitter: "", youtube: "", whatsapp: "", tiktok: "" },
  contact: { email: "", whatsapp: "", address: "", city: "", hours: "Seg–Sex, 9h–18h" },
  pages: {
    sobre: "A DOTHIS nasceu da rua.",
    faq: "Dúvidas frequentes.",
    trocas: "Política de trocas.",
    envio: "Política de envio.",
    privacidade: "Política de privacidade.",
    termos: "Termos de uso.",
  },
  seo: { title: "DOTHIS Streetwear", description: "Moda streetwear masculina.", keywords: "streetwear" },
};
