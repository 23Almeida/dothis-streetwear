import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import type { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore toda a coleção DOTHIS.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    size?: string | string[];
    search?: string;
  }>;
}

async function getProducts(params: {
  category?: string;
  sort?: string;
  sizes?: string[];
  search?: string;
}): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true);

    if (params.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", params.category)
        .single();
      if (cat) query = query.eq("category_id", (cat as any).id);
    }

    if (params.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    switch (params.sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data } = await query;
    return (data as Product[]) || [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").order("name");
    return data || [];
  } catch {
    return [];
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const sizes = params.size
    ? Array.isArray(params.size)
      ? params.size
      : [params.size]
    : [];

  const [products, categories] = await Promise.all([
    getProducts({
      category: params.category,
      sort: params.sort,
      sizes,
      search: params.search,
    }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Page Header */}
      <div className="border-b border-white/5 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-2">
            Coleção
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {params.category
              ? categories.find((c) => c.slug === params.category)?.name ||
                "Shop"
              : "Shop"}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-12">
          {/* Filters Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden lg:block">
            <Suspense fallback={null}>
              <ShopFilters categories={categories} totalCount={products.length} />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-neutral-900 animate-pulse" />
                  ))}
                </div>
              }
            >
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
