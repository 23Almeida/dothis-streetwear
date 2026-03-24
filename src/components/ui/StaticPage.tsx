import { defaultSettings } from "@/lib/settings";
import { createClient } from "@/lib/supabase/server";

async function getPageContent(pageKey: string): Promise<string> {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as any)
      .from("site_settings")
      .select("value")
      .eq("key", "pages")
      .single();
    const pages = { ...defaultSettings.pages, ...(data?.value || {}) };
    return (pages as any)[pageKey] || "";
  } catch {
    return (defaultSettings.pages as any)[pageKey] || "";
  }
}

function renderMarkdown(text: string) {
  return text
    .split("\n\n")
    .map((para, i) => {
      const html = para
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br />");
      return `<p key="${i}">${html}</p>`;
    })
    .join("");
}

interface StaticPageProps {
  title: string;
  pageKey: string;
}

export default async function StaticPage({ title, pageKey }: StaticPageProps) {
  const content = await getPageContent(pageKey);

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-black tracking-tight text-white mb-10">{title}</h1>
        <div
          className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed [&_strong]:text-white [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </div>
    </div>
  );
}
