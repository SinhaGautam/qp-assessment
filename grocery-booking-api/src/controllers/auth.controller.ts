import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, role = 'user' } = req.body;
      const user = await this.userService.createUser(email, password, role);
      new ApiResponse(res).created('User registered successfully', { id: user.id, email: user.email });
    } catch (error) {
      new ApiResponse(res).error('Registration failed');
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this.userService.authenticateUser(email, password);

      if (!user) {
        return new ApiResponse(res).unauthorized('Invalid credentials');
      }
      logger.info(`User logged in: ${user.email}`);

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : undefined }
      );
      logger.info(`token expiration: ${new Date(Date.now() + (process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) * 1000 : 15 * 60 * 1000))}`);

      new ApiResponse(res).success('Login successful', { token });
    } catch (error) {
      new ApiResponse(res).error('Login failed');
    }
  }
}