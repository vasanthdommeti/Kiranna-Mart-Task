"use client";
import { CartContextType, Item } from "@/types";
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Item | null>(null);
  return (
    <CartContext.Provider value={{ selected, setSelected }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
