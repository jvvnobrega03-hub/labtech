export type StoredQuoteItem = {
  productId: string;
  quantity: number;
  notes: string;
};

export function normalizeStoredQuoteItems(value: unknown): StoredQuoteItem[] {
  if (!Array.isArray(value)) return [];

  const normalized = value.flatMap((entry) => {
    if (typeof entry === "string") return [{ productId: entry, quantity: 1, notes: "" }];
    if (!entry || typeof entry !== "object") return [];

    const candidate = entry as Partial<StoredQuoteItem> & { slug?: string };
    const productId = typeof candidate.productId === "string"
      ? candidate.productId
      : typeof candidate.slug === "string"
        ? candidate.slug
        : "";
    if (!productId) return [];

    return [{
      productId,
      quantity: Math.min(999, Math.max(1, Math.trunc(Number(candidate.quantity) || 1))),
      notes: typeof candidate.notes === "string" ? candidate.notes.trim().slice(0, 500) : "",
    }];
  });

  return Array.from(new Map(normalized.map((item) => [item.productId, item])).values());
}

export function quoteWhatsAppMessage(
  items: ReadonlyArray<{ name: string; sku?: string; quantity: number; notes: string }>,
): string {
  const lines = items.map((item) => [
    `• ${item.quantity}× ${item.name}`,
    item.sku ? `  Código: ${item.sku}` : "",
    item.notes ? `  Observação: ${item.notes}` : "",
  ].filter(Boolean).join("\n"));

  return [
    "Olá, gostaria de solicitar um orçamento para:",
    "",
    ...lines,
  ].join("\n");
}
