"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ICartItem, ICartSummary } from "@/domain/interfaces/cartInterface";
import { IProduct } from "@/domain/interfaces/productInterface";

const STORAGE_KEY = "esa-cart";
const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 100;

interface CartContextValue {
  summary: ICartSummary;
  addItem: (product: IProduct, color?: string, size?: string, quantity?: number) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (
    productId: string,
    color: string,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Cart lines are keyed by productId + color + size so the same product with
 * different selections occupies distinct rows. */
const lineKey = (productId: string, color: string, size: string) =>
  `${productId}::${color}::${size}`;

const itemKey = (i: ICartItem) => lineKey(i.product.id, i.color, i.size);

const computeSummary = (items: ICartItem[]): ICartSummary => {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.finalPrice * i.quantity,
    0
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  return { items, itemCount, subtotal, shipping, total };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ICartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as Partial<ICartItem>[];
      return parsed
        .filter((i): i is ICartItem => !!i?.product)
        .map((i) => ({
          product: i.product as IProduct,
          color: i.color ?? "",
          size: i.size ?? "",
          quantity: i.quantity ?? 1,
        }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const addItem = useCallback(
    (product: IProduct, color = "", size = "", quantity = 1) => {
      setItems((prev) => {
        const key = lineKey(product.id, color, size);
        const max = product.stock;
        const existing = prev.find((i) => itemKey(i) === key);
        if (existing) {
          return prev.map((i) =>
            itemKey(i) === key
              ? { ...i, quantity: Math.min(i.quantity + quantity, max) }
              : i
          );
        }
        return [
          ...prev,
          { product, color, size, quantity: Math.min(quantity, max) },
        ];
      });
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, color: string, size: string) => {
      const key = lineKey(productId, color, size);
      setItems((prev) => prev.filter((i) => itemKey(i) !== key));
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, color: string, size: string, quantity: number) => {
      const key = lineKey(productId, color, size);
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter((i) => itemKey(i) !== key);
        }
        return prev.map((i) =>
          itemKey(i) === key
            ? { ...i, quantity: Math.min(quantity, i.product.stock) }
            : i
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      summary: computeSummary(items),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
