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
  legalName: "Labtech",
  description: "Soluções B2B para diagnóstico e rotinas laboratoriais, com atuação desde 1997.",
  url: publicSiteUrl,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || undefined,
  foundedYear: 1997,
  navigation: [
    { label: "Início", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Quem somos", href: "/quem-somos" },
    { label: "Princípios", href: "/missao-visao-valores" },
    { label: "Conteúdo", href: "/conteudo" },
    { label: "Contato", href: "/contato" },
  ],
} as const;

export const companyStats: ReadonlyArray<{ value: string; label: string }> = [
  { value: "Desde 1997", label: "Atuação no mercado de diagnóstico" },
];
