import type { Request, Response } from "express";
import {
  findIndustryBySlug,
  listIndustries,
  listIndustryGroups,
  listRelatedIndustries,
} from "../services/industry.service.js";
import { getStringParam } from "../utils/request.utils.js";
import {
  validateIndustryQuery,
  validateRelatedLimit,
} from "../validators/industry.validator.js";

export async function listIndustriesController(
  request: Request,
  response: Response,
) {
  const validated = validateIndustryQuery(request.query);
  if (!validated.success) {
    response.status(400).json({
      success: false,
      message: validated.message,
    });
    return;
  }

  const result = await listIndustries(validated.data);
  const { limit, offset } = validated.data;

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
}

export async function listIndustryGroupsController(
  _request: Request,
  response: Response,
) {
  response.set("Cache-Control", "public, max-age=300, s-maxage=1800");
  response.json({ success: true, data: await listIndustryGroups() });
}

export async function getIndustryController(
  request: Request,
  response: Response,
) {
  const industry = await findIndustryBySlug(
    getStringParam(request.params.slug),
  );
  if (!industry) {
    response.status(404).json({
      success: false,
      message: "Không tìm thấy loại hình kinh doanh.",
    });
    return;
  }

  response.set("Cache-Control", "public, max-age=60, s-maxage=600");
  response.json({ success: true, data: industry });
}

export async function getIndustryPlaylistsController(
  request: Request,
  response: Response,
) {
  const industry = await findIndustryBySlug(
    getStringParam(request.params.slug),
  );
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
}

export async function getIndustryScheduleController(
  request: Request,
  response: Response,
) {
  const industry = await findIndustryBySlug(
    getStringParam(request.params.slug),
  );
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
}

export async function getRelatedIndustriesController(
  request: Request,
  response: Response,
) {
  const industry = await findIndustryBySlug(
    getStringParam(request.params.slug),
  );
  if (!industry) {
    response
      .status(404)
      .json({
        success: false,
        message: "Không tìm thấy loại hình kinh doanh.",
      });
    return;
  }

  const validatedLimit = validateRelatedLimit(request.query.limit);
  if (!validatedLimit.success) {
    response.status(400).json({
      success: false,
      message: validatedLimit.message,
    });
    return;
  }

  response.set("Cache-Control", "public, max-age=60, s-maxage=600");
  response.json({
    success: true,
    data: await listRelatedIndustries(industry, validatedLimit.data),
  });
}
