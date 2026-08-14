import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  if (!publicSiteUrl) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${publicSiteUrl}/sitemap.xml`,
    host: publicSiteUrl,
  };
}
