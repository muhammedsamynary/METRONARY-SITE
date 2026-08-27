"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CartItem, AddItemInput, CartContextValue } from "@/lib/cart/types";
import {
  CART_STORAGE_KEY,
  sanitizeCartItems,
  calculateCartSubtotal,
  addItemToCartList,
} from "@/lib/cart/cart-utils";

const CartContext = createContext<CartContextValue | null>(null);

// In-memory single source of truth synced with localStorage & subscribers
let memoryCart: CartItem[] = [];
let isInitialized = false;
const listeners = new Set<() => void>();

function notifySubscribers() {
  listeners.forEach((l) => l());
}

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      return sanitizeCartItems(JSON.parse(raw));
    }
  } catch {
    // Storage read fallback
  }
  return [];
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      memoryCart = getStoredCart();
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getCartSnapshot(): CartItem[] {
  if (!isInitialized && typeof window !== "undefined") {
    memoryCart = getStoredCart();
    isInitialized = true;
  }
  return memoryCart;
}

const SERVER_SNAPSHOT: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return SERVER_SNAPSHOT;
}

function saveCart(newItems: CartItem[]) {
  memoryCart = newItems;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Storage write fallback
    }
  }
  notifySubscribers();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getCartSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((input: AddItemInput) => {
    const current = getCartSnapshot();
    const updated = addItemToCartList(current, input);
    saveCart(updated);
    setIsOpen(true); // Open mini-cart upon adding item
  }, []);

  const removeItem = useCallback((id: string) => {
    const current = getCartSnapshot();
    const updated = current.filter((item) => item.id !== id);
    saveCart(updated);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const current = getCartSnapshot();
    if (quantity < 1) {
      const updated = current.filter((item) => item.id !== id);
      saveCart(updated);
      return;
    }
    const updated = current.map((item) => {
      if (item.id !== id) return item;
      const cappedQty =
        item.maxQuantity && quantity > item.maxQuantity
          ? item.maxQuantity
          : quantity;
      return { ...item, quantity: cappedQty };
    });
    saveCart(updated);
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const uniqueItemCount = useMemo(() => items.length, [items]);

  const subtotal = useMemo(() => calculateCartSubtotal(items), [items]);

  const isSubtotalCalculable = useMemo(
    () => subtotal !== null && items.length > 0,
    [subtotal, items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      itemCount,
      uniqueItemCount,
      subtotal,
      isSubtotalCalculable,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      isOpen,
      itemCount,
      uniqueItemCount,
      subtotal,
      isSubtotalCalculable,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
