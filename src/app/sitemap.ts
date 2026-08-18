import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicSiteUrl) return [];

  const pages = ["", "/solucoes", "/veterinario", "/orcamento", "/quem-somos", "/missao-visao-valores", "/conteudo", "/contato", "/politica-de-privacidade"];
  return pages.map((path) => ({ url: `${publicSiteUrl}${path}`, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 }));
}
