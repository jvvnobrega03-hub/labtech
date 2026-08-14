import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Contato", "Entre em contato com a Labtech para dúvidas sobre diagnóstico e soluções laboratoriais.", "/contato");
export default function ContactPage() { return <><PageHero eyebrow="Contato" title="Fale com a Labtech." description="Envie sua dúvida com os dados da empresa e o contexto necessário para identificação da mensagem." /><section className="shell grid gap-12 py-20 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">Canal digital</p><h2 className="display mt-4 text-4xl">Uma mensagem direta e objetiva.</h2><p className="mt-5 leading-8 text-slate-600">Os canais diretos só aparecem quando configurados e verificados. Neste ambiente, o formulário valida os dados, mas não persiste nem encaminha a mensagem.</p>{siteConfig.email && <a className="mt-7 block font-bold text-teal-700" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>}<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600"><strong className="text-ink">Para orçamento:</strong> use o fluxo dedicado para incluir produtos, quantidades e dados da instituição.</div></div><ContactForm /></section></>; }
