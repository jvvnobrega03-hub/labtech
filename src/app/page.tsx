import Link from "next/link";
import {
  ArrowIcon,
  BagIcon,
  BoxIcon,
  CategoryIcon,
  CheckIcon,
  FlaskIcon,
  MicroscopeIcon,
  SearchIcon,
  ShieldIcon,
  SupportIcon,
  TruckIcon,
  TubesIcon,
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
  { title: companyExperienceLabel(), text: "Experiência no mercado diagnóstico", icon: ShieldIcon },
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

const segments = [
  { title: "Laboratórios humanos", text: "Produtos e soluções para rotinas pré-analíticas, analíticas e de apoio.", href: "/catalogo?q=diagnóstico", icon: TubesIcon },
  { title: "Laboratórios veterinários", text: "Atendimento técnico-comercial voltado ao diagnóstico animal.", href: "/veterinario", icon: FlaskIcon },
  { title: "Hospitais e clínicas", text: "Materiais e linhas de apoio para serviços de saúde e rotinas assistenciais.", href: "/catalogo/materiais-hospitalares", icon: ShieldIcon },
  { title: "Centros de pesquisa", text: "Soluções para preparo, observação, processamento e organização de amostras.", href: "/catalogo?q=pesquisa", icon: MicroscopeIcon },
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

      <section id="solucoes" className="home-segments shell scroll-mt-28 pb-20">
        <SectionHeading eyebrow="Segmentos atendidos" title="Soluções para cada tipo de operação" description="Uma navegação orientada ao contexto técnico de laboratórios, instituições de saúde e centros de pesquisa." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map(({ title, text, href, icon: Icon }) => (
            <article key={title} className="home-segment-card">
              <span className="home-segment-card__icon" aria-hidden="true"><Icon className="size-6" /></span>
              <h2 className="mt-6 text-xl font-bold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              <Link href={href} className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-teal-800">Ver soluções <ArrowIcon className="size-4" /></Link>
            </article>
          ))}
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

      <section className="home-guidance shell grid items-center gap-14 py-24 lg:grid-cols-[.92fr_1.08fr]">
        <div className="home-guidance__panel rounded-[2rem] bg-deep p-7 text-white sm:p-10">
          <p className="text-[.64rem] font-extrabold uppercase tracking-[.2em] text-emerald-200/80">Consulta organizada</p>
          <p className="mt-3 max-w-md text-2xl font-extrabold leading-tight tracking-[-.035em]">Da necessidade técnica ao orçamento, sem perder o contexto.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              [BoxIcon, "Produto e quantidade"],
              [SearchIcon, "Aplicação e contexto"],
              [ShieldIcon, "Documentação aplicável"],
              [SupportIcon, "Retorno consultivo"],
            ].map(([Icon, label], index) => {
              const ItemIcon = Icon as typeof BoxIcon;
              return <div key={label as string} className="home-guidance__item rounded-2xl border border-white/10 bg-white/[.04] p-5"><div className="flex items-center justify-between"><ItemIcon className="size-6 text-emerald-200" /><span aria-hidden="true">0{index + 1}</span></div><p className="mt-8 text-sm font-bold">{label as string}</p></div>;
            })}
          </div>
          <p className="mt-5 text-xs leading-5 text-emerald-50/55">Cada item permanece sujeito à confirmação de disponibilidade, configuração e condição comercial.</p>
        </div>
        <div>
          <SectionHeading eyebrow="Compra técnica, decisão segura" title="A informação certa vem antes do produto" description="Em produtos laboratoriais e hospitalares, a finalidade indicada pelo fabricante orienta a escolha. Por isso, organizamos a consulta sem transformar características técnicas em promessas genéricas." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Finalidade de uso e compatibilidade",
              "Apresentação, material e capacidade",
              "Regularização aplicável por produto",
              "Disponibilidade e condição comercial",
            ].map((item) => <li key={item} className="flex items-start gap-3 text-sm font-bold leading-6 text-slate-700"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-teal-800"><CheckIcon className="size-3" /></span>{item}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/orcamento" className="button button-primary">Montar orçamento</Link><Link href="/contato" className="button button-outline">Falar com a equipe</Link></div>
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

      <section className="home-support shell py-24">
        <div className="grid gap-8 rounded-[2rem] border border-sky-100 bg-white p-8 shadow-[0_20px_60px_rgba(2,83,111,.08)] md:grid-cols-[auto_1fr_auto] md:items-center md:p-12">
          <span className="grid size-14 place-items-center rounded-2xl bg-sky-50 text-sky-700" aria-hidden="true"><SupportIcon className="size-7" /></span>
          <div><p className="eyebrow">Atendimento técnico-comercial</p><h2 className="mt-3 text-2xl font-bold text-ink">Contexto técnico antes da definição do produto</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">A equipe organiza aplicação, compatibilidade, documentação e disponibilidade para orientar cada consulta institucional.</p></div>
          <Link href="/contato" className="button button-outline">Falar com a equipe</Link>
        </div>
      </section>

      <div id="contato" className="home-contact scroll-mt-28">
        <Callout title="Sua rotina precisa de uma solução mais precisa?" text="Explore as categorias ou organize uma solicitação para a equipe comercial da Labtech." href="/contato" label="Falar com especialista" />
      </div>
    </>
  );
}
