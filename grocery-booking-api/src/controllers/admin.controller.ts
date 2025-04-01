import { Request, Response } from 'express';
import { GroceryService } from '../services/grocery.service';
import { ApiResponse } from '../utils/apiResponse';

export class AdminController {
  private groceryService: GroceryService;

  constructor() {
    this.groceryService = new GroceryService();
  }

  async addGroceryItem(req: Request, res: Response) {
    try {
      const groceryItem = await this.groceryService.addGroceryItem(req.body);
      new ApiResponse(res).success('Grocery item added successfully', groceryItem);
    } catch (error) {
      new ApiResponse(res).error('Failed to add grocery item');
    }
  }

  async getGroceryItems(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, category, inStock } = req.query;
      const result = await this.groceryService.getGroceryItems({
        page: Number(page),
        limit: Number(limit),
        category: category as string,
        inStock: inStock === 'true'
      });
      new ApiResponse(res).success('Grocery items fetched successfully', result);
    } catch (error) {
      new ApiResponse(res).error('Failed to fetch grocery items');
    }
  }

  async updateGroceryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedItem = await this.groceryService.updateGroceryItem(Number(id), req.body);
      new ApiResponse(res).success('Grocery item updated successfully', updatedItem);
    } catch (error) {
      new ApiResponse(res).error('Failed to update grocery item');
    }
  }

  async deleteGroceryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.groceryService.deleteGroceryItem(Number(id));
      new ApiResponse(res).success('Grocery item deleted successfully');
    } catch (error) {
      new ApiResponse(res).error('Failed to delete grocery item');
    }
  }

  async manageInventory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { operation, amount } = req.body;
      const result = await this.groceryService.manageInventory(Number(id), operation, amount);
      new ApiResponse(res).success('Inventory updated successfully', result);
    } catch (error) {
      new ApiResponse(res).error('Failed to manage inventory');
    }
  }
}