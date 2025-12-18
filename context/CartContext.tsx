"use client";
import { CartContextType, Item } from "@/types";
import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Item | null>(null);
  const [cartItems, setCartItems] = useState<
    { item: Item; quantity: number; note?: string }[]
  >([]);
  const [orderNote, setOrderNote] = useState("");

  const addToCart = (item: Item, quantity: number = 1, note?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id
            ? {
                ...c,
                quantity: Math.max(1, c.quantity + quantity),
                note: note ?? c.note,
              }
            : c
        );
      }
      return [...prev, { item, quantity: Math.max(1, quantity), note }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev
        .map((c) =>
          c.item.id === id ? { ...c, quantity: Math.max(0, quantity) } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const updateNote = (id: string, note: string) => {
    setCartItems((prev) =>
      prev.map((c) => (c.item.id === id ? { ...c, note } : c))
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, c) => sum + c.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, c) => {
      const price = c.item.price ?? 0;
      return sum + price * c.quantity;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        selected,
        setSelected,
        cartItems,
        addToCart,
        updateQuantity,
        updateNote,
        clearCart,
        totalItems,
        cartTotal: parseFloat(cartTotal.toFixed(3)),
        orderNote,
        setOrderNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
