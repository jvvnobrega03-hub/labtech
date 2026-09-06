import Image from "next/image";
import Link from "next/link";
import { FlaskIcon, MicroscopeIcon, ShieldIcon, SupportIcon, TubesIcon } from "@/components/icons";
import { Callout, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
import { companyExperienceLabel } from "@/lib/config";
import styles from "./story.module.css";

export const metadata = pageMetadata(
  "Quem somos",
  `${companyExperienceLabel()}, a Labtech oferece produtos, serviços e soluções para laboratórios, hospitais, clínicas e centros de pesquisa.`,
  "/quem-somos",
);

export default function AboutPage() {
  const differentiators = [
    {
      title: "Experiência consolidada",
      text: `${companyExperienceLabel()} no setor diagnóstico.`,
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
      <section className="veterinary-video-hero institutional-static-hero" aria-labelledby="about-hero-title">
        <div className="veterinary-video-hero__scrim" aria-hidden="true" />
        <div className="veterinary-video-hero__grid" aria-hidden="true" />
        <div className="institutional-static-hero__ambient" aria-hidden="true" />
        <div className="institutional-static-hero__orbit" aria-hidden="true" />
        <div className="veterinary-video-hero__content shell">
          <div className="veterinary-video-hero__copy">
            <p className="veterinary-video-hero__eyebrow"><span aria-hidden="true" /> Quem somos</p>
            <h1 id="about-hero-title" className="veterinary-video-hero__title">{companyExperienceLabel()}, soluções diagnósticas com qualidade, agilidade e confiança.</h1>
            <p className="veterinary-video-hero__description">Atendemos laboratórios, hospitais, clínicas e centros de pesquisa com um portfólio completo de produtos, serviços e soluções para a área diagnóstica, sempre com foco em excelência, inovação e atendimento especializado.</p>
            <div className="veterinary-video-hero__actions">
              <Link href="/contato" className="veterinary-video-hero__button veterinary-video-hero__button--primary text-center leading-5">Fale com nossa e tenha a solução ideal <span aria-hidden="true">→</span></Link>
              <Link href="/catalogo" className="veterinary-video-hero__button veterinary-video-hero__button--secondary">Explorar catálogo</Link>
            </div>
            <div className="veterinary-video-hero__proof" aria-label="Diferenciais da Labtech">
              <span>{companyExperienceLabel()}</span>
              <span>Padrões internacionais</span>
              <span>Atendimento especializado</span>
            </div>
          </div>
        </div>
      </section>
      <section id="nossa-atuacao" aria-labelledby="about-story-title" className={`standard-page__intro shell scroll-mt-28 ${styles.story}`}>
        <div className={styles.context}>
          <p className="eyebrow">Nossa trajetória</p>
          <h2 id="about-story-title" className={styles.title}>Uma história de propósito, pioneirismo e precisão.</h2>
          <div className={`standard-page__media ${styles.image}`}>
            <Image src="/images/hero-lab-v4.webp" alt="Rotina técnica em laboratório clínico" fill quality={90} sizes="(min-width: 1024px) 360px, (min-width: 768px) 32vw, 100vw" className="object-cover" />
          </div>
        </div>
        <figure className={styles.letter}>
          <blockquote className={styles.quotation}>
            <p className={styles.opening}>“Construir o futuro do diagnóstico exige mais do que ciência: exige <strong>propósito e coragem.</strong>”</p>
            <div className={styles.body}>
              <p>Minha história com a saúde começou em 1981, quando me formei em Biomedicina e mergulhei na rotina dos maiores centros diagnósticos de São Paulo. Essa vivência prática foi a base que me impulsionou à liderança de <strong>gigantes globais da indústria</strong>: na <strong>Merck S.A.,</strong> conduzi operações estratégicas como Gerente Regional da Divisão Diagnóstica e, tempos depois, assumi como Diretor Comercial a missão de planejar e executar a <strong>implantação integral da Boehringer Mannheim no Brasil</strong>.</p>
              <p>Após liderar multinacionais, entendi que era hora de criar algo que carregasse a minha própria visão de excelência e compromisso com o mercado nacional. Em 1997, dei vida à <strong>Labtech</strong> — empresa que nasceu para ser referência e que, há décadas, abastece e impulsiona a rotina de laboratórios clínicos e veterinários de todo o país.</p>
              <p>Mas a inovação não para. Em 2014, expandi essa fronteira ao fundar a <strong>Biomedtech do Brasil</strong>, erguendo uma <strong>estrutura fabril de alta precisão</strong> dedicada à <strong>produção de reagentes</strong> para suprir as demandas diagnósticas não apenas do Brasil, mas de <strong>toda a América Latina</strong>.</p>
              <p>A <strong>Labtech</strong> não é apenas uma fornecedora; é a materialização de <strong>mais de quatro décadas de paixão pela biomedicina</strong>, pioneirismo e um compromisso inegociável com a <strong>precisão absoluta da saúde humana e animal.</strong></p>
            </div>
          </blockquote>
          <figcaption className={styles.signature}>
            <strong><em><span className={styles.name}>Carlos Benzoni (Benzoni)</span><span className={styles.role}>Biomédico e Fundador do Grupo Labtech</span></em></strong>
          </figcaption>
        </figure>
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
