import { Response } from 'express';
import { logger } from './logger';

export class ApiResponse {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  success(message: string, data?: any) {
    this.res.status(200).json({
      success: true,
      message,
      data
    });
  }

  created(message: string, data?: any) {
    this.res.status(201).json({
      success: true,
      message,
      data
    });
  }

  badRequest(message: string, details?: any) {
    this.res.status(400).json({
      success: false,
      error: 'Bad Request',
      message,
      details
    });
  }

  unauthorized(message: string) {
    this.res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message
    });
  }

  forbidden(message: string) {
    this.res.status(403).json({
      success: false,
      error: 'Forbidden',
      message
    });
  }

  notFound(message: string) {
    this.res.status(404).json({
      success: false,
      error: 'Not Found',
      message
    });
  }

  conflict(message: string) {
    this.res.status(409).json({
      success: false,
      error: 'Conflict',
      message
    });
  }

  error(message: string, error?: any) {
    logger.error(error);
    this.res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message
    });
  }
}