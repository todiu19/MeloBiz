import type {
  Industry,
} from "../domain/model/industry.js";
import type { IndustryQuery } from "../domain/dto/industry.dto.js";
import * as industryRepository from "../data/industry.repository.js";

export function listIndustries(query: IndustryQuery) {
  return industryRepository.listIndustries(query);
}

export function findIndustryBySlug(slug: string) {
  return industryRepository.findIndustryBySlug(slug);
}

export function listIndustryGroups() {
  return industryRepository.listIndustryGroups();
}

export function listRelatedIndustries(industry: Industry, limit: number) {
  return industryRepository.listRelatedIndustries(industry, limit);
}
