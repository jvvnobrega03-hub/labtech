"use client";

import { BagIcon, CheckIcon } from "@/components/icons";
import { useQuote } from "@/components/quote-context";
import { trackEvent } from "@/lib/analytics";

export function AddToQuote({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { addItem, hasItem, open } = useQuote();
  const added = hasItem(slug);

  return (
    <button
      className={compact ? "quote-chip" : "button button-primary"}
      type="button"
      onClick={() => { if (added) open(); else { addItem(slug); trackEvent("add_to_quote", { product_id: slug }); } }}
      aria-label={added ? "Ver itens do orçamento" : "Adicionar ao orçamento"}
      aria-pressed={added}
    >
      {added ? <CheckIcon className="size-4" /> : <BagIcon className="size-4" />}
      {compact ? (added ? "Adicionado" : "+ Cotação") : (added ? "Adicionado à cotação" : "Adicionar à cotação")}
    </button>
  );
}
