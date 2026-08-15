import { Suspense } from "react";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { PageHero } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Catálogo", "Explore produtos laboratoriais, hospitalares, equipamentos, reagentes, consumíveis e soluções para diagnóstico.", "/catalogo");
export default function CatalogPage() { return <><PageHero eyebrow="Catálogo" title="Produtos para laboratórios, hospitais e serviços de saúde." description="Pesquise por categoria, item ou aplicação e reúna as referências necessárias para solicitar um orçamento." /><section className="shell py-16"><div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong>Consulta técnica:</strong> marcas, configurações, especificações, regularização aplicável, preços e disponibilidade são confirmados individualmente no atendimento.</div><Suspense fallback={<p>Carregando catálogo...</p>}><CatalogExplorer /></Suspense></section></>; }
