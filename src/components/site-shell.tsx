import Link from "next/link";
import { AdaptiveHeader } from "@/components/adaptive-header";
import { BrandLogo } from "@/components/brand-logo";
import { HeaderActions } from "@/components/header-actions";
import { MailIcon, PhoneIcon, SearchIcon } from "@/components/icons";
import { categories } from "@/data/products";
import { companyExperienceLabel, primaryNavigation, siteConfig } from "@/lib/config";

export function Brand({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const isFooterBrand = variant === "light";

  return (
    <Link href="/" className={`brand brand--${variant}`} aria-label="Labtech — início">
      <BrandLogo
        className="brand-logo"
        sizes={isFooterBrand
          ? "248px"
          : "(max-width: 500px) 184px, 196px"}
        preload={variant === "dark"}
      />
    </Link>
  );
}

export function Header() {
  return (
    <AdaptiveHeader>
      <div className="site-header__utility hidden bg-deep text-white sm:block">
        <div className="shell flex h-9 items-center justify-between text-[.68rem]">
          <p className="font-semibold text-emerald-50/75">{companyExperienceLabel()} oferecendo soluções para o mercado diagnóstico.</p>
          <div className="flex items-center gap-5 text-emerald-50/80">
            <a href={siteConfig.phoneHref} className="inline-flex items-center gap-1.5 transition hover:text-white"><PhoneIcon className="size-3.5" />{siteConfig.phoneDisplay}</a>
            <a href={`mailto:${siteConfig.email}`} className="hidden items-center gap-1.5 transition hover:text-white md:inline-flex"><MailIcon className="size-3.5" />{siteConfig.email}</a>
            <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className="font-bold text-emerald-200 transition hover:text-white">Atendimento comercial</a>
          </div>
        </div>
      </div>
      <div className="site-header__bar border-b border-white/10 bg-deep/95 backdrop-blur-xl">
        <div className="site-header__inner shell flex h-[88px] items-center gap-4">
          <Brand />
          <nav className="site-header__nav ml-auto hidden shrink-0 items-center gap-3 xl:flex" aria-label="Navegação principal">
            {primaryNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="site-header__nav-link whitespace-nowrap text-[.69rem] font-bold leading-none text-white/80 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/catalogo" className="site-header__search relative ml-auto hidden w-full max-w-[255px] lg:block xl:hidden" role="search">
            <label htmlFor="header-search" className="sr-only">Buscar no catálogo</label>
            <input id="header-search" name="q" type="search" className="site-header__search-input h-11 w-full rounded-xl border border-white/15 bg-white/[.06] pl-4 pr-11 text-xs text-white placeholder:text-white/45 focus:border-mint focus:bg-white/10 focus:outline-none" placeholder="Produto, categoria ou aplicação" />
            <button type="submit" className="site-header__search-button absolute right-1 top-1 grid size-9 place-items-center rounded-lg text-mint hover:bg-white/10" aria-label="Buscar"><SearchIcon className="size-4.5" /></button>
          </form>
          <HeaderActions />
        </div>
      </div>
    </AdaptiveHeader>
  );
}

export function Footer() {
  return (
    <footer className="bg-deep text-emerald-50/70">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div>
          <Brand variant="light" />
          <p className="mt-5 max-w-sm text-sm leading-6">Produtos e soluções B2B para laboratórios, hospitais, clínicas e centros de pesquisa.</p>
          <p className="mt-4 text-xs text-emerald-100/50">Atuação comercial {companyExperienceLabel().toLocaleLowerCase("pt-BR")}.</p>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[.2em] text-white">Categorias</h2>
          <div className="mt-5 grid gap-3">{categories.slice(0, 6).map((item) => <Link className="text-sm hover:text-white" key={item.slug} href={`/catalogo/${item.slug}`}>{item.shortName}</Link>)}</div>
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
