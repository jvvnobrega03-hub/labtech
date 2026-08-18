"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { createWhatsAppUrl, siteConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [channelMessage, setChannelMessage] = useState("Olá, gostaria de falar com a equipe da Labtech.");
  const confirmationHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "done") confirmationHeading.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.consent = form.get("consent") === "on" ? "true" : "false";

    try {
      trackEvent("contact_submit");
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, organization: payload.company, context: `${payload.subject}: ${payload.message}`, type: "contato" }),
      });
      const data = await response.json() as { message?: string };
      if (!response.ok) throw new Error(data.message || "Não foi possível validar a mensagem.");
      setChannelMessage(["Olá, gostaria de falar com a equipe da Labtech.", "", `Assunto: ${String(payload.subject)}`, `Mensagem: ${String(payload.message)}`].join("\n"));
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível validar a mensagem.");
    }
  }

  if (status === "done") {
    return (
      <div className="contact-form contact-form--success rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="contact-form__success-icon mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-teal-700"><CheckIcon className="size-7" /></span>
        <h2 ref={confirmationHeading} tabIndex={-1} className="display mt-5 text-3xl">Dados revisados</h2>
        <p className="mt-4 leading-7 text-slate-600">Para concluir o contato e confirmar o recebimento, fale agora com a equipe por um dos canais comerciais.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><a className="button button-primary" href={createWhatsAppUrl(channelMessage)} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { context: "contact" })}>Abrir WhatsApp</a><a className="button button-outline" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Contato pelo site Labtech")}&body=${encodeURIComponent(channelMessage)}`}>Enviar e-mail</a></div>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-bold text-teal-700">Revisar mensagem</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={status === "sending"} aria-describedby="contact-demo-notice" className="contact-form rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Nome" required autoComplete="name" />
        <Field name="company" label="Empresa" required autoComplete="organization" />
        <Field name="email" label="E-mail" type="email" required autoComplete="email" />
        <Field name="phone" label="Telefone" type="tel" required autoComplete="tel" />
        <Field name="subject" label="Assunto" required wide />
        <label className="text-sm font-semibold sm:col-span-2">Mensagem <span className="text-red-700">*</span><textarea name="message" className="input mt-2 font-normal" required minLength={20} maxLength={2000} placeholder="Descreva sua dúvida com contexto suficiente." /></label>
        <label className="absolute -left-[10000px]" aria-hidden="true">Página pessoal<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="contact-form__consent mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600">
        <input name="consent" type="checkbox" required className="mt-1 size-4 accent-teal-700" />
        Li a <Link href="/politica-de-privacidade" className="font-bold text-teal-700">política de privacidade</Link> e concordo com a validação desta mensagem.
      </label>
      <p id="contact-demo-notice" className="contact-form__demo-note mt-4 text-xs leading-5 text-slate-500">Os dados são validados, mas o envio só é concluído ao confirmar o contato por WhatsApp ou e-mail.</p>
      {status === "error" && <p className="contact-form__error mt-4 text-sm text-red-700" role="alert">{message}</p>}
      <span className="sr-only" role="status" aria-live="polite">{status === "sending" ? "Validando mensagem" : ""}</span>
      <button type="submit" disabled={status === "sending"} className="button button-primary mt-7 disabled:opacity-50">{status === "sending" ? "Validando..." : "Revisar canais de envio"}</button>
    </form>
  );
}

function Field({ name, label, type = "text", required, autoComplete, wide }: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string; wide?: boolean }) {
  return <label className={`text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>{label} {required && <span className="text-red-700">*</span>}<input name={name} type={type} className="input mt-2 font-normal" required={required} minLength={required ? 2 : undefined} maxLength={160} autoComplete={autoComplete} /></label>;
}
