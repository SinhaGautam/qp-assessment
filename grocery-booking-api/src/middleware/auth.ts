import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    logger.error('Authentication failed: No token provided.');
    return new ApiResponse(res).unauthorized('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication failed: Invalid token.', error);
    new ApiResponse(res).unauthorized('Invalid token.');
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      return new ApiResponse(res).forbidden('Access denied. Admin privileges required.');
    }
    next();    
  } catch (error) {
    logger.error('Authorization failed: Admin privileges required.', error);
    new ApiResponse(res).forbidden('Access denied. Admin privileges required.');
  }
  
};