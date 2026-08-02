import type { Request, Response } from "express";
import { findLicense } from "../services/license.service.js";
import { validateLicenseLookup } from "../validators/license.validator.js";

export async function lookupLicenseController(
  request: Request,
  response: Response,
) {
  const input = validateLicenseLookup(request.body);
  if (!input) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập mã giấy phép hoặc mã số thuế.",
    });
    return;
  }

  const license = await findLicense(input.query);

  if (!license) {
    response.status(404).json({
      success: false,
      message: "Không tìm thấy giấy phép phù hợp.",
    });
    return;
  }

  const statusMessages = {
    active: "đang hiệu lực",
    expired: "đã hết hạn",
    revoked: "đã bị thu hồi",
  } as const;

  response.json({
    success: true,
    message: `Giấy phép ${license.code} của ${license.businessName} ${statusMessages[license.status]}.`,
    data: license,
  });
}
