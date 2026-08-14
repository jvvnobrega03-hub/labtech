import Link from "next/link";
import { HeaderActions } from "@/components/header-actions";
import { siteConfig } from "@/lib/config";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Labtech — início">
      <span className="brand-mark" aria-hidden="true"><span /></span>
      <span className="text-xl font-bold tracking-[-.04em] text-white">LAB<span className="text-emerald-300">TECH</span></span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur-xl">
      <div className="shell flex h-20 items-center justify-between">
        <Brand />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-emerald-50/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <HeaderActions mobileBrand={<Brand />} />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-emerald-50/65">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><Brand /><p className="mt-5 max-w-sm text-sm leading-6">Soluções B2B para diagnóstico e rotinas laboratoriais. Atuação desde 1997.</p></div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Navegação</h2>
          <div className="mt-5 grid gap-3">{siteConfig.navigation.slice(0, 5).map((item) => <Link className="text-sm hover:text-white" key={item.href} href={item.href}>{item.label}</Link>)}</div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Informações</h2>
          <div className="mt-5 grid gap-3"><Link className="text-sm hover:text-white" href="/contato">Fale conosco</Link><Link className="text-sm hover:text-white" href="/politica-de-privacidade">Política de privacidade</Link><Link className="text-sm hover:text-white" href="/orcamento">Solicitar orçamento</Link></div>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="shell flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Labtech.</p><p>Precisão científica · Clareza em cada etapa</p></div></div>
    </footer>
  );
}
