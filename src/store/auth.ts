import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/types";

interface AuthStore {
  profile: Profile | null;
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: true,
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "dothis-auth",
      // Only persist role to show admin UI immediately — full profile re-fetched from Supabase on mount
      partialize: (state) => ({
        profile: state.profile
          ? { id: state.profile.id, role: state.profile.role }
          : null,
      }),
    }
  )
);
