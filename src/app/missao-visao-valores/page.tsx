import {
  BoxIcon,
  FlaskIcon,
  MicroscopeIcon,
  ShieldIcon,
  SparkIcon,
  SupportIcon,
  TubesIcon,
} from "@/components/icons";
import { pageMetadata } from "@/lib/metadata";
import { companyConfig } from "@/lib/config";

export const metadata = pageMetadata(
  "Nossa essência",
  "Conheça a missão, a ambição, os princípios e os compromissos que orientam a atuação da Labtech no mercado de diagnósticos.",
  "/missao-visao-valores",
);

const principles = [
  {
    number: "01",
    title: "Integridade e confiança",
    text: "Integridade e confiança como base de todas as decisões, relações e compromissos institucionais.",
    icon: ShieldIcon,
  },
  {
    number: "02",
    title: "Excelência com disciplina",
    text: "Excelência com disciplina na busca contínua por qualidade, segurança e desempenho superior.",
    icon: SparkIcon,
  },
  {
    number: "03",
    title: "Respeito às pessoas",
    text: "Respeito e valorização das pessoas como princípio essencial das relações internas e externas.",
    icon: SupportIcon,
  },
  {
    number: "04",
    title: "Responsabilidade sustentável",
    text: "Responsabilidade sustentável na condução das operações e na relação com o meio ambiente.",
    icon: BoxIcon,
  },
];

const differentiators = [
  {
    number: "01",
    title: "Especialização técnica",
    text: "Especialização técnica para atender com precisão as exigências do setor de diagnósticos.",
    icon: MicroscopeIcon,
  },
  {
    number: "02",
    title: "Excelência operacional",
    text: "Excelência operacional com foco em eficiência, segurança e confiabilidade na entrega.",
    icon: FlaskIcon,
  },
  {
    number: "03",
    title: "Relacionamento consultivo",
    text: "Relacionamento consultivo orientado à geração de valor e à construção de parcerias duradouras.",
    icon: SupportIcon,
  },
];

const commitments = [
  {
    number: "01",
    text: "Garantir qualidade e conformidade em todos os processos, produtos e relações comerciais.",
    icon: ShieldIcon,
  },
  {
    number: "02",
    text: "Atuar com agilidade e responsabilidade para assegurar confiança e continuidade aos clientes e parceiros.",
    icon: TubesIcon,
  },
  {
    number: "03",
    text: "Promover crescimento sustentável com respeito às pessoas, ao mercado e ao meio ambiente.",
    icon: SparkIcon,
  },
];

export default function PrinciplesPage() {
  return (
    <div className="standard-page essence-page">
      <section className="essence-hero" aria-labelledby="essence-title">
        <div className="essence-hero__grid" aria-hidden="true" />
        <div className="essence-hero__signal" aria-hidden="true" />
        <div className="shell essence-hero__inner">
          <div className="essence-hero__header">
            <p className="essence-kicker"><span aria-hidden="true" /> Sistema institucional</p>
            <p className="essence-code" aria-label={`Labtech, desde ${companyConfig.foundedYear}`}>LT / {companyConfig.foundedYear}—FUTURO</p>
          </div>
          <div className="essence-hero__layout">
            <div>
              <p className="essence-index">01 / MISSÃO</p>
              <h1 id="essence-title" className="essence-hero__title">Nossa essência orienta cada decisão.</h1>
            </div>
            <p className="essence-hero__statement">Entregar soluções para o mercado de diagnósticos com excelência operacional, rigor técnico e confiabilidade, promovendo agilidade, segurança e suporte qualificado em cada etapa da cadeia de valor.</p>
          </div>
          <div className="essence-hero__metrics" aria-label="Pilares da missão Labtech">
            <span><b>EXC</b> Excelência operacional</span>
            <span><b>RIG</b> Rigor técnico</span>
            <span><b>CNF</b> Confiabilidade</span>
          </div>
        </div>
      </section>

      <section className="essence-axis shell" aria-label="Ambição e propósito">
        <article className="tech-panel essence-axis__panel">
          <div className="essence-axis__topline">
            <span className="tech-index">02</span>
            <span className="essence-axis__tag">Horizonte</span>
          </div>
          <h2>Ambição</h2>
          <p>Consolidar nossa posição como referência no mercado de diagnósticos, reconhecida pela excelência dos processos, pela solidez das relações e pela capacidade de crescer de forma sustentável, inovadora e responsável.</p>
        </article>
        <article className="tech-panel essence-axis__panel essence-axis__panel--accent">
          <div className="essence-axis__topline">
            <span className="tech-index">03</span>
            <span className="essence-axis__tag">Impacto</span>
          </div>
          <h2>Propósito</h2>
          <p>Contribuir para a evolução do cuidado em saúde por meio de soluções confiáveis para o mercado de diagnósticos, gerando valor para clientes, parceiros e sociedade com responsabilidade, eficiência e visão de longo prazo.</p>
        </article>
      </section>

      <section className="essence-principles">
        <div className="shell">
          <header className="essence-section-heading">
            <div>
              <p className="essence-index">04 / PRINCÍPIOS</p>
              <h2>Condutas que transformam intenção em prática.</h2>
            </div>
            <p>Uma base institucional clara para orientar decisões, relações e compromissos em todos os níveis da operação.</p>
          </header>
          <div className="essence-principles__grid">
            {principles.map(({ number, title, text, icon: Icon }) => (
              <article className="tech-panel essence-principle" key={number}>
                <div className="essence-principle__head">
                  <span className="tech-icon" aria-hidden="true"><Icon /></span>
                  <span className="tech-index">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="essence-differentials shell">
        <header className="essence-section-heading essence-section-heading--compact">
          <div>
            <p className="essence-index">05 / DIFERENCIAIS</p>
            <h2>Capacidades que geram valor real.</h2>
          </div>
        </header>
        <div className="essence-differentials__list">
          {differentiators.map(({ number, title, text, icon: Icon }) => (
            <article className="essence-differential" key={number}>
              <span className="tech-index">{number}</span>
              <span className="tech-icon" aria-hidden="true"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="essence-commitments">
        <div className="essence-commitments__grid" aria-hidden="true" />
        <div className="shell essence-commitments__inner">
          <header className="essence-section-heading essence-section-heading--dark">
            <div>
              <p className="essence-index">06 / COMPROMISSOS</p>
              <h2>Responsabilidade aplicada a cada entrega.</h2>
            </div>
            <p>Compromissos permanentes que preservam a confiança, a continuidade e a evolução sustentável das nossas relações.</p>
          </header>
          <div className="essence-commitments__list">
            {commitments.map(({ number, text, icon: Icon }) => (
              <article className="essence-commitment" key={number}>
                <span className="tech-icon tech-icon--dark" aria-hidden="true"><Icon /></span>
                <span className="tech-index">{number}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="essence-closing">Com excelência, confiança e responsabilidade, consolidamos uma atuação orientada à geração de valor, à solidez das relações e à evolução do setor de diagnósticos.</p>
        </div>
      </section>
    </div>
  );
}
