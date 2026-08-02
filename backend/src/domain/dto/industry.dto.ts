import type { IndustryGroup } from "../model/industry.js";

export interface IndustryQuery {
  q?: string;
  group?: IndustryGroup;
  featured?: boolean;
  hasDetail?: boolean;
  limit: number;
  offset: number;
}
