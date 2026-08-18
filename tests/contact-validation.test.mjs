import assert from "node:assert/strict";
import test from "node:test";
import { MAX_QUOTE_ITEMS, validateContactPayload } from "../src/lib/contact-validation.ts";

const validContact = {
  type: "contato",
  name: "  Maria\u0000 Silva  ",
  email: "MARIA@example.com",
  organization: "Laboratório Exemplo",
  phone: "11999999999",
  context: "Preciso esclarecer uma dúvida sobre o catálogo demonstrativo.",
  consent: true,
  website: "",
};

test("normaliza um contato válido sem simular entrega", () => {
  const result = validateContactPayload(validContact);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.name, "Maria Silva");
  assert.equal(result.data.email, "maria@example.com");
  assert.equal(result.data.type, "contato");
});

test("rejeita consentimento ausente e honeypot preenchido", () => {
  const withoutConsent = validateContactPayload({ ...validContact, consent: false });
  const botPayload = validateContactPayload({ ...validContact, website: "https://spam.invalid" });
  assert.deepEqual(withoutConsent, {
    ok: false,
    message: "É necessário aceitar a política de privacidade.",
  });
  assert.deepEqual(botPayload, { ok: false, message: "Solicitação inválida." });
});

test("exige instituição e telefone no orçamento", () => {
  const result = validateContactPayload({ ...validContact, type: "orcamento", organization: "", phone: "" });
  assert.deepEqual(result, { ok: false, message: "Informe instituição e telefone válidos." });
});

test("limita e normaliza os itens do orçamento", () => {
  const items = [{ slug: "item-1", name: "Item 1", quantity: 2.8, notes: "  nota  " }];
  const result = validateContactPayload({ ...validContact, type: "orcamento", items });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.data.items, [{ productId: "item-1", slug: "item-1", sku: "", name: "Item 1", quantity: 2, notes: "nota" }]);

  const tooMany = Array.from({ length: MAX_QUOTE_ITEMS + 1 }, () => items[0]);
  assert.equal(validateContactPayload({ ...validContact, type: "orcamento", items: tooMany }).ok, false);
});

test("rejeita formatos e tipos desconhecidos", () => {
  assert.equal(validateContactPayload(null).ok, false);
  assert.equal(validateContactPayload({ ...validContact, type: "outro" }).ok, false);
  assert.equal(validateContactPayload({ ...validContact, email: "email-invalido" }).ok, false);
});
