import Link from "next/link";
import { TechnicalCounter, TechnicalMotion } from "@/components/technical-motion";
import {
  ArrowIcon,
  BoxIcon,
  CategoryIcon,
  FlaskIcon,
  MicroscopeIcon,
  SearchIcon,
  ShieldIcon,
  SupportIcon,
  TubesIcon,
} from "@/components/icons";
import { categories, type Category } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import styles from "./solutions.module.css";

export const metadata = pageMetadata(
  "Soluções para operações laboratoriais e hospitalares",
  "Conheça as frentes de solução da Labtech para laboratórios, hospitais, clínicas, diagnóstico veterinário e centros de pesquisa.",
  "/solucoes",
);

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

function categoryFor(slug: Category["slug"]): Category {
  const category = categoryBySlug.get(slug);
  if (!category) throw new Error(`Categoria não encontrada: ${slug}`);
  return category;
}

const journey = [
  { title: "Contexto", text: "A instituição informa sua rotina, ambiente e objetivo de consulta.", icon: SearchIcon },
  { title: "Aplicação", text: "A necessidade é organizada por finalidade, compatibilidade e etapa de uso.", icon: MicroscopeIcon },
  { title: "Seleção", text: "As categorias e referências pertinentes formam uma lista técnica objetiva.", icon: BoxIcon },
  { title: "Cotação", text: "Produtos, quantidades e observações seguem reunidos para o atendimento comercial.", icon: SupportIcon },
] as const;

const solutionFamilies = [
  {
    code: "SOL.01",
    title: "Rotina pré-analítica",
    text: "Frentes para coleta, transferência, identificação, acondicionamento e organização de amostras.",
    icon: TubesIcon,
    categories: [
      categoryFor("coleta-e-acondicionamento"),
      categoryFor("vidrarias-e-plasticos"),
      categoryFor("armazenamento-e-organizacao"),
    ],
  },
  {
    code: "SOL.02",
    title: "Rotina analítica",
    text: "Categorias relacionadas a metodologias, controles, investigação e apoio ao diagnóstico.",
    icon: FlaskIcon,
    categories: [
      categoryFor("reagentes-e-kits"),
      categoryFor("diagnostico-in-vitro"),
      categoryFor("microbiologia"),
      categoryFor("hematologia-e-bioquimica"),
    ],
  },
  {
    code: "SOL.03",
    title: "Processamento e observação",
    text: "Equipamentos e recursos para preparo, separação, medição, observação e documentação.",
    icon: MicroscopeIcon,
    categories: [
      categoryFor("equipamentos-laboratoriais"),
      categoryFor("microscopia-e-imagem"),
    ],
  },
  {
    code: "SOL.04",
    title: "Apoio assistencial e proteção",
    text: "Materiais para serviços de saúde, biossegurança, descarte e apoio a ambientes controlados.",
    icon: ShieldIcon,
    categories: [
      categoryFor("biosseguranca-e-hospitalares"),
      categoryFor("materiais-hospitalares"),
    ],
  },
] as const;

const operationContexts = [
  { code: "OP.01", title: "Laboratórios humanos", text: "Rotinas pré-analíticas, analíticas, processamento e apoio.", href: "/catalogo?q=diagnóstico" },
  { code: "OP.02", title: "Diagnóstico veterinário", text: "Consulta B2B para laboratórios, clínicas e hospitais veterinários.", href: "/veterinario" },
  { code: "OP.03", title: "Hospitais e clínicas", text: "Materiais hospitalares e categorias de apoio a serviços de saúde.", href: "/catalogo/materiais-hospitalares" },
  { code: "OP.04", title: "Centros de pesquisa", text: "Itens para preparo, observação, processamento e organização.", href: "/catalogo?q=pesquisa" },
] as const;

export default function SolutionsPage() {
  return (
    <div className={styles.page} data-technical-page>
      <section className={styles.hero} aria-labelledby="solutions-title" data-technical-surface="hero">
        <TechnicalMotion />
        <div className={styles.heroGrid} data-technical-grid aria-hidden="true" />
        <div className={styles.heroSignal} data-technical-signal aria-hidden="true" />
        <div className={`shell ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Navegação estrutural" data-technical-enter="0">
            <Link href="/">Início</Link><span aria-hidden="true">/</span><span>Soluções</span>
          </nav>
          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker} data-technical-enter="1"><span aria-hidden="true" /> Ecossistema de soluções</p>
              <h1 id="solutions-title" data-technical-enter="2">Do contexto técnico à escolha mais clara.</h1>
              <p data-technical-enter="3">Organizamos as frentes do portfólio por etapa da rotina e tipo de operação para tornar a consulta institucional mais objetiva.</p>
              <div className={styles.heroActions} data-technical-enter="4">
                <Link href="#frentes" className="button button-light">Conhecer as frentes <ArrowIcon className="size-4" /></Link>
                <Link href="/orcamento" className="button button-dark-outline">Solicitar orçamento</Link>
              </div>
            </div>
            <aside className={styles.heroPanel} aria-label="Resumo da estrutura de soluções" data-technical-enter="5">
              <p className={styles.panelLabel}>Mapa técnico / Labtech</p>
              <div className={styles.panelMetrics}>
                <div><strong><TechnicalCounter value={categories.length} /></strong><span>categorias organizadas</span></div>
                <div><strong><TechnicalCounter value={solutionFamilies.length} /></strong><span>frentes de solução</span></div>
                <div><strong><TechnicalCounter value={operationContexts.length} /></strong><span>contextos de operação</span></div>
              </div>
              <p className={styles.panelNote}>Configuração, disponibilidade e regularização aplicável são confirmadas individualmente por produto.</p>
            </aside>
          </div>
          <ol className={styles.heroRail} aria-label="Fluxo resumido da consulta" data-technical-flow="journey" data-technical-enter="6">
            {journey.map((item, index) => <li key={item.title}><span>0{index + 1}</span>{item.title}</li>)}
          </ol>
        </div>
      </section>

      <section className={`shell ${styles.journey}`} aria-labelledby="journey-title">
        <div className={styles.sectionLead}>
          <div><p className="eyebrow">Uma consulta, quatro movimentos</p><h2 id="journey-title">Clareza antes da especificação.</h2></div>
          <p>A página de soluções não duplica o catálogo: ela ajuda a identificar o caminho. O detalhamento final permanece vinculado à finalidade indicada pelo fabricante e aos requisitos reais da instituição.</p>
        </div>
        <ol className={styles.journeyGrid}>
          {journey.map(({ title, text, icon: Icon }, index) => (
            <li key={title} data-motion-reveal="true">
              <div className={styles.journeyTop}><span>0{index + 1}</span><Icon aria-hidden="true" /></div>
              <h3>{title}</h3><p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="frentes" className={styles.families} aria-labelledby="families-title">
        <div className="shell">
          <div className={styles.sectionLead}>
            <div><p className="eyebrow">Frentes de solução</p><h2 id="families-title">O portfólio visto pela lógica da rotina.</h2></div>
            <p>Cada categoria aparece em uma única frente, eliminando sobreposição e deixando a navegação mais previsível.</p>
          </div>
          <div className={styles.familyGrid}>
            {solutionFamilies.map(({ code, title, text, icon: Icon, categories: familyCategories }) => (
              <article key={code} className={styles.familyCard}>
                <div className={styles.familyHeader}><span>{code}</span><span className={styles.familyIcon}><Icon aria-hidden="true" /></span></div>
                <h3>{title}</h3><p>{text}</p>
                <ul>
                  {familyCategories.map((category) => (
                    <li key={category.slug}>
                      <Link href={`/catalogo/${category.slug}`}>
                        <span className={styles.categoryIcon}><CategoryIcon slug={category.slug} /></span>
                        <span><strong>{category.name}</strong><small>{category.description}</small></span>
                        <ArrowIcon className={styles.arrow} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`shell ${styles.contexts}`} aria-labelledby="contexts-title">
        <div className={styles.sectionLead}>
          <div><p className="eyebrow">Contextos atendidos</p><h2 id="contexts-title">Uma entrada adequada para cada operação.</h2></div>
          <p>A mesma categoria pode cumprir papéis diferentes. O ponto de partida é o ambiente em que ela será utilizada.</p>
        </div>
        <div className={styles.contextGrid}>
          {operationContexts.map(({ code, title, text, href }) => (
            <Link key={code} href={href} className={styles.contextCard} data-motion-reveal="true">
              <span>{code}</span><h3>{title}</h3><p>{text}</p><strong>Explorar contexto <ArrowIcon /></strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-title">
        <div className={`shell ${styles.closingInner}`}>
          <div className={styles.closingCode} aria-hidden="true"><span>LT</span><i /></div>
          <div><p className={styles.kicker}><span aria-hidden="true" /> Próximo passo</p><h2 id="closing-title">Transforme sua necessidade em uma consulta organizada.</h2><p>Reúna produtos, quantidades e observações ou compartilhe o contexto diretamente com a equipe Labtech.</p></div>
          <div className={styles.closingActions}><Link href="/orcamento" className="button button-light">Montar cotação <ArrowIcon className="size-4" /></Link><Link href="/contato" className="button button-dark-outline">Falar com a equipe</Link></div>
        </div>
      </section>
    </div>
  );
}
