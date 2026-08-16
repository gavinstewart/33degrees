"use client";

import { createContext, useContext, useMemo, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  priceCents: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: { id: string; name: string; priceCents: number }) => void;
  removeItem: (id: string) => void;
  totalCents: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem: CartContextValue["addItem"] = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        totalCents,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
