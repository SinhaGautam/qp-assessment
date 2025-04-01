import { Users } from '../entities/User.entity';
import { Groceries } from '../entities/grocery.entity';
import { Orders } from '../entities/order.entity';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        email: string;
        role: 'admin' | 'user';
      };
    }
  }
}

// User types
export interface IUser extends Users {
  // Additional methods can be added here if needed
}

export type UserRole = 'admin' | 'user';

export interface UserCreateInput {
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

// Grocery types
export interface IGrocery extends Groceries {
  // Additional methods can be added here if needed
}

export interface GroceryCreateInput {
  name: string;
  price: number;
  inventory: number;
  category?: string;
  description?: string;
}

export interface GroceryUpdateInput {
  name?: string;
  price?: number;
  inventory?: number;
  category?: string | null;
  description?: string | null;
}

export type InventoryOperation = 'add' | 'subtract' | 'set';

export interface InventoryUpdateInput {
  operation: InventoryOperation;
  amount: number;
}

// Order types
export interface IOrder extends Orders {
  // Additional methods can be added here if needed
}

export interface OrderItemInput {
  groceryId: number;
  quantity: number;
}

export interface OrderCreateInput {
  items: OrderItemInput[];
}

export interface OrderItemResponse {
  groceryId: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  orderId: number;
  items: OrderItemResponse[];
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

// Pagination types
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: any;
}

// JWT Payload
export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Query Filter types
export interface GroceryFilterOptions {
  category?: string;
  inStock?: boolean;
}

export interface AvailableGroceryFilterOptions extends GroceryFilterOptions {
  sort?: 'name' | 'price';
  order?: 'asc' | 'desc';
}

export interface OrderFilterOptions {
  status?: OrderStatus;
}

// Service types
export interface IGroceryService {
  addGroceryItem(data: GroceryCreateInput): Promise<IGrocery>;
  getGroceryItems(options: PaginationOptions & GroceryFilterOptions): Promise<PaginatedResponse<IGrocery>>;
  updateGroceryItem(id: number, data: GroceryUpdateInput): Promise<IGrocery>;
  deleteGroceryItem(id: number): Promise<void>;
  manageInventory(id: number, operation: InventoryOperation, amount: number): Promise<{ id: number; inventory: number }>;
  getAvailableGroceryItems(options: PaginationOptions & AvailableGroceryFilterOptions): Promise<PaginatedResponse<IGrocery>>;
}

export interface IOrderService {
  createOrder(userId: number, items: OrderItemInput[]): Promise<OrderResponse>;
  getUserOrders(userId: number, options: PaginationOptions & OrderFilterOptions): Promise<PaginatedResponse<Omit<OrderResponse, 'items'>>>;
  getOrderDetails(userId: number, orderId: number): Promise<OrderResponse>;
}

export interface IUserService {
  createUser(email: string, password: string, role?: UserRole): Promise<IUser>;
  authenticateUser(email: string, password: string): Promise<IUser | null>;
}