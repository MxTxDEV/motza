import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();
  const pages = ["", "/shop", "/colecao", "/sobre", "/lookbook", "/contato"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const items = products.map((p) => ({
    url: `${site.url}/produto/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...pages, ...items];
}
