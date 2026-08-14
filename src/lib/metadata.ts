import type { Metadata } from "next";
import { absoluteSiteUrl, publicSiteUrl, siteConfig } from "@/lib/config";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteSiteUrl(path);
  const socialImageUrl = absoluteSiteUrl("/og.png");
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      ...(url ? { url } : {}),
      locale: "pt_BR",
      siteName: siteConfig.name,
      type: "website",
      ...(socialImageUrl ? { images: [{ url: socialImageUrl, width: 1731, height: 909, alt: "Labtech — Tecnologia e confiança para quem cuida de vidas." }] } : {}),
    },
    twitter: {
      card: socialImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
    },
    robots: publicSiteUrl
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true },
  };
}
