import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-hero">
      <div className="shell relative z-10">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display mt-5 max-w-4xl text-5xl text-white md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: string; description?: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={`display mt-4 text-4xl md:text-5xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {description && <p className={`mt-5 text-lg leading-8 ${light ? "text-slate-300" : "text-slate-600"}`}>{description}</p>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Navegação estrutural" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="hover:text-teal-700">Início</Link>
      {items.map((item) => <span className="flex items-center gap-2" key={item.label}><span aria-hidden="true">/</span>{item.href ? <Link href={item.href} className="hover:text-teal-700">{item.label}</Link> : <span className="text-slate-700">{item.label}</span>}</span>)}
    </nav>
  );
}

export function Callout({ title, text, href = "/orcamento", label = "Iniciar orçamento" }: { title: string; text: string; href?: string; label?: string }) {
  return (
    <section className="shell py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-navy px-7 py-12 text-white md:px-14 md:py-16">
        <div className="orb right-0 top-0" />
        <div className="relative grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div><Eyebrow>Próximo passo</Eyebrow><h2 className="display mt-4 max-w-2xl text-4xl md:text-5xl">{title}</h2><p className="mt-5 max-w-xl leading-7 text-slate-300">{text}</p></div>
          <Link className="button button-light" href={href}>{label}<ArrowIcon className="size-5" /></Link>
        </div>
      </div>
    </section>
  );
}
