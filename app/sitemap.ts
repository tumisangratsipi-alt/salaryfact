import type { MetadataRoute } from "next";
import { STATE_NAMES } from "@/lib/salary-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const statePages: MetadataRoute.Sitemap = Object.keys(STATE_NAMES).map((code) => ({
    url: `https://salaryfact.com/state/${code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://salaryfact.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://salaryfact.com/methodology",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...statePages,
  ];
}
