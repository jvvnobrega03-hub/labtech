"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { useModalDialog } from "@/components/use-modal-dialog";

function CategoryFilters({ category, setCategory, name }: { category: string; setCategory: (value: string) => void; name: string }) {
  return <fieldset><legend className="font-semibold text-ink">Categorias</legend><div className="mt-4 grid gap-2"><label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-emerald-50"><input type="radio" name={name} checked={category === "todos"} onChange={() => setCategory("todos")} className="accent-teal-700" />Todas as categorias</label>{categories.map((item) => <label key={item.slug} className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-emerald-50"><input type="radio" name={name} checked={category === item.slug} onChange={() => setCategory(item.slug)} className="accent-teal-700" />{item.name}</label>)}</div></fieldset>;
}

export function CatalogExplorer() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria");
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categories.some((item) => item.slug === initialCategory) ? initialCategory! : "todos");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const dialogRef = useModalDialog({ isOpen: filtersOpen, onClose: closeFilters, initialFocusRef: closeButton });
  useEffect(() => { const timer = window.setTimeout(() => setDebouncedQuery(query), 300); return () => window.clearTimeout(timer); }, [query]);
  const filtered = useMemo(() => { const normalized = debouncedQuery.trim().toLocaleLowerCase("pt-BR"); return products.filter((product) => (category === "todos" || product.category === category) && (!normalized || `${product.name} ${product.summary} ${product.applications.join(" ")}`.toLocaleLowerCase("pt-BR").includes(normalized))); }, [debouncedQuery, category]);
  const selectedCategory = categories.find((item) => item.slug === category);
  function clearFilters() { setQuery(""); setDebouncedQuery(""); setCategory("todos"); }
  return <div><div className="relative"><label htmlFor="catalog-search" className="sr-only">Buscar no catálogo</label><SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-12" placeholder="Buscar produto, categoria ou aplicação" /></div><div className="mt-5 flex flex-wrap items-center gap-2 lg:hidden"><button type="button" className="button button-outline" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-controls="filtros-catalogo">Filtrar categorias</button></div>{filtersOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" tabIndex={-1} className="absolute inset-0 bg-deep/75" onClick={closeFilters} aria-label="Fechar filtros" /><aside ref={dialogRef as React.RefObject<HTMLElement | null>} id="filtros-catalogo" className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6" role="dialog" aria-modal="true" aria-labelledby="filters-title" tabIndex={-1}><div className="mb-6 flex items-center justify-between"><h2 id="filters-title" className="text-xl font-semibold">Filtrar catálogo</h2><button ref={closeButton} type="button" className="icon-button" onClick={closeFilters} aria-label="Fechar"><CloseIcon className="size-5" /></button></div><CategoryFilters category={category} name="categoria-movel" setCategory={(value) => { setCategory(value); closeFilters(); }} /></aside></div>}<div className="mt-8 grid gap-8 lg:grid-cols-[270px_1fr]"><aside className="hidden max-h-[680px] self-start overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 lg:block"><CategoryFilters category={category} name="categoria-desktop" setCategory={setCategory} /></aside><div><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500" aria-live="polite" aria-atomic="true"><strong className="text-ink">{filtered.length}</strong> {filtered.length === 1 ? "item encontrado" : "itens encontrados"}</p>{(query || category !== "todos") && <button className="text-sm font-bold text-teal-700" type="button" onClick={clearFilters}>Limpar filtros</button>}</div>{(debouncedQuery || selectedCategory) && <div className="mt-4 flex flex-wrap gap-2">{debouncedQuery && <button type="button" className="filter filter-active" onClick={() => { setQuery(""); setDebouncedQuery(""); }} aria-label={`Remover busca ${debouncedQuery}`}>Busca: {debouncedQuery} ×</button>}{selectedCategory && <button type="button" className="filter filter-active" onClick={() => setCategory("todos")} aria-label={`Remover filtro ${selectedCategory.name}`}>{selectedCategory.name} ×</button>}</div>}{filtered.length ? <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <ProductCard product={product} key={product.slug} />)}</div> : <div className="mt-6 rounded-3xl border border-dashed border-slate-300 py-20 text-center"><SearchIcon className="mx-auto size-9 text-slate-300" /><h2 className="mt-4 text-xl font-semibold">Nenhum item encontrado</h2><p className="mt-2 text-slate-500">Tente outro termo ou remova os filtros aplicados.</p></div>}</div></div></div>;
}
