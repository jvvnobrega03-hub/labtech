"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ProductViewTracker({ productId, category }: { productId: string; category: string }) {
  useEffect(() => {
    trackEvent("view_product", { product_id: productId, category });
  }, [category, productId]);

  return null;
}
