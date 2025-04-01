import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error occurred:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
};