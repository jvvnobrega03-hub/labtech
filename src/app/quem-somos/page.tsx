import Image from "next/image";
import Link from "next/link";
import { Callout, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Quem somos", "Conheça a Labtech, empresa que atua desde 1997 com produtos para laboratórios, hospitais, clínicas e centros de pesquisa.", "/quem-somos");

export default function AboutPage() {
  const pillars = [
    ["Compreensão da demanda", "Cada consulta começa pela rotina e pelas necessidades da instituição."],
    ["Informação responsável", "Características técnicas e comerciais não são atribuídas sem confirmação."],
    ["Jornada organizada", "Catálogo, orçamento e contato estruturam as informações necessárias."],
  ];

  return (
    <div className="standard-page standard-page--about">
      <link rel="preload" as="image" href="/images/about-puppy-hero-poster.webp" fetchPriority="high" />
      <section className="about-video-hero" aria-labelledby="about-hero-title">
        <video
          className="about-video-hero__video"
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="/images/about-puppy-hero-poster.webp"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source media="(max-width: 767px)" src="/videos/about-puppy-hero-mobile.mp4" type="video/mp4" />
          <source src="/videos/about-puppy-hero.mp4" type="video/mp4" />
        </video>
        <div className="about-video-hero__scrim" aria-hidden="true" />
        <div className="about-video-hero__grid" aria-hidden="true" />
        <div className="about-video-hero__content shell">
          <div className="about-video-hero__copy">
            <p className="about-video-hero__eyebrow"><span aria-hidden="true" /> Quem somos</p>
            <h1 id="about-hero-title" className="about-video-hero__title">Desde 1997, confiança para rotinas laboratoriais e hospitalares.</h1>
            <p className="about-video-hero__description">A Labtech atua no relacionamento B2B com laboratórios, hospitais, clínicas e centros de pesquisa que buscam produtos e soluções para suas rotinas.</p>
            <div className="about-video-hero__actions">
              <a href="#nossa-atuacao" className="about-video-hero__button about-video-hero__button--primary">Conhecer nossa atuação <span aria-hidden="true">→</span></a>
              <Link href="/catalogo" className="about-video-hero__button about-video-hero__button--secondary">Explorar catálogo</Link>
            </div>
            <div className="about-video-hero__proof" aria-label="Diferenciais da Labtech">
              <span>Desde 1997</span>
              <span>Atendimento B2B</span>
              <span>Saúde e diagnóstico</span>
            </div>
          </div>
        </div>
      </section>
      <section id="nossa-atuacao" className="standard-page__intro shell scroll-mt-28 grid items-center gap-14 py-24 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Nossa atuação" title="Experiência para compreender necessidades técnicas" description="A atuação desde 1997 orienta uma abordagem baseada em escuta, organização da demanda e comunicação responsável entre a instituição e a solução consultada." />
          <p className="mt-6 leading-8 text-slate-600">O catálogo digital apoia a etapa inicial do atendimento. A definição de produtos, condições e características depende da confirmação técnica e comercial aplicável a cada solicitação.</p>
        </div>
        <div className="standard-page__media relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-emerald-50">
          <Image src="/images/hero-lab-v4.webp" alt="Rotina técnica em laboratório clínico" fill quality={90} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>
      <section className="standard-page__band py-24">
        <div className="shell">
          <SectionHeading eyebrow="Nossa forma de trabalhar" title="Clareza em cada contato" />
          <div className="standard-page__card-grid mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map(([title, text]) => (
              <article className="standard-page__card rounded-3xl bg-white p-7" key={title}>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Callout title="Conheça as soluções do catálogo." text="Selecione itens, quantidades e observações para preparar sua solicitação." href="/catalogo" label="Explorar catálogo" />
    </div>
  );
}
