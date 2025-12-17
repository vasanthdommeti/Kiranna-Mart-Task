<<<<<<< HEAD
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "../global.css";

import { CartProvider } from "@/context/CartContext";
import { LastTabProvider } from "@/context/LastTabContext";
import { LocationProvider } from "@/context/LocationContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform, UIManager } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
=======
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
>>>>>>> 4b0fe7b (Initial commit)

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
<<<<<<< HEAD
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
=======
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
>>>>>>> 4b0fe7b (Initial commit)
    return null;
  }

  return (
<<<<<<< HEAD
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <LastTabProvider>
        <CartProvider>
          <LocationProvider>
            <Stack
              screenOptions={{
                animation: "fade",
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(product)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  animationDuration: 100,
                  headerShown: false,
                  gestureEnabled: true,
                  gestureDirection: "vertical",
                }}
              />
            </Stack>
          </LocationProvider>
        </CartProvider>
      </LastTabProvider>
=======
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
>>>>>>> 4b0fe7b (Initial commit)
    </ThemeProvider>
  );
}
