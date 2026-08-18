import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Labtech Produtos Laboratoriais",
    short_name: "Labtech",
    description: "Catálogo B2B de produtos e soluções laboratoriais e hospitalares.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#075d80",
    lang: "pt-BR",
  };
}
