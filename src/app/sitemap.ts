import type { MetadataRoute } from "next";
import { getBlogPosts, getProjects } from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    getProjects({ onlyPublished: true }).catch(() => []),
    getBlogPosts({ onlyPublished: true }).catch(() => []),
  ]);

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.6 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
