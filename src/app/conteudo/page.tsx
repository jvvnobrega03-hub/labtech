import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Conteúdo", "Conteúdo sobre organização de consultas e rotinas laboratoriais.", "/conteudo");

const articles = [
  { tag: "Orientação", title: "Como preparar uma consulta técnica mais clara", text: "Um roteiro editorial para organizar objetivo, contexto de uso e restrições antes do contato." },
  { tag: "Catálogo", title: "Por que referências neutras ajudam na etapa inicial", text: "Entenda a separação entre navegação editorial e definição técnica de uma solução." },
  { tag: "Boas práticas", title: "Dados que não devem entrar em um formulário aberto", text: "Cuidados básicos para evitar informações sensíveis em solicitações preliminares." },
];

export default function ContentPage() {
  return (
    <div className="standard-page standard-page--content">
      <PageHero eyebrow="Conteúdo" title="Conhecimento para consultas mais conscientes." description="Notas editoriais para organizar necessidades e navegar com responsabilidade por temas laboratoriais." />
      <section className="shell py-24">
        <SectionHeading eyebrow="Caderno editorial" title="Leituras em destaque" description="Conteúdos demonstrativos apresentados sem alegações científicas, comerciais ou regulatórias." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articles.map((article, index) => (
            <article className="standard-page__card flex min-h-80 flex-col rounded-3xl border border-slate-200 bg-white p-7" key={article.title}>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700">{article.tag}</p>
              <p className="mt-6 text-xs text-slate-400">Leitura editorial · 0{index + 1}</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight">{article.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{article.text}</p>
              <span className="mt-auto flex items-center gap-2 pt-7 text-sm font-bold text-slate-400" aria-label="Conteúdo demonstrativo, sem página individual">Em breve <ArrowIcon className="size-4" /></span>
            </article>
          ))}
        </div>
        <div className="standard-page__prompt mt-14 rounded-3xl bg-[#EDF9FC] p-8 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Procura uma informação específica?</h2>
            <p className="mt-2 text-slate-600">Envie uma dúvida geral pelo formulário de contato.</p>
          </div>
          <Link href="/contato" className="button button-primary mt-6 md:mt-0">Ir para contato</Link>
        </div>
      </section>
    </div>
  );
}
