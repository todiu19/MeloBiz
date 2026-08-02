import { INDUSTRY_GROUPS } from "../constants/industry.constants.js";
import type { IndustryQuery } from "../domain/dto/industry.dto.js";
import type { IndustryGroup } from "../domain/model/industry.js";
import type { ValidationResult } from "../types/validation-result.js";
import {
  parseBooleanQuery,
  parseIntegerQuery,
} from "../utils/request.utils.js";

export function validateIndustryQuery(
  query: Record<string, unknown>,
): ValidationResult<IndustryQuery> {
  const group =
    typeof query.group === "string"
      ? (query.group as IndustryGroup)
      : undefined;
  if (group && !INDUSTRY_GROUPS.includes(group)) {
    return {
      success: false,
      message: `Nhóm ngành không hợp lệ. Giá trị hỗ trợ: ${INDUSTRY_GROUPS.join(", ")}.`,
    };
  }

  const featured = parseBooleanQuery(query.featured);
  const hasDetail = parseBooleanQuery(query.hasDetail);
  const limit = parseIntegerQuery(query.limit, 20);
  const offset = parseIntegerQuery(query.offset, 0);
  if (
    featured === null ||
    hasDetail === null ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    return {
      success: false,
      message: "Tham số lọc hoặc phân trang không hợp lệ.",
    };
  }

  return {
    success: true,
    data: {
      q: typeof query.q === "string" ? query.q : undefined,
      group,
      featured: featured ?? undefined,
      hasDetail: hasDetail ?? undefined,
      limit,
      offset,
    },
  };
}

export function validateRelatedLimit(
  value: unknown,
): ValidationResult<number> {
  const limit = parseIntegerQuery(value, 3);
  return Number.isInteger(limit) && limit >= 1 && limit <= 12
    ? { success: true, data: limit }
    : {
        success: false,
        message: "Limit phải là số nguyên từ 1 đến 12.",
      };
}
