import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { publicSiteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicSiteUrl) return [];

  const pages = ["", "/catalogo", "/orcamento", "/quem-somos", "/missao-visao-valores", "/conteudo", "/contato", "/politica-de-privacidade"];
  return [...pages.map((path) => ({ url: `${publicSiteUrl}${path}`, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })), ...products.map((product) => ({ url: `${publicSiteUrl}/produtos/${product.slug}`, changeFrequency: "monthly" as const, priority: .6 }))];
}
