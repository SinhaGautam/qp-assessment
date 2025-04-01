import { AppDataSource } from '../config/db';
import { Groceries } from '../entities/grocery.entity';
import { InventoryOperation } from '../types/custom.types';

export class GroceryService {
  
  private groceryRepository = AppDataSource.getRepository(Groceries);

  async addGroceryItem(data: {
    name: string;
    price: number;
    inventory: number;
    category?: string;
    description?: string;
  }) {
    const groceryItem = this.groceryRepository.create(data);
    return await this.groceryRepository.save(groceryItem);
  }

  async getGroceryItems(options: {
    page: number;
    limit: number;
    category?: string;
    inStock?: boolean;
  }) {
    const { page, limit, category, inStock } = options;
    const skip = (page - 1) * limit;

    const query = this.groceryRepository.createQueryBuilder('grocery');

    if (category) {
      query.andWhere('grocery.category = :category', { category });
    }

    if (inStock) {
      query.andWhere('grocery.inventory > 0');
    }

    const [items, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { items, total, page, limit };
  }

  async updateGroceryItem(id: number, updateData: {
    name?: string;
    price?: number;
    inventory?: number;
  }) {
    await this.groceryRepository.update(id, updateData);
    return await this.groceryRepository.findOne({ where: { id } });
  }

  async deleteGroceryItem(id: number) {
    return await this.groceryRepository.delete(id);
  }

  async manageInventory(id: number, operation: InventoryOperation, amount: number) {
    const groceryItem = await this.groceryRepository.findOne({ where: { id } });
    if (!groceryItem) throw new Error('Grocery item not found');

    switch (operation) {
      case 'add':
        groceryItem.inventory += amount;
        break;
      case 'subtract':
        groceryItem.inventory = Math.max(0, groceryItem.inventory - amount);
        break;
      case 'set':
        groceryItem.inventory = amount;
        break;
      default:
        throw new Error('Invalid operation');
    }

    await this.groceryRepository.save(groceryItem);
    return { id: groceryItem.id, inventory: groceryItem.inventory };
  }
}