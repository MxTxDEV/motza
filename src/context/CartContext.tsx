"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Size } from "@/data/types";
import { catalog } from "@/lib/catalog";
import { MAX_QTY } from "@/lib/constants";

export interface CartLine {
  /** product.id + size + color */
  key: string;
  productId: string;
  size: Size;
  color: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: Omit<CartLine, "key"> }
  | { type: "remove"; key: string }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "clear" };

export { MAX_QTY };
const STORAGE_KEY = "motza:cart:v1";
const lineKey = (productId: string, size: Size, color: string) => `${productId}:${size}:${color}`;

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      const key = lineKey(action.line.productId, action.line.size, action.line.color);
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.line.quantity) } : l,
          ),
        };
      }
      return { ...state, lines: [...state.lines, { ...action.line, key, quantity: Math.min(MAX_QTY, action.line.quantity) }] };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
    case "setQuantity":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.key === action.key ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) } : l))
          .filter((l) => l.quantity > 0),
      };
    case "clear":
      return { ...state, lines: [] };
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  /** Subtotal em centavos, sempre calculado a partir do catálogo. */
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "key">, opts?: { openDrawer?: boolean }) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  /** Último item adicionado (alimenta o toast). */
  toast: { id: number; message: string } | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<CartContextValue["toast"]>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: CartLine[] = raw ? JSON.parse(raw) : [];
      const valid = Array.isArray(parsed) ? parsed.filter((l) => catalog.byId(l.productId)) : [];
      dispatch({ type: "hydrate", lines: valid });
    } catch {
      dispatch({ type: "hydrate", lines: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* storage indisponível */
    }
  }, [state.lines, state.hydrated]);

  const add = useCallback<CartContextValue["add"]>((line, opts) => {
    dispatch({ type: "add", line });
    const product = catalog.byId(line.productId);
    clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message: `${product?.name ?? "Item"} · ${line.size} adicionado à sacola` });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
    if (opts?.openDrawer) setOpen(true);
  }, []);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const remove = useCallback((key: string) => dispatch({ type: "remove", key }), []);
  const setQuantity = useCallback((key: string, quantity: number) => dispatch({ type: "setQuantity", key, quantity }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.lines.reduce((sum, l) => sum + (catalog.byId(l.productId)?.price ?? 0) * l.quantity, 0);
    return {
      lines: state.lines,
      count: state.lines.reduce((n, l) => n + l.quantity, 0),
      subtotal,
      isOpen,
      open,
      close,
      add,
      remove,
      setQuantity,
      clear,
      toast,
    };
  }, [state.lines, isOpen, add, toast, open, close, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
