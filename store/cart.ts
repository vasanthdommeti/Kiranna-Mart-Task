import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Item } from "@/types";

type CartEntry = { item: Item; quantity: number; note?: string };

type CartState = {
  selected: Item | null;
  cartItems: CartEntry[];
  orderNote: string;
  setSelected: (item: Item | null) => void;
  addToCart: (item: Item, quantity?: number, note?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
  setOrderNote: (note: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      selected: null,
      cartItems: [],
      orderNote: "",
      setSelected: (item) => set({ selected: item }),
      addToCart: (item, quantity = 1, note) =>
        set((state) => {
          const existing = state.cartItems.find((c) => c.item.id === item.id);
          if (existing) {
            return {
              cartItems: state.cartItems.map((c) =>
                c.item.id === item.id
                  ? {
                      ...c,
                      quantity: Math.max(1, c.quantity + quantity),
                      note: note ?? c.note,
                    }
                  : c
              ),
            };
          }
          return {
            cartItems: [
              ...state.cartItems,
              { item, quantity: Math.max(1, quantity), note },
            ],
          };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems
            .map((c) =>
              c.item.id === id ? { ...c, quantity: Math.max(0, quantity) } : c
            )
            .filter((c) => c.quantity > 0),
        })),
      updateNote: (id, note) =>
        set((state) => ({
          cartItems: state.cartItems.map((c) =>
            c.item.id === id ? { ...c, note } : c
          ),
        })),
      clearCart: () => set({ cartItems: [], orderNote: "", selected: null }),
      setOrderNote: (note) => set({ orderNote: note }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        orderNote: state.orderNote,
      }),
    }
  )
);

export const resetCartStore = () => {
  useCartStore.setState({ cartItems: [], orderNote: "", selected: null });
};

