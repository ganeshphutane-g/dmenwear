"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Cart } from "./types";
import { mockAdapter } from "./adapter";
import { track } from "@/lib/analytics";

const adapter = mockAdapter;

type CartContextValue = {
  cart: Cart | null;
  /** Instant count = real total + optimistic in-flight delta (premortem INP ≤50ms). */
  totalQuantity: number;
  isOpen: boolean;
  isBusy: boolean;
  lastError: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [pendingDelta, setPendingDelta] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const cartIdRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const existing =
        typeof window !== "undefined" ? window.localStorage.getItem("dmen_cart_id") : null;
      let resolved: Cart | null = existing ? await adapter.getCart(existing) : null;
      if (!resolved) resolved = await adapter.createCart();
      if (!active) return;
      cartIdRef.current = resolved.id;
      window.localStorage.setItem("dmen_cart_id", resolved.id);
      setCart(resolved);
    })();
    return () => {
      active = false;
    };
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    const cartId = cartIdRef.current;
    if (!cartId) return;
    // Optimistic, ≤50ms: bump the badge and open the drawer immediately.
    setLastError(null);
    setPendingDelta((d) => d + quantity);
    startTransition(() => setIsOpen(true));
    setIsBusy(true);
    try {
      const { cart: next, userErrors } = await adapter.addLines(cartId, [
        { variantId, quantity },
      ]);
      setCart(next);
      if (userErrors.length) setLastError(userErrors[0].message);
      else track("add_to_cart", { variantId, quantity });
    } catch {
      setLastError("Couldn't add that just now. Try again.");
    } finally {
      setPendingDelta((d) => Math.max(0, d - quantity));
      setIsBusy(false);
    }
  }, []);

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    const cartId = cartIdRef.current;
    if (!cartId) return;
    setIsBusy(true);
    try {
      const { cart: next, userErrors } = await adapter.updateLines(cartId, [
        { id: lineId, quantity },
      ]);
      setCart(next);
      setLastError(userErrors[0]?.message ?? null);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const removeLine = useCallback(async (lineId: string) => {
    const cartId = cartIdRef.current;
    if (!cartId) return;
    setIsBusy(true);
    try {
      const { cart: next } = await adapter.removeLines(cartId, [lineId]);
      setCart(next);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      totalQuantity: (cart?.totalQuantity ?? 0) + pendingDelta,
      isOpen,
      isBusy,
      lastError,
      openCart,
      closeCart,
      addItem,
      updateLine,
      removeLine,
    }),
    [cart, pendingDelta, isOpen, isBusy, lastError, openCart, closeCart, addItem, updateLine, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
