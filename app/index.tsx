import { useAuthStore } from "@/store/auth";
import { Redirect } from "expo-router";
import React from "react";

export default function IndexScreen() {
  const user = useAuthStore((s) => s.user);
  const hasSkippedAuth = useAuthStore((s) => s.hasSkippedAuth);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) return null;

  return <Redirect href={user || hasSkippedAuth ? "/(tabs)" : "/(auth)"} />;
}
