import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bcra-api.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/deudores", "/transparencia", "/monetarias", "/cambiarias"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "hourly",
    priority: route === "" ? 1 : 0.8,
  }));
}
