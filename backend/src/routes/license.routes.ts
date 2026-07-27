import { Router } from "express";
import { licenses } from "../data/licenses.js";

export const licenseRouter = Router();

licenseRouter.post("/lookup", (request, response) => {
  const query =
    typeof request.body?.query === "string"
      ? request.body.query.trim().toUpperCase()
      : "";

  if (!query) {
    response.status(400).json({
      success: false,
      message: "Vui lòng nhập mã giấy phép hoặc mã số thuế.",
    });
    return;
  }

  const license = licenses.find(
    (item) => item.code.toUpperCase() === query || item.taxCode === query,
  );

  if (!license) {
    response.status(404).json({
      success: false,
      message: "Không tìm thấy giấy phép phù hợp.",
    });
    return;
  }

  response.json({
    success: true,
    message: `Giấy phép ${license.code} của ${license.businessName} đang hiệu lực.`,
    data: license,
  });
});
