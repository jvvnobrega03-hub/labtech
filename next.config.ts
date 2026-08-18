import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const hasSecurePublicUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ?? false;

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDevelopment ? " ws: wss:" : ""}`,
  ...(hasSecurePublicUrl ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(hasSecurePublicUrl
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: { qualities: [75, 84, 90] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/categoria-produto/:slug", destination: "/catalogo/:slug", permanent: true },
      { source: "/categoria-produto/:slug/", destination: "/catalogo/:slug", permanent: true },
      { source: "/produto/:slug", destination: "/produtos/:slug", permanent: true },
      { source: "/nossa-essencia", destination: "/missao-visao-valores", permanent: true },
    ];
  },
};

export default nextConfig;
