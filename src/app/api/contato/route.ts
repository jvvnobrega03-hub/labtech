import { NextResponse } from "next/server";
import { MAX_REQUEST_BYTES, validateContactPayload } from "@/lib/contact-validation";

type RateLimitState = { count: number; resetAt: number };
type ErrorResponse = { ok: false; message: string };
type ValidationResponse = {
  ok: true;
  validated: true;
  persisted: false;
  delivered: false;
  normalized: { type: "contato" | "orcamento"; itemCount: number };
};

const attempts = new Map<string, RateLimitState>();
const windowMs = 60_000;
const maxAttempts = 5;
const responseHeaders = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "X-Robots-Tag": "noindex, nofollow",
};

class BodyTooLargeError extends Error {}

function json(body: ErrorResponse | ValidationResponse, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { ...responseHeaders, ...headers } });
}

function clientKey(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  );
}

function rateLimit(key: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();

  if (attempts.size > 1_000) {
    for (const [attemptKey, state] of attempts) {
      if (state.resetAt <= now) attempts.delete(attemptKey);
    }
  }

  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;
  return {
    limited: current.count > maxAttempts,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
  };
}

async function readTextWithLimit(request: Request): Promise<string> {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let byteCount = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteCount += value.byteLength;
    if (byteCount > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    text += decoder.decode(value, { stream: true });
  }

  return text + decoder.decode();
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    return json({ ok: false, message: "Envie a solicitação como application/json." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return json({ ok: false, message: "Solicitação muito grande." }, 413);
  }

  const limit = rateLimit(clientKey(request));
  if (limit.limited) {
    return json(
      { ok: false, message: "Muitas tentativas. Aguarde um minuto e tente novamente." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  let body: unknown;
  try {
    const rawBody = await readTextWithLimit(request);
    body = JSON.parse(rawBody);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return json({ ok: false, message: "Solicitação muito grande." }, 413);
    }
    return json({ ok: false, message: "Formato de solicitação inválido." }, 400);
  }

  const result = validateContactPayload(body);
  if (!result.ok) return json({ ok: false, message: result.message }, 400);

  return json({
    ok: true,
    validated: true,
    persisted: false,
    delivered: false,
    normalized: { type: result.data.type, itemCount: result.data.items.length },
  });
}
