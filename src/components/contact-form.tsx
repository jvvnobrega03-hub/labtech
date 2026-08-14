"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
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
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, organization: payload.company, context: `${payload.subject}: ${payload.message}`, type: "contato" }),
      });
      const data = await response.json() as { message?: string };
      if (!response.ok) throw new Error(data.message || "Não foi possível validar a mensagem.");
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível validar a mensagem.");
    }
  }

  if (status === "done") return <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm"><span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-teal-700"><CheckIcon className="size-7" /></span><h2 ref={confirmationHeading} tabIndex={-1} className="display mt-5 text-3xl">Mensagem validada</h2><p className="mt-4 leading-7 text-slate-600">Este ambiente demonstrativo não armazena nem encaminha mensagens. A validação não confirma recebimento pela Labtech.</p><button type="button" onClick={() => setStatus("idle")} className="button button-outline mt-7">Nova mensagem</button></div>;
  return <form onSubmit={submit} aria-busy={status === "sending"} aria-describedby="contact-demo-notice" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-9"><div className="grid gap-5 sm:grid-cols-2"><Field name="name" label="Nome" required autoComplete="name" /><Field name="company" label="Empresa" required autoComplete="organization" /><Field name="email" label="E-mail" type="email" required autoComplete="email" /><Field name="phone" label="Telefone" type="tel" required autoComplete="tel" /><Field name="subject" label="Assunto" required wide /><label className="text-sm font-semibold sm:col-span-2">Mensagem <span className="text-red-700">*</span><textarea name="message" className="input mt-2 font-normal" required minLength={20} maxLength={2000} placeholder="Descreva sua dúvida com contexto suficiente." /></label><label className="absolute -left-[10000px]" aria-hidden="true">Página pessoal<input name="website" tabIndex={-1} autoComplete="off" /></label></div><label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600"><input name="consent" type="checkbox" required className="mt-1 size-4 accent-teal-700" />Li a <Link href="/politica-de-privacidade" className="font-bold text-teal-700">política de privacidade</Link> e concordo com a validação desta mensagem.</label><p id="contact-demo-notice" className="mt-4 text-xs leading-5 text-slate-500">Nenhuma mensagem é persistida ou encaminhada neste ambiente.</p>{status === "error" && <p className="mt-4 text-sm text-red-700" role="alert">{message}</p>}<span className="sr-only" role="status" aria-live="polite">{status === "sending" ? "Validando mensagem" : ""}</span><button type="submit" disabled={status === "sending"} className="button button-primary mt-7 disabled:opacity-50">{status === "sending" ? "Validando..." : "Validar mensagem"}</button></form>;
}
function Field({ name, label, type = "text", required, autoComplete, wide }: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string; wide?: boolean }) { return <label className={`text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>{label} {required && <span className="text-red-700">*</span>}<input name={name} type={type} className="input mt-2 font-normal" required={required} minLength={required ? 2 : undefined} maxLength={160} autoComplete={autoComplete} /></label>; }
