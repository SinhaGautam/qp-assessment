import { AppDataSource } from '../config/db';
import { Orders } from '../entities/order.entity';
import { Groceries } from '../entities/grocery.entity';
import { logger } from '../utils/logger';

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Orders);
  private groceryRepository = AppDataSource.getRepository(Groceries);

  async createOrder(userId: number, items: Array<{ groceryId: number; quantity: number }>) {

    logger.info('Entering createOrder transaction');
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fetch all grocery items in the order
      const groceryIds = items.map(item => item.groceryId);
      const groceries = await queryRunner.manager
        .createQueryBuilder(Groceries, 'grocery')
        .where('grocery.id IN (:...ids)', { ids: groceryIds })
        .setLock('pessimistic_write')
        .getMany();

      // Validate items and calculate total
      let total = 0;
      const orderItems = [];

      for (const orderItem of items) {
        const grocery = groceries.find(g => g.id === orderItem.groceryId);
        if (!grocery) {
          logger.error(`Grocery item not found: ${orderItem.groceryId}`);
          throw new Error(`Grocery item not found: ${orderItem.groceryId}`);
        }
        if (grocery.inventory < orderItem.quantity) {
          logger.error(`Not enough inventory for item: ${grocery.name}`);
          throw new Error(`Not enough inventory for item: ${grocery.name}`);
        }

        const subtotal = Number(grocery.price) * orderItem.quantity;
        total += subtotal;

        orderItems.push({
          groceryId: grocery.id,
          name: grocery.name,
          quantity: orderItem.quantity,
          price: Number(grocery.price),
          subtotal
        });

        // Update inventory
        grocery.inventory -= orderItem.quantity;
        await queryRunner.manager.save(grocery);
      }

      // Create the order
      const order = this.orderRepository.create({
        user_Id: { id: userId },
        items: orderItems,
        total,
        status: 'pending'
      });

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return {
        orderId: savedOrder.id,
        items: orderItems,
        total,
        status: savedOrder.status,
        createdAt: savedOrder.created_at
      };
    } catch (error) {
      logger.error(`Error creating order: ${error}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      logger.info('Exiting createOrder transaction');
      await queryRunner.release();
    }
  }

  async getUserOrders(userId: number, options: {
    page: number;
    limit: number;
    status?: string;
  }) {

    try {
      logger.info('Fetching user orders');
      const { page, limit, status } = options;
      const skip = (page - 1) * limit;

      const query = this.orderRepository
        .createQueryBuilder('orders')
        .where('orders.user_id = :userId', { userId });

      if (status) {
        query.andWhere('orders.status = :status', { status });
      }

      const [orders, total] = await query
        .orderBy('orders.created_at', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      const formattedOrders = orders.map(order => ({
        orderId: order.id,
        total: order.total,
        status: order.status,
        itemCount: order.items?.length,
        createdAt: order.created_at
      }));

      return { orders: formattedOrders, total, page, limit };
    } catch (error) {
      logger.error(`Error fetching user orders: ${error}`);
      throw error;
    } finally {
      logger.info('Finished fetching user orders');
    }

  }

  async getOrderDetails(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_Id: { id: userId } }
    });

    if (!order) throw new Error('Order not found');

    return {
      orderId: order.id,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
  }
}