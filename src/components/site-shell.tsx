import Link from "next/link";
import { HeaderActions } from "@/components/header-actions";
import { MailIcon, PhoneIcon, SearchIcon } from "@/components/icons";
import { categories } from "@/data/products";
import { siteConfig } from "@/lib/config";

export function Brand({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const light = variant === "light";

  return (
    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Labtech — início">
      <span className={`brand-monogram ${light ? "brand-monogram-light" : ""}`} aria-hidden="true">LT</span>
      <span className="leading-none">
        <span className={`block text-[1.05rem] font-extrabold tracking-[-.045em] ${light ? "text-white" : "text-ink"}`}>LABTECH</span>
        <span className={`mt-1 block text-[.48rem] font-bold uppercase tracking-[.2em] ${light ? "text-emerald-200" : "text-teal-700"}`}>Produtos laboratoriais</span>
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 shadow-[0_10px_30px_rgba(7,43,33,.08)]">
      <div className="hidden bg-deep text-white sm:block">
        <div className="shell flex h-9 items-center justify-between text-[.68rem]">
          <p className="font-semibold text-emerald-50/75">Desde 1997 oferecendo soluções para o mercado diagnóstico.</p>
          <div className="flex items-center gap-5 text-emerald-50/80">
            <a href={siteConfig.phoneHref} className="inline-flex items-center gap-1.5 transition hover:text-white"><PhoneIcon className="size-3.5" />{siteConfig.phoneDisplay}</a>
            <a href={`mailto:${siteConfig.email}`} className="hidden items-center gap-1.5 transition hover:text-white md:inline-flex"><MailIcon className="size-3.5" />{siteConfig.email}</a>
            <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className="font-bold text-emerald-200 transition hover:text-white">Atendimento comercial</a>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="shell flex h-[76px] items-center gap-6">
          <Brand />
          <nav className="ml-auto hidden items-center gap-5 xl:flex" aria-label="Navegação principal">
            {siteConfig.navigation.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href} className="text-[.78rem] font-bold text-slate-700 transition hover:text-teal-800">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/catalogo" className="relative ml-auto hidden w-full max-w-[285px] lg:block xl:ml-2" role="search">
            <label htmlFor="header-search" className="sr-only">Buscar no catálogo</label>
            <input id="header-search" name="q" type="search" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-11 text-xs text-ink placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:outline-none" placeholder="Produto, categoria ou aplicação" />
            <button type="submit" className="absolute right-1 top-1 grid size-9 place-items-center rounded-lg text-teal-800 hover:bg-emerald-50" aria-label="Buscar"><SearchIcon className="size-4.5" /></button>
          </form>
          <HeaderActions mobileBrand={<Brand variant="light" />} />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-deep text-emerald-50/70">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div>
          <Brand variant="light" />
          <p className="mt-5 max-w-sm text-sm leading-6">Produtos e soluções B2B para laboratórios, hospitais, clínicas e centros de pesquisa.</p>
          <p className="mt-4 text-xs text-emerald-100/50">Atuação comercial desde 1997.</p>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[.2em] text-white">Categorias</h2>
          <div className="mt-5 grid gap-3">{categories.slice(0, 6).map((item) => <Link className="text-sm hover:text-white" key={item.slug} href={`/catalogo?categoria=${item.slug}`}>{item.shortName}</Link>)}</div>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[.2em] text-white">Institucional</h2>
          <div className="mt-5 grid gap-3">{siteConfig.navigation.slice(1).map((item) => <Link className="text-sm hover:text-white" key={item.href} href={item.href}>{item.label}</Link>)}</div>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[.2em] text-white">Atendimento</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <a className="hover:text-white" href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
            <a className="break-all hover:text-white" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a className="hover:text-white" href={siteConfig.whatsapp} target="_blank" rel="noreferrer">WhatsApp comercial</a>
            <Link className="hover:text-white" href="/orcamento">Solicitar orçamento</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-2 py-6 text-[.7rem] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Labtech® — Produtos para laboratórios e hospitais.</p>
          <p>CNPJ {siteConfig.taxId} · <Link href="/politica-de-privacidade" className="hover:text-white">Privacidade</Link></p>
        </div>
      </div>
    </footer>
  );
}
