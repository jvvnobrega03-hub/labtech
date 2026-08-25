import assert from "node:assert/strict";
import test from "node:test";
import { buildContactEmail } from "../src/lib/contact-email-content.ts";

const contact = {
  type: "contato",
  name: "Maria <Silva>",
  email: "maria@example.com",
  organization: "Laboratório & Pesquisa",
  context: "Dúvida técnica: Preciso de informações sobre os produtos laboratoriais.",
  phone: "(11) 99999-9999",
  consent: true,
  items: [],
};

test("monta a mensagem com destinatário configurado e reply-to do contato", () => {
  const email = buildContactEmail(contact, {
    recipient: "comercial@labtech.com.br",
    sender: "Labtech <site@labtech.com.br>",
  });
  assert.equal(email.to, "comercial@labtech.com.br");
  assert.equal(email.from, "Labtech <site@labtech.com.br>");
  assert.equal(email.replyTo, "maria@example.com");
  assert.equal(email.subject, "[Site Labtech] Dúvida técnica");
  assert.match(email.text, /Laboratório & Pesquisa/);
});

test("escapa dados do visitante antes de montar o HTML", () => {
  const email = buildContactEmail(contact, {
    recipient: "site@labtech.com.br",
    sender: "Labtech <site@labtech.com.br>",
  });
  assert.doesNotMatch(email.html, /Maria <Silva>/);
  assert.match(email.html, /Maria &lt;Silva&gt;/);
  assert.match(email.html, /Laboratório &amp; Pesquisa/);
});
