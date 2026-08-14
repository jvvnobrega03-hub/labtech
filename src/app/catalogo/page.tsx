import { Suspense } from "react";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { PageHero } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Catálogo", "Explore categorias e itens iniciais para diagnóstico e rotinas laboratoriais.", "/catalogo");
export default function CatalogPage() { return <><PageHero eyebrow="Catálogo" title="Soluções para diagnóstico e rotinas laboratoriais." description="Pesquise por categoria, item ou aplicação e reúna as referências necessárias para solicitar um orçamento." /><section className="shell py-16"><div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">Catálogo demonstrativo: categorias e itens são dados iniciais editáveis. Marcas, especificações, certificações, preços e disponibilidade não são presumidos.</div><Suspense fallback={<p>Carregando catálogo...</p>}><CatalogExplorer /></Suspense></section></>; }
