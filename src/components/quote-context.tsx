"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import { normalizeStoredQuoteItems, type StoredQuoteItem } from "@/lib/quote";
import { trackEvent } from "@/lib/analytics";

export type QuoteItem = Product & { productId: string; quantity: number; notes: string };
type QuoteContextValue = { items: QuoteItem[]; itemCount: number; isOpen: boolean; addItem: (productId: string, quantity?: number) => void; removeItem: (productId: string) => void; updateItem: (productId: string, changes: Partial<Pick<StoredQuoteItem, "quantity" | "notes">>) => void; clear: () => void; open: () => void; close: () => void; hasItem: (productId: string) => boolean };
const QuoteContext = createContext<QuoteContextValue | null>(null);
const storageKey = "labtech-orcamento";
const storageVersion = 2;

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [storedItems, setStoredItems] = useState<StoredQuoteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { try { const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as unknown; const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) && "items" in parsed ? (parsed as { items: unknown }).items : parsed; setStoredItems(normalizeStoredQuoteItems(source)); } catch { localStorage.removeItem(storageKey); } setHydrated(true); }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(storageKey, JSON.stringify({ version: storageVersion, items: storedItems })); }, [storedItems, hydrated]);
  const addItem = useCallback((productId: string, quantity = 1) => { setStoredItems((current) => current.some((item) => item.productId === productId) ? current : [...current, { productId, quantity: Math.min(999, Math.max(1, Math.trunc(quantity))), notes: "" }]); setIsOpen(true); }, []);
  const removeItem = useCallback((productId: string) => { setStoredItems((current) => current.filter((item) => item.productId !== productId)); trackEvent("remove_from_quote", { product_id: productId }); }, []);
  const updateItem = useCallback((productId: string, changes: Partial<Pick<StoredQuoteItem, "quantity" | "notes">>) => setStoredItems((current) => current.map((item) => item.productId === productId ? { ...item, ...changes, quantity: changes.quantity === undefined ? item.quantity : Math.min(999, Math.max(1, Math.trunc(changes.quantity))), notes: changes.notes === undefined ? item.notes : changes.notes.slice(0, 500) } : item)), []);
  const clear = useCallback(() => setStoredItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const hasItem = useCallback((productId: string) => storedItems.some((item) => item.productId === productId), [storedItems]);
  const items = useMemo(() => storedItems.flatMap((stored) => { const product = products.find((item) => item.slug === stored.productId); return product ? [{ ...product, productId: stored.productId, quantity: stored.quantity, notes: stored.notes }] : []; }), [storedItems]);
  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const value = useMemo(() => ({ items, itemCount, isOpen, addItem, removeItem, updateItem, clear, open, close, hasItem }), [items, itemCount, isOpen, addItem, removeItem, updateItem, clear, open, close, hasItem]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() { const context = useContext(QuoteContext); if (!context) throw new Error("useQuote deve ser usado dentro de QuoteProvider"); return context; }
