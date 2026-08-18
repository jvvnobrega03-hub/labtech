import Link from "next/link";
import {
  ArrowIcon,
  BagIcon,
  CategoryIcon,
  SearchIcon,
  ShieldIcon,
  SupportIcon,
  TruckIcon,
} from "@/components/icons";
import CinematicCentrifugeHero from "@/components/CinematicCentrifugeHero";
import { ProductCard } from "@/components/product-card";
import { Callout, SectionHeading } from "@/components/ui";
import { categories, products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import { companyConfig, companyExperienceLabel } from "@/lib/config";

export const metadata = pageMetadata(
  "Produtos laboratoriais e hospitalares | Labtech",
  `${companyExperienceLabel()}, a Labtech atende laboratórios, hospitais, clínicas e centros de pesquisa com produtos, soluções e atendimento especializado.`,
  "/",
);

const trustPoints = [
  { title: "Atendimento institucional", text: "Rotinas B2B do mercado diagnóstico", icon: ShieldIcon },
  { title: "Atendimento nacional", text: "Consultas para instituições em todo o Brasil", icon: TruckIcon },
  { title: "Suporte especializado", text: "Orientação técnica e comercial", icon: SupportIcon },
  { title: "Orçamento organizado", text: "Vários itens em uma única solicitação", icon: BagIcon },
];

const stats = [
  { eyebrow: "Experiência", value: String(companyConfig.foundedYear), label: "início da nossa história" },
  { eyebrow: "Portfólio", value: String(categories.length), label: "categorias organizadas" },
  { eyebrow: "Modelo", value: "B2B", label: "atendimento institucional" },
  { eyebrow: "Alcance", value: "Brasil", label: "cobertura de atendimento" },
];

export default function Home() {
  const featured = products.filter((product) => product.featured);

  return (
    <>
      <CinematicCentrifugeHero />

      <section className="home-trust shell relative z-10 -mt-7" aria-label="Diferenciais de atendimento">
        <div className="home-trust__grid grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(2,83,111,.12)] sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map(({ title, text, icon: Icon }) => (
            <article key={title} className="home-trust__item flex gap-3.5 border-b border-slate-200 p-5 last:border-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <span className="home-trust__icon grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-teal-800"><Icon className="size-5" /></span>
              <div><h2 className="text-sm font-extrabold text-ink">{title}</h2><p className="mt-1 text-[.72rem] leading-5 text-slate-500">{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="produtos" className="home-catalog shell scroll-mt-28 py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Encontre o que você precisa" title="Um catálogo organizado pela sua rotina" description="Pesquise diretamente ou comece pela categoria mais próxima da sua necessidade." />
          <form action="/catalogo" className="home-catalog__search flex w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" role="search">
            <label htmlFor="home-search" className="sr-only">Buscar produtos no catálogo</label>
            <SearchIcon className="ml-4 size-5 shrink-0 self-center text-slate-400" />
            <input id="home-search" name="q" type="search" className="min-w-0 flex-1 px-3 py-3.5 text-sm outline-none placeholder:text-slate-400" placeholder="Busque produto, categoria ou aplicação" />
            <button type="submit" className="grid w-14 place-items-center bg-navy text-white transition hover:bg-deep" aria-label="Buscar no catálogo"><ArrowIcon className="size-5" /></button>
          </form>
        </div>
        <div className="home-category-grid mt-9 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.slice(0, 10).map((category, index) => (
            <Link href={`/catalogo/${category.slug}`} key={category.slug} className="category-tile group">
              <span className="home-category-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-teal-800 transition group-hover:bg-navy group-hover:text-white"><CategoryIcon slug={category.slug} className="size-5.5" /></span>
              <span className="mt-4 text-center text-xs font-extrabold leading-4 text-slate-700 group-hover:text-teal-800">{category.shortName}</span>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex justify-center"><Link href="/catalogo" className="button button-outline">Ver todas as categorias <ArrowIcon className="size-4" /></Link></div>
      </section>

      <section className="home-solutions-entry shell pb-20" aria-labelledby="home-solutions-title">
        <div className="home-solutions-entry__panel tech-panel overflow-hidden">
          <div className="home-solutions-entry__copy">
            <p className="eyebrow">Soluções Labtech</p>
            <h2 id="home-solutions-title" className="display">Uma rota clara entre a necessidade e a escolha.</h2>
            <p>Conheça como o portfólio se conecta ao contexto da operação, à aplicação e à consulta comercial.</p>
            <Link href="/solucoes" className="button button-primary">Explorar soluções <ArrowIcon className="size-4" /></Link>
          </div>
          <ol className="home-solutions-entry__steps" aria-label="Etapas de uma consulta organizada">
            {["Contexto", "Aplicação", "Seleção", "Cotação"].map((step, index) => (
              <li key={step}><span aria-hidden="true">0{index + 1}</span><strong>{step}</strong></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-proof bg-navy text-white" aria-label="Indicadores institucionais">
        <div className="shell relative z-10 grid grid-cols-2 py-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="home-proof__item border-white/10 px-4 py-4 text-center even:border-l lg:border-l lg:first:border-l-0">
              <p className="home-proof__eyebrow">{stat.eyebrow}</p>
              <p className="text-2xl font-extrabold tracking-[-.04em] text-emerald-200 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[.68rem] font-semibold text-emerald-50/65 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-featured bg-mist py-20">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Seleção inicial" title="Linhas em destaque" description="Pontos de partida para montar uma consulta com produtos, quantidades e observações." />
            <Link href="/catalogo" className="button button-outline bg-white">Catálogo completo <ArrowIcon className="size-4" /></Link>
          </div>
          <div className="home-featured__grid mt-10 grid gap-6 md:grid-cols-3">{featured.map((product) => <ProductCard product={product} key={product.slug} />)}</div>
        </div>
      </section>

      <section className="home-veterinary border-y border-sky-100 bg-[#F4FAFC] py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <SectionHeading eyebrow="Diagnóstico veterinário" title="Tecnologia e cuidado para operações que atendem a saúde animal" description="Uma frente B2B dedicada a laboratórios, clínicas e hospitais veterinários, com organização por aplicação e atendimento especializado." />
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/veterinario" className="button button-primary">Conhecer a área veterinária</Link><Link href="/orcamento" className="button button-outline bg-white">Solicitar orçamento</Link></div>
          </div>
          <div className="home-veterinary__panel" aria-label="Áreas do diagnóstico veterinário">
            {["Laboratórios veterinários", "Clínicas veterinárias", "Hospitais veterinários", "Centros de diagnóstico animal"].map((item, index) => <div key={item}><span aria-hidden="true">0{index + 1}</span><strong>{item}</strong></div>)}
          </div>
        </div>
      </section>

      <div id="contato" className="home-contact scroll-mt-28">
        <Callout title="Sua rotina precisa de uma solução mais precisa?" text="Explore as categorias ou organize uma solicitação para a equipe comercial da Labtech." href="/contato" label="Falar com especialista" />
      </div>
    </>
  );
}
