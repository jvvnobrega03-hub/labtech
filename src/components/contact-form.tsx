"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const confirmationHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "done") confirmationHeading.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    setMessage("");
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    payload.consent = form.get("consent") === "on" ? "true" : "false";

    try {
      trackEvent("contact_submit");
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, organization: payload.company, context: `${payload.subject}: ${payload.message}`, type: "contato" }),
      });
      const data = await response.json() as { delivered?: boolean; message?: string };
      if (!response.ok || data.delivered !== true) {
        throw new Error(data.message || "Não foi possível enviar a mensagem.");
      }
      formElement.reset();
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar a mensagem.");
    }
  }

  if (status === "done") {
    return (
      <div className="contact-form contact-form--success rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="contact-form__success-icon mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-teal-700"><CheckIcon className="size-7" /></span>
        <h2 ref={confirmationHeading} tabIndex={-1} className="display mt-5 text-2xl md:text-3xl">Mensagem enviada</h2>
        <p className="mt-4 leading-7 text-slate-600">Sua mensagem foi enviada diretamente para o e-mail institucional da Labtech. A equipe poderá responder pelo endereço informado no formulário.</p>
        <button type="button" onClick={() => setStatus("idle")} className="button button-outline mt-7">Enviar outra mensagem</button>
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
        Li a <Link href="/politica-de-privacidade" className="font-bold text-teal-700">política de privacidade</Link> e concordo com o tratamento dos dados para este atendimento.
      </label>
      <p id="contact-demo-notice" className="contact-form__demo-note mt-4 text-xs leading-5 text-slate-500">Ao enviar, a mensagem será encaminhada diretamente ao e-mail institucional cadastrado.</p>
      {status === "error" && <p className="contact-form__error mt-4 text-sm text-red-700" role="alert">{message}</p>}
      <span className="sr-only" role="status" aria-live="polite">{status === "sending" ? "Enviando mensagem" : ""}</span>
      <button type="submit" disabled={status === "sending"} className="button button-primary mt-7 disabled:opacity-50">{status === "sending" ? "Enviando..." : "Enviar mensagem"}</button>
    </form>
  );
}

function Field({ name, label, type = "text", required, autoComplete, wide }: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string; wide?: boolean }) {
  return <label className={`text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>{label} {required && <span className="text-red-700">*</span>}<input name={name} type={type} className="input mt-2 font-normal" required={required} minLength={required ? 2 : undefined} maxLength={160} autoComplete={autoComplete} /></label>;
}
