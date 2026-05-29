import type { MetadataRoute } from "next";

const base = process.env.NEXTAUTH_URL ?? "https://cosmos-astrology.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sanctum", "/chart", "/reading", "/synastry", "/profile", "/api/", "/onboarding"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
