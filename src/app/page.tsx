import Link from "next/link";
import {
  ArrowIcon,
  BagIcon,
  BoxIcon,
  CategoryIcon,
  CheckIcon,
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

export const metadata = pageMetadata(
  "Produtos laboratoriais e hospitalares",
  "Desde 1997, a Labtech atende laboratórios, hospitais, clínicas e centros de pesquisa com produtos, soluções e atendimento especializado.",
  "/",
);

const trustPoints = [
  { title: "Desde 1997", text: "Experiência no mercado diagnóstico", icon: ShieldIcon },
  { title: "Atendimento nacional", text: "Consultas para instituições em todo o Brasil", icon: TruckIcon },
  { title: "Suporte especializado", text: "Orientação técnica e comercial", icon: SupportIcon },
  { title: "Orçamento organizado", text: "Vários itens em uma única solicitação", icon: BagIcon },
];

const stats = [
  { value: "1997", label: "início da nossa história" },
  { value: "10+", label: "frentes de produtos" },
  { value: "B2B", label: "atendimento institucional" },
  { value: "Brasil", label: "cobertura de atendimento" },
];

export default function Home() {
  const featured = products.filter((product) => product.featured);

  return (
    <>
      <CinematicCentrifugeHero />

      <section className="shell relative z-10 -mt-7" aria-label="Diferenciais de atendimento">
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(7,43,33,.12)] sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map(({ title, text, icon: Icon }) => (
            <article key={title} className="flex gap-3.5 border-b border-slate-200 p-5 last:border-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-teal-800"><Icon className="size-5" /></span>
              <div><h2 className="text-sm font-extrabold text-ink">{title}</h2><p className="mt-1 text-[.72rem] leading-5 text-slate-500">{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="produtos" className="shell scroll-mt-28 py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Encontre o que você precisa" title="Um catálogo organizado pela sua rotina" description="Pesquise diretamente ou comece pela categoria mais próxima da sua necessidade." />
          <form action="/catalogo" className="flex w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" role="search">
            <label htmlFor="home-search" className="sr-only">Buscar produtos no catálogo</label>
            <SearchIcon className="ml-4 size-5 shrink-0 self-center text-slate-400" />
            <input id="home-search" name="q" type="search" className="min-w-0 flex-1 px-3 py-3.5 text-sm outline-none placeholder:text-slate-400" placeholder="Busque produto, categoria ou aplicação" />
            <button type="submit" className="grid w-14 place-items-center bg-navy text-white transition hover:bg-deep" aria-label="Buscar no catálogo"><ArrowIcon className="size-5" /></button>
          </form>
        </div>
        <div className="mt-9 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.slice(0, 10).map((category) => (
            <Link href={`/catalogo?categoria=${category.slug}`} key={category.slug} className="category-tile group">
              <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-teal-800 transition group-hover:bg-navy group-hover:text-white"><CategoryIcon slug={category.slug} className="size-5.5" /></span>
              <span className="mt-4 text-center text-xs font-extrabold leading-4 text-slate-700 group-hover:text-teal-800">{category.shortName}</span>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex justify-center"><Link href="/catalogo" className="button button-outline">Ver todas as categorias <ArrowIcon className="size-4" /></Link></div>
      </section>

      <section className="bg-navy text-white">
        <div className="shell grid grid-cols-2 py-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="border-white/10 px-4 py-4 text-center even:border-l lg:border-l lg:first:border-l-0">
              <p className="text-2xl font-extrabold tracking-[-.04em] text-emerald-200 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[.68rem] font-semibold text-emerald-50/65 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist py-20">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Seleção inicial" title="Linhas em destaque" description="Pontos de partida para montar uma consulta com produtos, quantidades e observações." />
            <Link href="/catalogo" className="button button-outline bg-white">Catálogo completo <ArrowIcon className="size-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">{featured.map((product) => <ProductCard product={product} key={product.slug} />)}</div>
        </div>
      </section>

      <section className="shell grid items-center gap-14 py-24 lg:grid-cols-[.92fr_1.08fr]">
        <div className="rounded-[2rem] bg-deep p-7 text-white sm:p-10">
          <div className="grid grid-cols-2 gap-3">
            {[
              [BoxIcon, "Produto e quantidade"],
              [SearchIcon, "Aplicação e contexto"],
              [ShieldIcon, "Documentação aplicável"],
              [SupportIcon, "Retorno consultivo"],
            ].map(([Icon, label]) => {
              const ItemIcon = Icon as typeof BoxIcon;
              return <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><ItemIcon className="size-6 text-emerald-200" /><p className="mt-8 text-sm font-bold">{label as string}</p></div>;
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

      <div id="contato" className="scroll-mt-28">
        <Callout title="Sua rotina precisa de uma solução mais precisa?" text="Explore as categorias ou organize uma solicitação para a equipe comercial da Labtech." href="/contato" label="Falar com especialista" />
      </div>
    </>
  );
}
