import { MetadataRoute } from "next";
import { siteConfig } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/policies/privacy-policy",
    "/policies/terms-of-service",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
