import type {
  ErrorRequestHandler,
  RequestHandler,
} from "express";

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({
    success: false,
    message: "Không tìm thấy API endpoint.",
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error(error);
  response.status(500).json({
    success: false,
    message: "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.",
  });
};
