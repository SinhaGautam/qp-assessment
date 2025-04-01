import { Request, Response } from 'express';
import { GroceryService } from '../services/grocery.service';
import { OrderService } from '../services/order.service';
import { ApiResponse } from '../utils/apiResponse';

export class UserController {
  private groceryService: GroceryService;
  private orderService: OrderService;

  constructor() {
    this.groceryService = new GroceryService();
    this.orderService = new OrderService();
  }

  async getAvailableGroceryItems(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, category, sort, order } = req.query;
      const result = await this.groceryService.getGroceryItems({
        page: Number(page),
        limit: Number(limit),
        category: category as string,
        inStock: true
      });
      new ApiResponse(res).success('Available grocery items fetched successfully', result);
    } catch (error) {
      new ApiResponse(res).error('Failed to fetch available grocery items');
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { items } = req.body;
      const order = await this.orderService.createOrder(userId, items);
      new ApiResponse(res).success('Order created successfully', order);
    } catch (error) {
      new ApiResponse(res).error('Failed to create order');
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 5, status } = req.query;
      const result = await this.orderService.getUserOrders(userId, {
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });
      new ApiResponse(res).success('User orders fetched successfully', result);
    } catch (error) {
      new ApiResponse(res).error('Failed to fetch user orders');
    }
  }

  async getOrderDetails(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { orderId } = req.params;
      const order = await this.orderService.getOrderDetails(userId, Number(orderId));
      new ApiResponse(res).success('Order details fetched successfully', order);
    } catch (error) {
      new ApiResponse(res).error('Failed to fetch order details');
    }
  }
}