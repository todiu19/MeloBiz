import { query } from "../config/database.js";
import type {
  Industry,
  IndustryGroup,
  IndustryListItem,
  IndustryPlaylist,
} from "../domain/model/industry.js";
import type { IndustryQuery } from "../domain/dto/industry.dto.js";

interface IndustryRow {
  id: string;
  slug: string;
  name: string;
  group_slug: IndustryGroup;
  sort_order: number;
  is_featured: boolean;
  has_detail: boolean;
  headline: string;
  excerpt: string;
  description: string;
  mood: string | null;
  accent_color: string | null;
  cover_image_url: string | null;
  genres: string[];
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  created_at: Date;
  updated_at: Date;
  total_count?: string;
}

interface PlaylistRow {
  id: string;
  name: string;
  mood: string | null;
  description: string;
  genres: string[];
  track_count: string;
  energy: number | null;
}

interface ScheduleRow {
  time: string;
  label: string;
  playlist_id: string;
  sound: string;
  energy: number | null;
}

function energyName(value: number | null): "low" | "medium" | "high" {
  if (value === null || value <= 2) return "low";
  if (value <= 4) return "medium";
  return "high";
}

function toListItem(row: IndustryRow): IndustryListItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    group: row.group_slug,
    sortOrder: row.sort_order,
    featured: row.is_featured,
    hasDetail: row.has_detail,
    headline: row.headline,
    excerpt: row.excerpt,
    mood: row.mood ?? "",
    accent: row.accent_color ?? "#8f7b70",
    coverImage: row.cover_image_url,
    genres: row.genres,
  };
}

function baseIndustrySelect(extraColumns = "") {
  return `
    SELECT
      i.id,
      i.slug,
      i.name,
      i.group_slug,
      i.sort_order,
      i.is_featured,
      (
        i.is_featured
        OR EXISTS (
          SELECT 1
          FROM industry_playlists ip_detail
          WHERE ip_detail.industry_id = i.id
        )
        OR EXISTS (
          SELECT 1
          FROM industry_benefits ib_detail
          WHERE ib_detail.industry_id = i.id
        )
      ) AS has_detail,
      i.headline,
      i.excerpt,
      i.description,
      i.mood,
      i.accent_color,
      i.cover_image_url,
      i.seo_title,
      i.seo_description,
      i.seo_keywords,
      COALESCE(
        array_agg(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL),
        ARRAY[]::text[]
      ) AS genres,
      i.created_at,
      i.updated_at
      ${extraColumns}
    FROM industries i
    LEFT JOIN industry_playlists ip ON ip.industry_id = i.id
    LEFT JOIN playlist_tracks pt ON pt.playlist_id = ip.playlist_id
    LEFT JOIN track_genres tg ON tg.track_id = pt.track_id
    LEFT JOIN genres g ON g.id = tg.genre_id
  `;
}

function industryGroupBy() {
  return `
    GROUP BY
      i.id,
      i.slug,
      i.name,
      i.group_slug,
      i.sort_order,
      i.is_featured,
      i.headline,
      i.excerpt,
      i.description,
      i.mood,
      i.accent_color,
      i.cover_image_url,
      i.seo_title,
      i.seo_description,
      i.seo_keywords,
      i.created_at,
      i.updated_at
  `;
}

export async function listIndustries(industryQuery: IndustryQuery) {
  const conditions = ["i.is_active = true"];
  const values: unknown[] = [];

  if (industryQuery.group) {
    values.push(industryQuery.group);
    conditions.push(`i.group_slug = $${values.length}`);
  }

  if (industryQuery.featured !== undefined) {
    values.push(industryQuery.featured);
    conditions.push(`i.is_featured = $${values.length}`);
  }

  if (industryQuery.q?.trim()) {
    values.push(`%${industryQuery.q.trim()}%`);
    conditions.push(`
      concat_ws(
        ' ',
        i.name,
        i.headline,
        i.excerpt,
        array_to_string(i.seo_keywords, ' ')
      ) ILIKE $${values.length}
    `);
  }

  if (industryQuery.hasDetail !== undefined) {
    values.push(industryQuery.hasDetail);
    conditions.push(`
      (
        i.is_featured
        OR EXISTS (
          SELECT 1
          FROM industry_playlists ip_filter
          WHERE ip_filter.industry_id = i.id
        )
        OR EXISTS (
          SELECT 1
          FROM industry_benefits ib_filter
          WHERE ib_filter.industry_id = i.id
        )
      ) = $${values.length}
    `);
  }

  values.push(industryQuery.limit);
  const limitParameter = `$${values.length}`;
  values.push(industryQuery.offset);
  const offsetParameter = `$${values.length}`;

  const result = await query<IndustryRow>(
    `
      ${baseIndustrySelect(", count(*) OVER() AS total_count")}
      WHERE ${conditions.join(" AND ")}
      ${industryGroupBy()}
      ORDER BY i.sort_order
      LIMIT ${limitParameter}
      OFFSET ${offsetParameter}
    `,
    values,
  );

  return {
    items: result.rows.map(toListItem),
    total: Number(result.rows[0]?.total_count ?? 0),
  };
}

export async function findIndustryBySlug(
  slug: string,
): Promise<Industry | undefined> {
  const industryResult = await query<IndustryRow>(
    `
      ${baseIndustrySelect()}
      WHERE i.is_active = true
        AND i.slug = lower($1)
      ${industryGroupBy()}
      LIMIT 1
    `,
    [slug],
  );
  const row = industryResult.rows[0];

  if (!row) return undefined;

  const [playlistResult, scheduleResult, benefitsResult, faqResult] =
    await Promise.all([
      query<PlaylistRow>(
        `
          SELECT
            p.id,
            p.name,
            p.mood,
            p.description,
            p.energy,
            count(DISTINCT pt.track_id)::text AS track_count,
            COALESCE(
              array_agg(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL),
              ARRAY[]::text[]
            ) AS genres
          FROM industry_playlists ip
          JOIN playlists p ON p.id = ip.playlist_id
          LEFT JOIN playlist_tracks pt ON pt.playlist_id = p.id
          LEFT JOIN track_genres tg ON tg.track_id = pt.track_id
          LEFT JOIN genres g ON g.id = tg.genre_id
          WHERE ip.industry_id = $1
            AND p.is_active = true
          GROUP BY p.id, p.name, p.mood, p.description, p.energy, ip.sort_order
          ORDER BY ip.sort_order
        `,
        [row.id],
      ),
      query<ScheduleRow>(
        `
          SELECT
            to_char(psi.start_time, 'HH24:MI') AS time,
            COALESCE(psi.label, p.name) AS label,
            p.id AS playlist_id,
            COALESCE(p.mood, p.name) AS sound,
            p.energy
          FROM play_schedule_items psi
          JOIN play_schedules ps ON ps.id = psi.schedule_id
          JOIN locations l ON l.id = ps.location_id
          JOIN playlists p ON p.id = psi.playlist_id
          WHERE l.industry_id = $1
            AND ps.is_active = true
          ORDER BY psi.day_of_week, psi.start_time
          LIMIT 12
        `,
        [row.id],
      ),
      query<{ content: string }>(
        `
          SELECT content
          FROM industry_benefits
          WHERE industry_id = $1
          ORDER BY sort_order
        `,
        [row.id],
      ),
      query<{ question: string; answer: string }>(
        `
          SELECT question, answer
          FROM industry_faqs
          WHERE industry_id = $1
          ORDER BY sort_order
        `,
        [row.id],
      ),
    ]);

  const playlists: IndustryPlaylist[] = playlistResult.rows.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    mood: playlist.mood ?? "",
    description: playlist.description,
    genres: playlist.genres,
    trackCount: Number(playlist.track_count),
    energy: energyName(playlist.energy),
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    group: row.group_slug,
    sortOrder: row.sort_order,
    featured: row.is_featured,
    active: true,
    hasDetail: row.has_detail,
    headline: row.headline,
    excerpt: row.excerpt,
    description: row.description,
    mood: row.mood ?? "",
    accent: row.accent_color ?? "#8f7b70",
    coverImage: row.cover_image_url,
    genres: row.genres,
    playlists,
    schedule: scheduleResult.rows.map((item) => ({
      time: item.time,
      label: item.label,
      playlistId: item.playlist_id,
      sound: item.sound,
      energy: energyName(item.energy),
    })),
    benefits: benefitsResult.rows.map((benefit) => benefit.content),
    faqs: faqResult.rows,
    seo: {
      title: row.seo_title ?? row.headline,
      description: row.seo_description ?? row.excerpt,
      keywords: row.seo_keywords,
    },
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listIndustryGroups() {
  const result = await query<{ slug: IndustryGroup; count: string }>(
    `
      SELECT group_slug AS slug, count(*)::text AS count
      FROM industries
      WHERE is_active = true
      GROUP BY group_slug
      ORDER BY group_slug
    `,
  );

  return result.rows.map((row) => ({
    slug: row.slug,
    count: Number(row.count),
  }));
}

export async function listRelatedIndustries(
  industry: Industry,
  limit: number,
) {
  const result = await query<IndustryRow>(
    `
      ${baseIndustrySelect()}
      WHERE i.is_active = true
        AND i.id <> $1
      ${industryGroupBy()}
      ORDER BY
        (i.group_slug = $2) DESC,
        i.is_featured DESC,
        i.sort_order
      LIMIT $3
    `,
    [industry.id, industry.group, limit],
  );

  return result.rows.map(toListItem);
}
