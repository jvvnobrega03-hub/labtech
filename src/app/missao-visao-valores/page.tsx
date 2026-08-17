import { pageMetadata } from "@/lib/metadata";
import { Callout, PageHero } from "@/components/ui";

export const metadata = pageMetadata("Missão, visão e valores", "Conheça os princípios que orientam a Labtech.", "/missao-visao-valores");

const principles = [
  { number: "01", label: "Missão", title: "Facilitar consultas laboratoriais bem contextualizadas.", text: "Organizar informação e fluxos digitais para que necessidades sejam descritas com clareza, sem substituir a avaliação técnica." },
  { number: "02", label: "Visão", title: "Ser uma referência de clareza na jornada de consulta.", text: "Construir uma experiência em que conteúdo, seleção e contato respeitem os limites da informação disponível." },
];

const values = [
  ["Precisão", "Distinguir conteúdo demonstrativo de informação verificada."],
  ["Transparência", "Comunicar como os dados são tratados e quais são os limites do fluxo."],
  ["Responsabilidade", "Não atribuir desempenho, certificações ou adequação sem comprovação."],
  ["Acessibilidade", "Projetar para diferentes pessoas, dispositivos e formas de interação."],
  ["Contexto", "Reconhecer que a melhor escolha depende da aplicação real."],
  ["Simplicidade", "Reduzir ruído sem reduzir a complexidade técnica de forma indevida."],
];

export default function PrinciplesPage() {
  return (
    <div className="standard-page standard-page--principles">
      <PageHero eyebrow="Fundamentos" title="Princípios para comunicar com precisão." description="Missão, visão e valores editoriais que orientam esta experiência digital." />
      <section className="shell py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((item) => (
            <article key={item.label} className="standard-page__card rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10">
              <p className="text-sm font-bold text-teal-700">{item.number} · {item.label}</p>
              <h2 className="display mt-6 text-4xl">{item.title}</h2>
              <p className="mt-5 leading-8 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-20">
          <p className="eyebrow">Valores</p>
          <h2 className="display mt-4 text-5xl">O que orienta cada decisão</h2>
          <div className="standard-page__value-grid mt-10 grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
            {values.map(([title, text]) => (
              <article className="standard-page__value-card bg-white p-7" key={title}>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Callout title="Veja esses princípios aplicados ao catálogo." text="Cada referência editorial deixa explícitos seu propósito e seus limites." href="/catalogo" label="Conhecer o catálogo" />
    </div>
  );
}
