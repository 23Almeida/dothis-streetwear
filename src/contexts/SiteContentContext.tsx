"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
}

interface SiteContentContextType {
  content: Record<string, string>;
  categories: DbCategory[];
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  updateContent: (key: string, value: string) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | null>(null);

export function SiteContentProvider({
  initial,
  initialIsAdmin,
  initialCategories,
  children,
}: {
  initial: Record<string, string>;
  initialIsAdmin: boolean;
  initialCategories: DbCategory[];
  children: ReactNode;
}) {
  const isAdmin = initialIsAdmin;
  const [content, setContent] = useState<Record<string, string>>(initial);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = useCallback(() => setIsEditMode((p) => !p), []);

  const updateContent = useCallback(async (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    try {
      const res = await fetch("/api/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("site-content save failed", res.status, body);
      }
    } catch (err) {
      console.error("Failed to save content:", err);
    }
  }, []);

  return (
    <SiteContentContext.Provider
      value={{ content, categories: initialCategories, isAdmin, isEditMode, toggleEditMode, updateContent }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be inside SiteContentProvider");
  return ctx;
}
