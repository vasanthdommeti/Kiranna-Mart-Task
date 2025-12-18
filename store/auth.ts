import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { resetCartStore } from "./cart";

export type AuthProvider = "google" | "facebook" | "email";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  provider: AuthProvider;
  createdAt: number;
};

type AuthState = {
  user: AuthUser | null;
  hasSkippedAuth: boolean;
  hasHydrated: boolean;
  signIn: (provider: AuthProvider) => void;
  skipAuth: () => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasSkippedAuth: false,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      signIn: (provider) => {
        const now = Date.now();
        const profile =
          provider === "google"
            ? {
                name: "Vasanth Dommeti",
                email: "vasanth.dommeti@example.com",
                phone: "+965 5000 1111",
              }
            : provider === "facebook"
              ? {
                  name: "Abhishek Rovia",
                  email: "abhishek.rovia@example.com",
                  phone: "+965 5000 2222",
                }
              : {
                  name: "Kiranna Shopper",
                  email: "shopper@example.com",
                  phone: "+965 5000 3333",
                };
        const user: AuthUser = {
          id: `${provider}-${now}`,
          ...profile,
          provider,
          createdAt: now,
        };
        set({ user, hasSkippedAuth: false });
      },
      skipAuth: () => set({ hasSkippedAuth: true }),
      logout: () => {
        resetCartStore();
        set({ user: null, hasSkippedAuth: false });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        hasSkippedAuth: state.hasSkippedAuth,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
