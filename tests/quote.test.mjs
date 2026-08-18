import assert from "node:assert/strict";
import test from "node:test";
import { normalizeStoredQuoteItems, quoteWhatsAppMessage } from "../src/lib/quote.ts";

test("migra armazenamento antigo, limita valores e remove duplicatas", () => {
  const result = normalizeStoredQuoteItems([
    "produto-a",
    { slug: "produto-b", quantity: 2.9, notes: "  detalhe  " },
    { productId: "produto-b", quantity: 4, notes: "última versão" },
    { productId: "", quantity: 1 },
  ]);
  assert.deepEqual(result, [
    { productId: "produto-a", quantity: 1, notes: "" },
    { productId: "produto-b", quantity: 4, notes: "última versão" },
  ]);
});

test("gera resumo de cotação sem exigir SKU inexistente", () => {
  const message = quoteWhatsAppMessage([{ name: "Kit Alfa", sku: "A-1", quantity: 2, notes: "Lote atual" }, { name: "Tubo", quantity: 1, notes: "" }]);
  assert.match(message, /2× Kit Alfa/);
  assert.match(message, /Código: A-1/);
  assert.match(message, /1× Tubo/);
});
