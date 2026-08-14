"use client";

import { BagIcon, CheckIcon } from "@/components/icons";
import { useQuote } from "@/components/quote-context";

export function AddToQuote({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { addItem, hasItem, open } = useQuote();
  const added = hasItem(slug);

  return (
    <button
      className={compact ? "icon-button" : "button button-primary"}
      type="button"
      onClick={() => (added ? open() : addItem(slug))}
      aria-label={added ? "Ver itens do orçamento" : "Adicionar ao orçamento"}
      aria-pressed={added}
    >
      {added ? <CheckIcon className="size-5" /> : <BagIcon className="size-5" />}
      {!compact && (added ? "Adicionado ao orçamento" : "Adicionar ao orçamento")}
    </button>
  );
}
