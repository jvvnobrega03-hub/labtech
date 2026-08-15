function getVerifiedPublicUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    if (url.protocol !== "https:" || isLocal || url.username || url.password) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export const publicSiteUrl = getVerifiedPublicUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteSiteUrl(path: string): string | undefined {
  return publicSiteUrl ? new URL(path, `${publicSiteUrl}/`).toString() : undefined;
}

export const siteConfig = {
  name: "Labtech",
  legalName: "Labtech Produtos para Laboratórios e Hospitais",
  description: "Produtos e soluções B2B para laboratórios, hospitais, clínicas e centros de pesquisa, com atuação desde 1997.",
  url: publicSiteUrl,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "site@labtech.com.br",
  phoneDisplay: "(11) 2941-5400",
  phoneHref: "tel:+551129415400",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/551129415400",
  taxId: "02.419.460/0001-84",
  foundedYear: 1997,
  navigation: [
    { label: "Início", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Quem somos", href: "/quem-somos" },
    { label: "Nossa essência", href: "/missao-visao-valores" },
    { label: "Conteúdo", href: "/conteudo" },
    { label: "Contato", href: "/contato" },
  ],
} as const;

export const companyStats: ReadonlyArray<{ value: string; label: string }> = [
  { value: "Desde 1997", label: "Atuação em produtos laboratoriais e hospitalares" },
];
