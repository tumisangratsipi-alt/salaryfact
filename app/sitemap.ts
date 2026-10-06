import type { MetadataRoute } from "next";
import { STATE_NAMES, JOB_CATEGORY_KEYS } from "@/lib/salary-data";
import { CITY_SLUGS } from "@/lib/city-data";
import dataSources from "@/data-sources.json";

// Pages change when their data does. data-sources.json records when each
// dataset was last verified, so the newest of those dates is an honest
// lastModified (a new Date() here told Google every page changed daily).
const CONTENT_UPDATED = new Date(
  dataSources.entries
    .map((entry) => entry.last_verified?.date)
    .filter((date): date is string => Boolean(date))
    .sort()
    .pop() ?? "2026-09-01"
);


export default function sitemap(): MetadataRoute.Sitemap {
  const statePages: MetadataRoute.Sitemap = Object.keys(STATE_NAMES).map((code) => ({
    url: `https://salaryfact.com/state/${code.toLowerCase()}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const cityPages: MetadataRoute.Sitemap = CITY_SLUGS.map((slug) => ({
    url: `https://salaryfact.com/city/${slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = JOB_CATEGORY_KEYS.map((key) => ({
    url: `https://salaryfact.com/category/${key}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://salaryfact.com",
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://salaryfact.com/methodology",
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...statePages,
    ...cityPages,
    ...categoryPages,
  ];
}
