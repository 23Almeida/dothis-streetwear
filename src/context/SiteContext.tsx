"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

interface SiteContextType {
  settings: SiteSettings;
  editMode: boolean;
  toggleEditMode: () => void;
  updateSection: (section: keyof SiteSettings, values: any) => Promise<void>;
  saving: boolean;
}

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
  editMode: false,
  toggleEditMode: () => {},
  updateSection: async () => {},
  saving: false,
});

export function SiteProvider({ children, initial }: { children: ReactNode; initial?: Partial<SiteSettings> }) {
  const [settings, setSettings] = useState<SiteSettings>({ ...defaultSettings, ...initial });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch fresh settings on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const toggleEditMode = useCallback(() => setEditMode((v) => !v), []);

  const updateSection = useCallback(async (section: keyof SiteSettings, values: any) => {
    setSaving(true);
    // Optimistic update
    setSettings((prev) => ({ ...prev, [section]: { ...(prev[section] as any), ...values } }));
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [section]: values }),
      });
      if (!res.ok) throw new Error("Falha ao salvar");
    } catch {
      // revert on error
      setSettings((prev) => ({ ...prev, [section]: (defaultSettings as any)[section] }));
    }
    setSaving(false);
  }, []);

  return (
    <SiteContext.Provider value={{ settings, editMode, toggleEditMode, updateSection, saving }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
