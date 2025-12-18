"use client";
import { CartContextType, Item } from "@/types";
import { useCartStore } from "@/store/cart";
import React, { createContext, useContext, useMemo } from "react";

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartItems = useCartStore((s) => s.cartItems);
  const selected = useCartStore((s) => s.selected);
  const setSelected = useCartStore((s) => s.setSelected);
  const addToCart = useCartStore((s) => s.addToCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const updateNote = useCartStore((s) => s.updateNote);
  const clearCart = useCartStore((s) => s.clearCart);
  const orderNote = useCartStore((s) => s.orderNote);
  const setOrderNote = useCartStore((s) => s.setOrderNote);

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
