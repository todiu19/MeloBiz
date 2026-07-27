import { Router } from "express";
import type { IndustryGroup } from "../domain/industry.js";
import {
  findIndustryBySlug,
  listIndustries,
  listIndustryGroups,
  listRelatedIndustries,
} from "../services/industry.service.js";

export const industryRouter = Router();

const groups: IndustryGroup[] = [
  "hospitality",
  "wellness",
  "retail",
  "fitness",
  "healthcare",
  "workplace",
  "entertainment",
  "transport",
];

function parseBoolean(value: unknown) {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function parseInteger(value: unknown, fallback: number) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

industryRouter.get("/", (request, response) => {
  const group =
    typeof request.query.group === "string"
      ? (request.query.group as IndustryGroup)
      : undefined;
  const featured = parseBoolean(request.query.featured);
  const hasDetail = parseBoolean(request.query.hasDetail);
  const limit = parseInteger(request.query.limit, 20);
  const offset = parseInteger(request.query.offset, 0);

  if (group && !groups.includes(group)) {
    response.status(400).json({
      success: false,
      message: `Nhóm ngành không hợp lệ. Giá trị hỗ trợ: ${groups.join(", ")}.`,
    });
    return;
  }

  if (
    featured === null ||
    hasDetail === null ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    response.status(400).json({
      success: false,
      message: "Tham số lọc hoặc phân trang không hợp lệ.",
    });
    return;
  }

  const result = listIndustries({
    q: typeof request.query.q === "string" ? request.query.q : undefined,
    group,
    featured: featured ?? undefined,
    hasDetail: hasDetail ?? undefined,
    limit,
    offset,
  });

  response.set("Cache-Control", "public, max-age=60, s-maxage=600");
  response.json({
    success: true,
    data: result.items,
    meta: {
      total: result.total,
      limit,
      offset,
      hasMore: offset + result.items.length < result.total,
    },
  });
});

industryRouter.get("/groups", (_request, response) => {
  response.set("Cache-Control", "public, max-age=300, s-maxage=1800");
  response.json({ success: true, data: listIndustryGroups() });
});

industryRouter.get("/:slug", (request, response) => {
  const industry = findIndustryBySlug(request.params.slug);
  if (!industry) {
    response.status(404).json({
      success: false,
      message: "Không tìm thấy loại hình kinh doanh.",
    });
    return;
  }

  response.set("Cache-Control", "public, max-age=60, s-maxage=600");
  response.json({ success: true, data: industry });
});

industryRouter.get("/:slug/playlists", (request, response) => {
  const industry = findIndustryBySlug(request.params.slug);
  if (!industry) {
    response
      .status(404)
      .json({
        success: false,
        message: "Không tìm thấy loại hình kinh doanh.",
      });
    return;
  }
  response.set("Cache-Control", "public, max-age=60, s-maxage=600");
  response.json({ success: true, data: industry.playlists });
});

industryRouter.get("/:slug/schedule", (request, response) => {
  const industry = findIndustryBySlug(request.params.slug);
  if (!industry) {
    response
      .status(404)
      .json({
        success: false,
        message: "Không tìm thấy loại hình kinh doanh.",
      });
    return;
  }
  response.set("Cache-Control", "public, max-age=60, s-maxage=600");
  response.json({ success: true, data: industry.schedule });
});

industryRouter.get("/:slug/related", (request, response) => {
  const industry = findIndustryBySlug(request.params.slug);
  if (!industry) {
    response
      .status(404)
      .json({
        success: false,
        message: "Không tìm thấy loại hình kinh doanh.",
      });
    return;
  }

  const limit = parseInteger(request.query.limit, 3);
  if (!Number.isInteger(limit) || limit < 1 || limit > 12) {
    response.status(400).json({
      success: false,
      message: "Limit phải là số nguyên từ 1 đến 12.",
    });
    return;
  }

  response.set("Cache-Control", "public, max-age=60, s-maxage=600");
  response.json({
    success: true,
    data: listRelatedIndustries(industry, limit),
  });
});
