"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/data/products";

export type QuoteItem = Product & { quantity: number; notes: string };
type StoredItem = { slug: string; quantity: number; notes: string };
type QuoteContextValue = { items: QuoteItem[]; itemCount: number; isOpen: boolean; addItem: (slug: string) => void; removeItem: (slug: string) => void; updateItem: (slug: string, changes: Partial<Pick<StoredItem, "quantity" | "notes">>) => void; clear: () => void; open: () => void; close: () => void; hasItem: (slug: string) => boolean };
const QuoteContext = createContext<QuoteContextValue | null>(null);
const storageKey = "labtech-orcamento";

function validStored(value: unknown): StoredItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry === "string") return [{ slug: entry, quantity: 1, notes: "" }];
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Partial<StoredItem>;
    if (typeof item.slug !== "string") return [];
    return [{ slug: item.slug, quantity: Math.min(999, Math.max(1, Number(item.quantity) || 1)), notes: typeof item.notes === "string" ? item.notes.slice(0, 500) : "" }];
  });
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [storedItems, setStoredItems] = useState<StoredItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { try { setStoredItems(validStored(JSON.parse(localStorage.getItem(storageKey) ?? "[]"))); } catch { localStorage.removeItem(storageKey); } setHydrated(true); }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(storageKey, JSON.stringify(storedItems)); }, [storedItems, hydrated]);
  const addItem = useCallback((slug: string) => { setStoredItems((current) => current.some((item) => item.slug === slug) ? current : [...current, { slug, quantity: 1, notes: "" }]); setIsOpen(true); }, []);
  const removeItem = useCallback((slug: string) => setStoredItems((current) => current.filter((item) => item.slug !== slug)), []);
  const updateItem = useCallback((slug: string, changes: Partial<Pick<StoredItem, "quantity" | "notes">>) => setStoredItems((current) => current.map((item) => item.slug === slug ? { ...item, ...changes, quantity: changes.quantity === undefined ? item.quantity : Math.min(999, Math.max(1, changes.quantity)), notes: changes.notes === undefined ? item.notes : changes.notes.slice(0, 500) } : item)), []);
  const clear = useCallback(() => setStoredItems([]), []);
  const items = useMemo(() => storedItems.flatMap((stored) => { const product = products.find((item) => item.slug === stored.slug); return product ? [{ ...product, quantity: stored.quantity, notes: stored.notes }] : []; }), [storedItems]);
  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const value = useMemo(() => ({ items, itemCount, isOpen, addItem, removeItem, updateItem, clear, open: () => setIsOpen(true), close: () => setIsOpen(false), hasItem: (slug: string) => storedItems.some((item) => item.slug === slug) }), [items, itemCount, isOpen, addItem, removeItem, updateItem, clear, storedItems]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() { const context = useContext(QuoteContext); if (!context) throw new Error("useQuote deve ser usado dentro de QuoteProvider"); return context; }
