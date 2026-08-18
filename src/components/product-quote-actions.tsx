"use client";

import { useState } from "react";
import { BagIcon, CheckIcon } from "@/components/icons";
import { useQuote } from "@/components/quote-context";
import { trackEvent } from "@/lib/analytics";

export function ProductQuoteActions({ productId }: { productId: string }) {
  const { addItem, hasItem, open } = useQuote();
  const [quantity, setQuantity] = useState(1);
  const added = hasItem(productId);

  function handleAdd() {
    if (added) {
      open();
      return;
    }
    addItem(productId, quantity);
    trackEvent("add_to_quote", { product_id: productId, quantity });
  }

  return (
    <div className="product-quote-actions">
      <label><span>Quantidade</span><input className="input" type="number" min="1" max="999" value={quantity} onChange={(event) => setQuantity(Math.min(999, Math.max(1, Math.trunc(Number(event.target.value) || 1))))} /></label>
      <button type="button" className="button button-primary" onClick={handleAdd} aria-pressed={added}>{added ? <CheckIcon className="size-5" /> : <BagIcon className="size-5" />}{added ? "Ver na cotação" : "Adicionar à cotação"}</button>
    </div>
  );
}
