import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getCategory } from "@/data/products";
import { ArrowIcon } from "@/components/icons";
import { AddToQuote } from "@/components/add-to-quote";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  return (
    <article className="product-card group">
      <Link href={`/produtos/${product.slug}`} className="product-visual" aria-label={`Ver ${product.name}`}>
        <Image src={product.image} alt={`Representação editorial de ${product.name}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">{category?.name}</p>
        <h3 className="mt-2 text-xl font-semibold text-ink"><Link href={`/produtos/${product.slug}`}>{product.name}</Link></h3>
        {(product.sku || product.brand) && <p className="mt-2 text-xs text-slate-500">{[product.sku && `Código ${product.sku}`, product.brand].filter(Boolean).join(" · ")}</p>}
        <p className="mt-4 min-h-14 text-sm leading-6 text-slate-600">{product.summary}</p>
        {product.availability && <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-slate-600"><span className="size-2 rounded-full bg-sky-500" aria-hidden="true" />{product.availability}</p>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Link href={`/produtos/${product.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-teal-700">Ver produto <ArrowIcon className="size-4" /></Link>
          <AddToQuote slug={product.slug} compact />
        </div>
      </div>
    </article>
  );
}
