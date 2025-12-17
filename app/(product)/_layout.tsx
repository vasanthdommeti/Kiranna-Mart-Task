import { Stack } from "expo-router";
import React from "react";

export default function ProductLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />
    </Stack>
  );
}
