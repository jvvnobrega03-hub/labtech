import Link from "next/link";
import { DeferredVideo } from "@/components/deferred-video";
import { AnalyticsLink } from "@/components/analytics-link";
import { ArrowIcon, CheckIcon, FlaskIcon, ShieldIcon, SupportIcon } from "@/components/icons";
import { Callout, SectionHeading } from "@/components/ui";
import { categories } from "@/data/products";
import { createWhatsAppUrl } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Soluções para diagnóstico veterinário",
  "Produtos e soluções B2B para laboratórios, clínicas e hospitais veterinários, com atendimento especializado da Labtech.",
  "/veterinario",
);

const categorySlugs = ["coleta-e-acondicionamento", "equipamentos-laboratoriais", "reagentes-e-kits", "diagnostico-in-vitro"];

export default function VeterinaryPage() {
  const veterinaryCategories = categories.filter((category) => categorySlugs.includes(category.slug));
  const whatsappUrl = createWhatsAppUrl("Olá, gostaria de conhecer as soluções da Labtech para diagnóstico veterinário.");

  return (
    <div className="veterinary-page">
      <section className="veterinary-hero">
        <div className="shell grid items-center gap-12 py-20 lg:grid-cols-[1fr_.95fr] lg:py-28">
          <div>
            <p className="eyebrow">Diagnóstico veterinário · B2B</p>
            <h1 className="display mt-5 text-5xl text-white md:text-6xl">Precisão técnica para quem cuida da saúde animal.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Soluções para laboratórios, clínicas e hospitais veterinários, organizadas para apoiar a consulta técnica e a rotina de diagnóstico animal.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/orcamento" className="button button-light">Solicitar orçamento</Link><AnalyticsLink eventName="whatsapp_click" eventData={{ context: "veterinary" }} href={whatsappUrl} target="_blank" rel="noreferrer" className="button button-dark-outline">Falar pelo WhatsApp</AnalyticsLink></div>
          </div>
          <DeferredVideo src="/videos/about-puppy-hero.mp4" poster="/images/about-puppy-hero-poster.webp" title="Tecnologia e cuidado no atendimento veterinário" />
        </div>
      </section>

      <section className="shell py-24">
        <SectionHeading eyebrow="Frentes de solução" title="Categorias para diferentes etapas da rotina veterinária" description="A configuração, a finalidade de uso e a disponibilidade são confirmadas individualmente durante o atendimento." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {veterinaryCategories.map((category) => (
            <Link key={category.slug} href={`/catalogo/${category.slug}`} className="veterinary-category-card">
              <FlaskIcon className="size-6" />
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <span>Explorar categoria <ArrowIcon className="size-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-sky-100 bg-[#F3F9FC] py-24">
        <div className="shell grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <SectionHeading eyebrow="Atendimento especializado" title="Uma consulta técnica orientada ao contexto da operação" description="A Labtech organiza a necessidade por aplicação, compatibilidade, apresentação e documentação disponível, sem substituir a avaliação técnica da instituição nem a finalidade indicada pelo fabricante." />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [ShieldIcon, "Seleção responsável", "Produtos avaliados conforme finalidade e contexto informado."],
              [SupportIcon, "Atendimento consultivo", "Organização clara para facilitar a decisão institucional."],
              [FlaskIcon, "Rotina diagnóstica", "Linhas para diferentes etapas laboratoriais e clínicas."],
              [CheckIcon, "Continuidade", "Cotação com itens, quantidades e observações em um único fluxo."],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof FlaskIcon;
              return <article key={title as string} className="veterinary-benefit"><ItemIcon className="size-6" /><h3>{title as string}</h3><p>{text as string}</p></article>;
            })}
          </div>
        </div>
      </section>

      <Callout title="Precisa estruturar uma consulta para sua operação veterinária?" text="Reúna os itens e compartilhe o contexto para receber um atendimento técnico-comercial mais objetivo." label="Iniciar cotação" />
    </div>
  );
}
