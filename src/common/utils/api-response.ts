import { Response } from "express";

interface ApiResponseBody<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export class ApiResponse {
  private static send<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T | null = null,
  ): void {
    const body: ApiResponseBody<T> = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(body);
  }

  static ok<T>(res: Response, message: string, data: T | null = null): void {
    ApiResponse.send<T>(res, 200, message, data);
  }

  static created<T>(
    res: Response,
    message: string,
    data: T | null = null,
  ): void {
    ApiResponse.send<T>(res, 201, message, data);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }
}
