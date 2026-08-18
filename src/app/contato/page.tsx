import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Contato", "Entre em contato com a Labtech para dúvidas sobre produtos laboratoriais, hospitalares e soluções para diagnóstico.", "/contato");

export default function ContactPage() {
  return (
    <div className="contact-dark">
      <PageHero eyebrow="Contato" title="Fale com a Labtech." description="Compartilhe os dados da instituição e o contexto da sua necessidade para direcionar o atendimento." />
      <section className="contact-dark__body shell grid gap-12 py-20 lg:grid-cols-[.75fr_1.25fr]">
        <div className="contact-dark__intro">
          <p className="eyebrow">Atendimento comercial</p>
          <h2 className="display mt-4 text-4xl">Uma conversa técnica começa pelo contexto.</h2>
          <p className="mt-5 leading-8 text-slate-600">Use os canais diretos para falar com a equipe. O formulário organiza e valida os dados antes de direcionar você ao canal comercial escolhido.</p>
          <div className="contact-dark__channels mt-7 grid gap-2">
            <a className="font-bold text-teal-700" href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
            <a className="font-bold text-teal-700" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a className="font-bold text-teal-700" href={siteConfig.whatsapp} target="_blank" rel="noreferrer">WhatsApp comercial</a>
          </div>
          <div className="contact-dark__notice mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
            <strong className="text-ink">Para orçamento:</strong> use o fluxo dedicado para incluir produtos, quantidades e dados da instituição.
          </div>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
