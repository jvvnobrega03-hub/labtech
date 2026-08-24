import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AuroraNavigationShell } from "@/components/aurora-navigation";
import { QuoteDrawer } from "@/components/quote-drawer";
import { QuoteProvider } from "@/components/quote-context";
import { MotionSystem } from "@/components/motion-system";
import { Footer, Header } from "@/components/site-shell";
import { absoluteSiteUrl, companyConfig, publicSiteUrl, siteConfig } from "@/lib/config";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const socialImageUrl = absoluteSiteUrl("/og.jpg");

export const metadata: Metadata = {
  ...(publicSiteUrl ? { metadataBase: new URL(publicSiteUrl) } : {}),
  applicationName: siteConfig.name,
  title: { default: "Labtech | Produtos laboratoriais e hospitalares", template: "%s | Labtech" },
  ...(publicSiteUrl ? { alternates: { canonical: publicSiteUrl } } : {}),
  description: siteConfig.description,
  keywords: ["produtos laboratoriais", "materiais hospitalares", "equipamentos laboratoriais", "reagentes", "orçamento B2B"],
  openGraph: {
    title: "Labtech",
    description: siteConfig.description,
    type: "website",
    locale: "pt_BR",
    siteName: "Labtech",
    ...(socialImageUrl ? { images: [{ url: socialImageUrl, width: 1731, height: 909, alt: "Labtech — Tecnologia e confiança para quem cuida de vidas." }] } : {}),
  },
  twitter: {
    card: socialImageUrl ? "summary_large_image" : "summary",
    title: "Labtech",
    description: siteConfig.description,
    ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
  },
  robots: publicSiteUrl
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: companyConfig.name,
  legalName: companyConfig.legalName,
  ...(publicSiteUrl ? { url: publicSiteUrl } : {}),
  description: siteConfig.description,
  email: companyConfig.email,
  telephone: companyConfig.phone.e164,
  taxID: companyConfig.cnpj,
  foundingDate: String(companyConfig.foundedYear),
  ...(companyConfig.address ? {
    address: {
      "@type": "PostalAddress",
      streetAddress: companyConfig.address.street,
      addressLocality: companyConfig.address.city,
      addressRegion: companyConfig.address.region,
      postalCode: companyConfig.address.postalCode,
      addressCountry: companyConfig.address.country,
    },
  } : {}),
  ...(companyConfig.socialLinks.length ? { sameAs: companyConfig.socialLinks.map((link) => link.href) } : {}),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: companyConfig.name,
  ...(publicSiteUrl ? { url: publicSiteUrl } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={manrope.variable} data-scroll-behavior="smooth">
      <body>
        <QuoteProvider>
          <AuroraNavigationShell>
            <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
            <Header />
            <main id="conteudo" className="min-h-[60vh]">{children}</main>
            <Footer />
            <QuoteDrawer />
            <MotionSystem />
          </AuroraNavigationShell>
        </QuoteProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, websiteJsonLd]).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
