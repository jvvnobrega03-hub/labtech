import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Breadcrumbs, PageHero } from "@/components/ui";
import { categories, getCategory, products } from "@/data/products";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return categories.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const category = getCategory((await params).categoria);
  return category
    ? pageMetadata(`${category.name} para laboratórios`, category.description, `/catalogo/${category.slug}`)
    : { title: "Categoria não encontrada" };
}

export default async function CategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const category = getCategory((await params).categoria);
  if (!category) notFound();
  const categoryProducts = products.filter((product) => product.category === category.slug);

  return (
    <>
      <PageHero eyebrow="Categoria" title={category.name} description={category.description} />
      <section className="shell py-16">
        <Breadcrumbs items={[{ label: "Catálogo", href: "/catalogo" }, { label: category.name }]} />
        <p className="mt-8 text-sm text-slate-500"><strong className="text-ink">{categoryProducts.length}</strong> {categoryProducts.length === 1 ? "linha disponível para consulta" : "linhas disponíveis para consulta"}</p>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{categoryProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
    </>
  );
}
