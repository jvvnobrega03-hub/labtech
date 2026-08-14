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
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">{category?.name}</p><h3 className="mt-2 text-xl font-semibold text-ink"><Link href={`/produtos/${product.slug}`}>{product.name}</Link></h3></div>
          <AddToQuote slug={product.slug} compact />
        </div>
        <p className="mt-4 min-h-14 text-sm leading-6 text-slate-600">{product.summary}</p>
        <Link href={`/produtos/${product.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-teal-700">Explorar item <ArrowIcon className="size-4" /></Link>
      </div>
    </article>
  );
}
