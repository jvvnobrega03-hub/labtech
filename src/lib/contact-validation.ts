export const MAX_REQUEST_BYTES = 32 * 1024;
export const MAX_QUOTE_ITEMS = 30;

export type ContactRequestType = "contato" | "orcamento";

export type NormalizedQuoteItem = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  quantity: number;
  notes: string;
};

export type NormalizedContactRequest = {
  type: ContactRequestType;
  name: string;
  email: string;
  organization: string;
  context: string;
  phone: string;
  consent: true;
  items: NormalizedQuoteItem[];
};

export type ValidationResult =
  | { ok: true; data: NormalizedContactRequest }
  | { ok: false; message: string };

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string"
    ? value
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength)
    : "";
}

function emailIsValid(email: string): boolean {
  return email.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeItems(value: unknown): NormalizedQuoteItem[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_QUOTE_ITEMS) return null;

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    const productId = clean(item.productId ?? item.slug, 120);
    const slug = clean(item.slug ?? item.productId, 120);
    const sku = clean(item.sku, 80);
    const name = clean(item.name, 120);
    if (!productId || !slug || !name) return [];

    const requestedQuantity = Number(item.quantity);
    const quantity = Number.isFinite(requestedQuantity)
      ? Math.min(999, Math.max(1, Math.trunc(requestedQuantity)))
      : 1;

    return [{ productId, slug, sku, name, quantity, notes: clean(item.notes, 500) }];
  });
}

export function validateContactPayload(value: unknown): ValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, message: "Formato de solicitação inválido." };
  }

  const body = value as Record<string, unknown>;
  if (clean(body.website, 200)) {
    return { ok: false, message: "Solicitação inválida." };
  }

  if (body.type !== "contato" && body.type !== "orcamento") {
    return { ok: false, message: "Tipo de solicitação inválido." };
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 160).toLowerCase();
  const organization = clean(body.organization, 120);
  const context = clean(body.context, 2000);
  const phone = clean(body.phone, 40);
  const consent = body.consent === true || body.consent === "true";
  const items = normalizeItems(body.items);

  if (name.length < 2) return { ok: false, message: "Informe um nome válido." };
  if (!emailIsValid(email)) return { ok: false, message: "Informe um e-mail válido." };
  if (context.length < 20) {
    return { ok: false, message: "Descreva o contexto com pelo menos 20 caracteres." };
  }
  if (body.type === "orcamento" && (organization.length < 2 || phone.length < 8)) {
    return { ok: false, message: "Informe instituição e telefone válidos." };
  }
  if (!consent) {
    return { ok: false, message: "É necessário aceitar a política de privacidade." };
  }
  if (items === null) {
    return { ok: false, message: `Envie no máximo ${MAX_QUOTE_ITEMS} itens válidos.` };
  }

  return {
    ok: true,
    data: {
      type: body.type,
      name,
      email,
      organization,
      context,
      phone,
      consent: true,
      items,
    },
  };
}
