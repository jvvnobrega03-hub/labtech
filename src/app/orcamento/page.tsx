import { PageHero } from "@/components/ui";
import { QuoteFlow } from "@/components/quote-flow";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Solicitar orçamento", "Monte e revise uma solicitação de orçamento B2B para produtos laboratoriais e hospitalares.", "/orcamento");
export default function QuotePage() { return <><PageHero eyebrow="Orçamento" title="Conte o que sua instituição precisa." description="Revise produtos, quantidades, observações e dados de contato em quatro etapas." /><QuoteFlow /></>; }
