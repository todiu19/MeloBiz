import { industries } from "../data/industries.js";
import type {
  Industry,
  IndustryGroup,
  IndustryListItem,
} from "../domain/industry.js";

export interface IndustryQuery {
  q?: string;
  group?: IndustryGroup;
  featured?: boolean;
  hasDetail?: boolean;
  limit: number;
  offset: number;
}

function toListItem(industry: Industry): IndustryListItem {
  return {
    id: industry.id,
    slug: industry.slug,
    name: industry.name,
    group: industry.group,
    sortOrder: industry.sortOrder,
    featured: industry.featured,
    hasDetail: industry.hasDetail,
    headline: industry.headline,
    excerpt: industry.excerpt,
    mood: industry.mood,
    accent: industry.accent,
    coverImage: industry.coverImage,
    genres: industry.genres,
  };
}

export function listIndustries(query: IndustryQuery) {
  const normalizedSearch = query.q?.trim().toLocaleLowerCase("vi");
  const filtered = industries
    .filter((industry) => industry.active)
    .filter((industry) => !query.group || industry.group === query.group)
    .filter(
      (industry) =>
        query.featured === undefined || industry.featured === query.featured,
    )
    .filter(
      (industry) =>
        query.hasDetail === undefined || industry.hasDetail === query.hasDetail,
    )
    .filter((industry) => {
      if (!normalizedSearch) return true;
      const searchable = [
        industry.name,
        industry.headline,
        industry.excerpt,
        ...industry.genres,
        ...industry.seo.keywords,
      ]
        .join(" ")
        .toLocaleLowerCase("vi");
      return searchable.includes(normalizedSearch);
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    items: filtered
      .slice(query.offset, query.offset + query.limit)
      .map(toListItem),
    total: filtered.length,
  };
}

export function findIndustryBySlug(slug: string) {
  return industries.find(
    (industry) => industry.active && industry.slug === slug.toLowerCase(),
  );
}

export function listIndustryGroups() {
  const counts = new Map<IndustryGroup, number>();
  for (const industry of industries) {
    if (!industry.active) continue;
    counts.set(industry.group, (counts.get(industry.group) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function listRelatedIndustries(industry: Industry, limit: number) {
  const sameGroup = industries
    .filter(
      (candidate) =>
        candidate.active &&
        candidate.id !== industry.id &&
        candidate.group === industry.group,
    )
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder,
    );

  const sameGroupIds = new Set(sameGroup.map((candidate) => candidate.id));
  const fallback = industries
    .filter(
      (candidate) =>
        candidate.active &&
        candidate.id !== industry.id &&
        !sameGroupIds.has(candidate.id),
    )
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder,
    );

  return [...sameGroup, ...fallback].slice(0, limit).map(toListItem);
}
