export type CompanyConfig = {
  name: string;
  legalName: string;
  cnpj: string;
  foundedYear: number;
  phone: { display: string; e164: string; href: string };
  whatsapp: { display: string; e164: string; baseUrl: string };
  email: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: "BR";
  };
  businessHours?: string;
  socialLinks: ReadonlyArray<{ label: string; href: string }>;
};

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

function getWhatsAppBaseUrl(value: string | undefined, fallbackNumber: string): string {
  if (!value) return `https://wa.me/${fallbackNumber.replace(/\D/g, "")}`;

  try {
    const url = new URL(value);
    if (url.protocol === "https:" && ["wa.me", "api.whatsapp.com"].includes(url.hostname)) {
      return url.toString();
    }
  } catch {
    // Um valor de ambiente inválido não deve quebrar os canais públicos.
  }

  return `https://wa.me/${fallbackNumber.replace(/\D/g, "")}`;
}

export const publicSiteUrl = getVerifiedPublicUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteSiteUrl(path: string): string | undefined {
  return publicSiteUrl ? new URL(path, `${publicSiteUrl}/`).toString() : undefined;
}

const verifiedPhone = "+551129415400";

export const companyConfig: CompanyConfig = {
  name: "Labtech",
  legalName: "Labtech Produtos para Laboratórios e Hospitais",
  cnpj: "02.419.460/0001-84",
  foundedYear: 1997,
  phone: {
    display: "(11) 2941-5400",
    e164: verifiedPhone,
    href: `tel:${verifiedPhone}`,
  },
  whatsapp: {
    display: "(11) 2941-5400",
    e164: verifiedPhone,
    baseUrl: getWhatsAppBaseUrl(process.env.NEXT_PUBLIC_WHATSAPP_URL, verifiedPhone),
  },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "site@labtech.com.br",
  // TODO(administrativo): preencher endereço e horário somente após validação oficial.
  socialLinks: [],
};

export function yearsSinceFounded(referenceDate = new Date()): number {
  return Math.max(0, referenceDate.getFullYear() - companyConfig.foundedYear);
}

export function companyExperienceLabel(): string {
  return `Desde ${companyConfig.foundedYear}`;
}

export function createWhatsAppUrl(message?: string): string {
  const url = new URL(companyConfig.whatsapp.baseUrl);
  if (message?.trim()) url.searchParams.set("text", message.trim());
  return url.toString();
}

export const primaryNavigation = [
  { label: "Início", href: "/" },
  { label: "Quem somos", href: "/quem-somos" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Veterinário", href: "/veterinario" },
  { label: "Orçamento", href: "/orcamento" },
  { label: "Contato", href: "/contato" },
] as const;

export const siteConfig = {
  ...companyConfig,
  description: "Produtos e soluções B2B para laboratórios, hospitais, clínicas e centros de pesquisa, com atuação desde 1997.",
  url: publicSiteUrl,
  phoneDisplay: companyConfig.phone.display,
  phoneHref: companyConfig.phone.href,
  whatsapp: companyConfig.whatsapp.baseUrl,
  taxId: companyConfig.cnpj,
  navigation: [
    ...primaryNavigation,
    { label: "Nossa essência", href: "/missao-visao-valores" },
    { label: "Conteúdo", href: "/conteudo" },
  ],
} as const;

export const companyStats: ReadonlyArray<{ value: string; label: string }> = [
  { value: companyExperienceLabel(), label: "Atuação em produtos laboratoriais e hospitalares" },
];
