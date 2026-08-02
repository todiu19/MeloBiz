export type IndustryGroup =
  | "hospitality"
  | "wellness"
  | "retail"
  | "fitness"
  | "healthcare"
  | "workplace"
  | "entertainment"
  | "transport";

export interface IndustryPlaylist {
  id: string;
  name: string;
  mood: string;
  description: string;
  genres: string[];
  trackCount: number;
  energy: "low" | "medium" | "high";
}

export interface IndustryScheduleItem {
  time: string;
  label: string;
  playlistId: string;
  sound: string;
  energy: "low" | "medium" | "high";
}

export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  group: IndustryGroup;
  sortOrder: number;
  featured: boolean;
  active: boolean;
  hasDetail: boolean;
  headline: string;
  excerpt: string;
  description: string;
  mood: string;
  accent: string;
  coverImage: string | null;
  genres: string[];
  playlists: IndustryPlaylist[];
  schedule: IndustryScheduleItem[];
  benefits: string[];
  faqs: IndustryFaq[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface IndustryListItem {
  id: string;
  slug: string;
  name: string;
  group: IndustryGroup;
  sortOrder: number;
  featured: boolean;
  hasDetail: boolean;
  headline: string;
  excerpt: string;
  mood: string;
  accent: string;
  coverImage: string | null;
  genres: string[];
}
