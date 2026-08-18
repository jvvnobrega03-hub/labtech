import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductQuoteActions } from "@/components/product-quote-actions";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { AnalyticsLink } from "@/components/analytics-link";
import { ProductCard } from "@/components/product-card";
import { Breadcrumbs, Callout, Eyebrow } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { getCategory, getProduct, products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";
import { absoluteSiteUrl, createWhatsAppUrl } from "@/lib/config";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? pageMetadata(product.name, product.summary, `/produtos/${product.slug}`) : { title: "Item não encontrado" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 2);
  const technicalFields = [
    ...(product.specifications ?? []),
    ...(product.presentation ? [{ label: "Apresentação", value: product.presentation }] : []),
    ...(product.volumeOrCapacity ? [{ label: "Volume / capacidade", value: product.volumeOrCapacity }] : []),
    ...(product.packageQuantity ? [{ label: "Quantidade por embalagem", value: product.packageQuantity }] : []),
    ...(product.material ? [{ label: "Material", value: product.material }] : []),
    ...(product.registration ? [{ label: "Registro", value: product.registration }] : []),
    ...(product.certifications?.length ? [{ label: "Certificações", value: product.certifications.join(", ") }] : []),
  ];
  const productUrl = absoluteSiteUrl(`/produtos/${product.slug}`);
  const whatsappUrl = createWhatsAppUrl(`Olá, gostaria de informações sobre:\n\nProduto: ${product.name}${product.sku ? `\nCódigo: ${product.sku}` : ""}`);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    category: category?.name,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(productUrl ? { url: productUrl } : {}),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", ...(absoluteSiteUrl("/") ? { item: absoluteSiteUrl("/") } : {}) },
      { "@type": "ListItem", position: 2, name: "Catálogo", ...(absoluteSiteUrl("/catalogo") ? { item: absoluteSiteUrl("/catalogo") } : {}) },
      ...(category ? [{ "@type": "ListItem", position: 3, name: category.name, ...(absoluteSiteUrl(`/catalogo/${category.slug}`) ? { item: absoluteSiteUrl(`/catalogo/${category.slug}`) } : {}) }] : []),
      { "@type": "ListItem", position: category ? 4 : 3, name: product.name, ...(productUrl ? { item: productUrl } : {}) },
    ],
  };

  return (
    <>
      <ProductViewTracker productId={product.slug} category={product.category} />
      <section className="shell py-8"><Breadcrumbs items={[{ label: "Catálogo", href: "/catalogo" }, ...(category ? [{ label: category.name, href: `/catalogo/${category.slug}` }] : []), { label: product.name }]} /></section>
      <section className="shell grid gap-12 pb-20 lg:grid-cols-2">
        <div className="relative aspect-[1.15] overflow-hidden rounded-[2rem] bg-[#E9F9FC]">
          <Image src={product.image} alt={`Representação editorial de ${product.name}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <span className="catalog-badge">{product.availability ?? "Linha sob consulta"}</span>
        </div>
        <div className="self-center">
          <Eyebrow>{category?.name ?? "Catálogo"}</Eyebrow>
          <h1 className="display mt-5 text-5xl md:text-6xl">{product.name}</h1>
          {(product.sku || product.brand || product.manufacturer || product.subcategory) && <p className="mt-4 text-sm text-slate-500">{[product.sku && `Código ${product.sku}`, product.brand, product.manufacturer, product.subcategory].filter(Boolean).join(" · ")}</p>}
          <p className="mt-6 text-lg leading-8 text-slate-600">{product.summary}</p>
          <div className="mt-7 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900"><strong>Confirmação por item:</strong> marca, configuração, especificação, regularização aplicável, preço e disponibilidade dependem do produto selecionado.</div>
          <div className="mt-8 flex flex-wrap items-end gap-3"><ProductQuoteActions productId={product.slug} /><AnalyticsLink eventName="whatsapp_click" eventData={{ context: "product", product_id: product.slug }} href={whatsappUrl} target="_blank" rel="noreferrer" className="button button-outline">Falar pelo WhatsApp</AnalyticsLink></div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white">
        <div className="shell grid gap-12 py-16 md:grid-cols-2">
          <div>
            <h2 className="display text-3xl">Contexto da linha</h2>
            <p className="mt-5 leading-8 text-slate-600">{product.description}</p>
            {technicalFields.length > 0 && <dl className="mt-8 grid gap-3">{technicalFields.map((specification) => <div key={specification.label} className="flex justify-between gap-6 border-b border-slate-200 py-3"><dt className="font-semibold">{specification.label}</dt><dd className="text-right text-slate-600">{specification.value}</dd></div>)}</dl>}
          </div>
          <div>
            <h2 className="display text-3xl">Aplicações para consulta</h2>
            <ul className="mt-5 space-y-3">{product.applications.map((application) => <li className="flex items-center gap-3 text-slate-600" key={application}><span className="grid size-7 place-items-center rounded-full bg-teal-50 text-teal-700"><CheckIcon className="size-4" /></span>{application}</li>)}</ul>
            <p className="mt-5 text-xs leading-5 text-slate-400">A adequação final é determinada pela finalidade de uso, pela documentação do fabricante e pelo contexto informado.</p>
          </div>
        </div>
      </section>
      {product.documents && product.documents.length > 0 && <section className="shell py-16"><Eyebrow>Documentos</Eyebrow><h2 className="display mt-4 text-3xl">Materiais técnicos disponíveis</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{product.documents.map((document) => <li key={document.href}><a className="button button-outline w-full" href={document.href} target="_blank" rel="noreferrer">{document.label}</a></li>)}</ul></section>}
      {related.length > 0 && <section className="shell py-20"><Eyebrow>Na mesma categoria</Eyebrow><h2 className="display mt-4 text-4xl">Continue explorando</h2><div className="mt-8 grid gap-6 md:grid-cols-2">{related.map((item) => <ProductCard product={item} key={item.slug} />)}</div></section>}
      <Callout title="Precisa contextualizar sua aplicação?" text="Adicione este item à seleção e descreva sua necessidade no fluxo de orçamento." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]).replace(/</g, "\\u003c") }} />
    </>
  );
}
