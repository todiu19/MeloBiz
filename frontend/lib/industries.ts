import {
  getIndustry as getFallbackIndustry,
  industries as fallbackIndustries,
  type Industry,
} from "../data/industries";

type ApiPlaylist = {
  name: string;
  mood: string;
  trackCount: number;
};

type ApiScheduleItem = {
  time: string;
  label: string;
  sound: string;
};

type ApiIndustry = {
  slug: string;
  name: string;
  sortOrder: number;
  featured: boolean;
  hasDetail: boolean;
  headline: string;
  excerpt: string;
  description?: string;
  mood: string;
  accent: string;
  genres: string[];
  playlists?: ApiPlaylist[];
  schedule?: ApiScheduleItem[];
  benefits?: string[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function apiBaseUrl() {
  const configured = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, "");
  return process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api/v1"
    : null;
}

function mergeApiIndustry(apiIndustry: ApiIndustry): Industry {
  const fallback = getFallbackIndustry(apiIndustry.slug);

  return {
    slug: apiIndustry.slug,
    number: String(apiIndustry.sortOrder).padStart(2, "0"),
    name: apiIndustry.name,
    featured: apiIndustry.featured,
    hasDetail: apiIndustry.hasDetail,
    title: apiIndustry.headline,
    short: apiIndustry.excerpt,
    description:
      apiIndustry.description ??
      fallback?.description ??
      apiIndustry.excerpt,
    mood: apiIndustry.mood,
    genres:
      apiIndustry.genres.length > 0
        ? apiIndustry.genres
        : fallback?.genres ?? [],
    accent: apiIndustry.accent,
    playlists:
      apiIndustry.playlists && apiIndustry.playlists.length > 0
        ? apiIndustry.playlists.map((playlist) => ({
            name: playlist.name,
            mood: playlist.mood,
            tracks: playlist.trackCount,
          }))
        : fallback?.playlists ?? [],
    schedule:
      apiIndustry.schedule && apiIndustry.schedule.length > 0
        ? apiIndustry.schedule.map((item) => ({
            time: item.time,
            label: item.label,
            sound: item.sound,
          }))
        : fallback?.schedule ?? [],
    benefits:
      apiIndustry.benefits && apiIndustry.benefits.length > 0
        ? apiIndustry.benefits
        : fallback?.benefits ?? [],
  };
}

async function fetchApi<T>(path: string): Promise<T | null> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return null;

    const result = (await response.json()) as ApiResponse<T>;
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function listIndustries(): Promise<Industry[]> {
  const apiIndustries = await fetchApi<ApiIndustry[]>("/industries?limit=100");
  if (!apiIndustries) return fallbackIndustries;

  return apiIndustries
    .map(mergeApiIndustry)
    .sort((a, b) => Number(a.number) - Number(b.number));
}

export async function findIndustry(slug: string): Promise<Industry | undefined> {
  const apiIndustry = await fetchApi<ApiIndustry>(
    `/industries/${encodeURIComponent(slug)}`,
  );
  return apiIndustry
    ? mergeApiIndustry(apiIndustry)
    : getFallbackIndustry(slug);
}

export async function listRelatedIndustries(
  industry: Industry,
): Promise<Industry[]> {
  const related = await fetchApi<ApiIndustry[]>(
    `/industries/${encodeURIComponent(industry.slug)}/related?limit=3`,
  );

  if (related) return related.map(mergeApiIndustry);

  return fallbackIndustries
    .filter((item) => item.slug !== industry.slug)
    .slice(0, 3);
}
