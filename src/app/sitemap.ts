import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digiswasthya.org";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/donate", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/our-impact", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/network", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/our-team", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/media", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/health-tools", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/contact-us", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/partner", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/whatsapp-privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
