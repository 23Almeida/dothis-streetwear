"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useSupabase } from "./useSupabase";
import type { Profile } from "@/types";

export function useAuth() {
  const supabase = useSupabase();
  const { profile, isLoading, setProfile, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data as unknown as Profile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(data as unknown as Profile);
        } else {
          setProfile(null);
        }
        router.refresh();
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, setProfile, setLoading, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return { profile, isLoading, signOut, isAdmin: profile?.role === "admin" };
}
