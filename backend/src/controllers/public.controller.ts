import type { Request, Response } from "express";
import {
  getActivePlan,
  submitContactRequest,
} from "../services/public.service.js";
import { validateContactRequest } from "../validators/public.validator.js";

export async function getPricingController(
  _request: Request,
  response: Response,
) {
  const plan = await getActivePlan();

  if (!plan) {
    response.status(404).json({
      success: false,
      message: "Chưa có gói dịch vụ đang hoạt động.",
    });
    return;
  }

  response.json({
    success: true,
    data: plan,
  });
}

export async function submitContactController(
  request: Request,
  response: Response,
) {
  const input = validateContactRequest(request.body);
  if (!input) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ họ tên, email và nội dung.",
    });
    return;
  }

  await submitContactRequest(input);

  response.status(202).json({
    success: true,
    message: "MeloBiz đã nhận được yêu cầu tư vấn.",
  });
}
