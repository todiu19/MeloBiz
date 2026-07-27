import { Router } from "express";

export const publicRouter = Router();

publicRouter.get("/pricing", (_request, response) => {
  response.json({
    success: true,
    data: {
      name: "MeloBiz Pro",
      price: 199000,
      currency: "VND",
      billingUnit: "điểm phát/tháng",
      trialDays: 14,
      vatIncluded: false,
    },
  });
});

publicRouter.post("/contact", (request, response) => {
  const { name, email, message } = request.body ?? {};

  if (![name, email, message].every((value) => typeof value === "string" && value.trim())) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ họ tên, email và nội dung.",
    });
    return;
  }

  response.status(202).json({
    success: true,
    message: "MeloBiz đã nhận được yêu cầu tư vấn.",
  });
});
