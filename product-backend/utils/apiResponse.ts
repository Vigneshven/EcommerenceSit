import type { Response } from "express";

type SuccessResponseData<T> = {
  message: string;
  data?: T;
  statusCode?: number;
};

type ErrorResponseData = {
  message: string;
  statusCode?: number;
};

export function successResponse<T>(
  res: Response,
  { message, data, statusCode = 200 }: SuccessResponseData<T>,
) {
  return res.status(statusCode).json({
    message,
    ...{ data },
  });
}

export function errorResponse(
  res: Response,
  { message, statusCode = 500 }: ErrorResponseData,
) {
  return res.status(statusCode).json({
    message,
  });
}
