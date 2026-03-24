import HeroClient from "@/components/home/HeroClient";
import MarqueeBar from "@/components/home/MarqueeBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryBanner from "@/components/home/CategoryBanner";
import NewsletterSection from "@/components/home/NewsletterSection";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true)
      .contains("tags", ["bestseller"])
      .order("created_at", { ascending: false })
      .limit(4);
    return (data as Product[]) || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroClient />
      <MarqueeBar />
      <FeaturedProducts products={featuredProducts} />
      <CategoryBanner />
      <NewsletterSection />
    </>
  );
}
