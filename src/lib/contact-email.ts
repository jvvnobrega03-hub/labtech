import { createHash } from "node:crypto";
import { Resend } from "resend";
import type { NormalizedContactRequest } from "@/lib/contact-validation";
import { buildContactEmail } from "@/lib/contact-email-content";
import { companyConfig } from "@/lib/config";

export type ContactEmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: "configuration" | "provider" };

function idempotencyKey(data: NormalizedContactRequest): string {
  const fiveMinuteWindow = Math.floor(Date.now() / 300_000);
  const digest = createHash("sha256")
    .update(`${data.email}|${data.context}|${fiveMinuteWindow}`)
    .digest("hex")
    .slice(0, 32);
  return `contact-${digest}`;
}

export async function sendContactEmail(data: NormalizedContactRequest): Promise<ContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, reason: "configuration" };

  const email = buildContactEmail(data, {
    recipient: process.env.CONTACT_EMAIL_TO?.trim() || companyConfig.email,
    sender: process.env.CONTACT_EMAIL_FROM?.trim() || `Labtech <${companyConfig.email}>`,
  });

  try {
    const resend = new Resend(apiKey);
    const { data: response, error } = await resend.emails.send(
      {
        from: email.from,
        to: email.to,
        replyTo: email.replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
        tags: [{ name: "source", value: "contact-form" }],
      },
      { idempotencyKey: idempotencyKey(data) },
    );

    if (error || !response?.id) {
      console.error("Contact email provider rejected the request", {
        name: error?.name,
        statusCode: error?.statusCode,
      });
      return { ok: false, reason: "provider" };
    }

    return { ok: true, id: response.id };
  } catch (error) {
    console.error("Contact email delivery failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return { ok: false, reason: "provider" };
  }
}
