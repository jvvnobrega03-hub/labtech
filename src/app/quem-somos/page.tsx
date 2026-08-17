import Image from "next/image";
import Link from "next/link";
import { FlaskIcon, MicroscopeIcon, ShieldIcon, SupportIcon, TubesIcon } from "@/components/icons";
import { Callout, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Quem somos",
  "Desde 1997, a Labtech oferece produtos, serviços e soluções para laboratórios, hospitais, clínicas e centros de pesquisa.",
  "/quem-somos",
);

export default function AboutPage() {
  const differentiators = [
    {
      title: "Experiência consolidada",
      text: "Quase 30 anos de atuação no setor diagnóstico.",
      icon: TubesIcon,
    },
    {
      title: "Qualidade reconhecida",
      text: "Qualidade alinhada a padrões reconhecidos internacionalmente.",
      icon: ShieldIcon,
    },
    {
      title: "Atendimento especializado",
      text: "Atendimento próximo, ágil e orientado às necessidades de cada cliente.",
      icon: SupportIcon,
    },
  ];

  const areas = [
    {
      title: "Laboratórios",
      text: "Laboratórios humanos e veterinários.",
      icon: FlaskIcon,
    },
    {
      title: "Saúde assistencial",
      text: "Hospitais e clínicas.",
      icon: ShieldIcon,
    },
    {
      title: "Pesquisa e serviços",
      text: "Centros de pesquisa e outros serviços de saúde.",
      icon: MicroscopeIcon,
    },
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
            <h1 id="about-hero-title" className="about-video-hero__title">Há quase 30 anos, soluções diagnósticas com qualidade, agilidade e confiança.</h1>
            <p className="about-video-hero__description">Atendemos laboratórios, hospitais, clínicas e centros de pesquisa com um portfólio completo de produtos, serviços e soluções para a área diagnóstica, sempre com foco em excelência, inovação e atendimento especializado.</p>
            <div className="about-video-hero__actions">
              <Link href="/contato" className="about-video-hero__button about-video-hero__button--primary text-center leading-5">Fale com nossa equipe e descubra a solução ideal para o seu laboratório. <span aria-hidden="true">→</span></Link>
              <Link href="/catalogo" className="about-video-hero__button about-video-hero__button--secondary">Explorar catálogo</Link>
            </div>
            <div className="about-video-hero__proof" aria-label="Diferenciais da Labtech">
              <span>Desde 1997</span>
              <span>Padrões internacionais</span>
              <span>Atendimento especializado</span>
            </div>
          </div>
        </div>
      </section>
      <section id="nossa-atuacao" className="standard-page__intro shell scroll-mt-28 grid items-center gap-14 py-24 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Nossa trajetória"
            title="Experiência que acompanha a evolução do diagnóstico"
            description="Desde 1997, construímos uma trajetória sólida levando produtos, serviços e soluções para os mais diversos segmentos da área diagnóstica. Atuamos ao lado de laboratórios humanos e veterinários, hospitais, centros de pesquisa, clínicas e outros serviços de saúde, sempre com foco em qualidade, confiança e padrões reconhecidos internacionalmente. Com uma linha ampla e completa, unimos experiência, eficiência e atendimento especializado para apoiar nossos clientes em um mercado cada vez mais dinâmico e exigente. Mais do que fornecer soluções, buscamos gerar valor real no dia a dia, contribuindo para a excelência operacional e o fortalecimento de cada parceiro que atendemos."
          />
          <p className="mt-6 border-l-2 border-sky-400 pl-5 text-lg font-medium leading-8 text-slate-700">Tradição, tecnologia e atendimento próximo para gerar mais eficiência, segurança e confiança em cada etapa.</p>
        </div>
        <div className="standard-page__media relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-emerald-50">
          <Image src="/images/hero-lab-v4.webp" alt="Rotina técnica em laboratório clínico" fill quality={90} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>
      <section className="standard-page__band py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Diferenciais"
            title="Experiência, portfólio e atendimento que geram confiança"
            description="Combinamos experiência de mercado, portfólio completo e atendimento especializado para entregar soluções diagnósticas com mais eficiência e confiança."
          />
          <div className="standard-page__card-grid mt-10 grid gap-5 md:grid-cols-3">
            {differentiators.map(({ title, text, icon: Icon }) => (
              <article className="standard-page__card rounded-3xl bg-white p-7" key={title}>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700" aria-hidden="true">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="shell py-24">
        <SectionHeading
          eyebrow="Áreas de atuação"
          title="Soluções para diferentes frentes da saúde"
          description="Atendemos diferentes frentes da área diagnóstica com soluções desenvolvidas para apoiar rotinas técnicas, operacionais e assistenciais com segurança e desempenho."
        />
        <div className="standard-page__card-grid mt-10 grid gap-5 md:grid-cols-3">
          {areas.map(({ title, text, icon: Icon }) => (
            <article className="standard-page__card rounded-3xl bg-white p-7" key={title}>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700" aria-hidden="true">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <Callout
        title="Sua operação precisa de mais confiança, agilidade e excelência diagnóstica?"
        text="Conte com uma equipe preparada para entender a sua necessidade e entregar a solução ideal para o seu negócio."
        href="/contato"
        label="Falar com nossa equipe"
      />
    </div>
  );
}
