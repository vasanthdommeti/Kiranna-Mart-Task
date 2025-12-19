# Kiranna-Mart (Quick Commerce App)

Quick commerce mobile app built with Expo Router. The codebase focuses on a full user flow: discovery, search, cart, checkout, orders, and account/help screens.

## Features implemented

- Auth flow with skip + persisted dummy user; logout clears cart
- Location selection + header updates
- Search (restaurants and items) with results and empty state UX
- Cart with item editing modal, notes, special requests, and empty-cart UX
- Checkout with payment method widget and simulated order placement
- Orders list/history + order detail with status timeline
- Help and About screens with FAQ dropdowns

## Key screens/routes

- Home: `app/(tabs)/index.tsx`
- Orders: `app/(tabs)/order.tsx`
- Order details: `app/(tabs)/order/[id].tsx`
- Account: `app/(tabs)/account.tsx`
- Product detail: `app/(product)/index.tsx`
- Cart: `app/(product)/cart.tsx`
- Checkout: `app/(product)/checkout.tsx`
- Search: `app/search.tsx`
- Location: `app/location.tsx`
- Help: `app/help.tsx`
- About: `app/about.tsx`

## Tech stack

- Expo SDK 53 + Expo Router
- React Native + NativeWind (Tailwind classes)
- Zustand + AsyncStorage for persisted state

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Notes

- Checkout is a simulated flow (no backend payment integration).
- Orders, cart, and auth states persist locally via AsyncStorage.
