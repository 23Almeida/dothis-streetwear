"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";

interface SiteContentContextType {
  content: Record<string, string>;
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  updateContent: (key: string, value: string) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | null>(null);

export function SiteContentProvider({
  initial,
  children,
}: {
  initial: Record<string, string>;
  children: ReactNode;
}) {
  const { isAdmin } = useAuth();
  const [content, setContent] = useState<Record<string, string>>(initial);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = useCallback(() => setIsEditMode((p) => !p), []);

  const updateContent = useCallback(async (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    try {
      await fetch("/api/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
    } catch (err) {
      console.error("Failed to save content:", err);
    }
  }, []);

  return (
    <SiteContentContext.Provider
      value={{ content, isAdmin, isEditMode, toggleEditMode, updateContent }}
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
