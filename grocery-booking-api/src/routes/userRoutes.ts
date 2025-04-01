import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

router.use(authenticate);

router.get('/groceries', userController.getAvailableGroceryItems.bind(userController));
router.post('/orders', userController.createOrder.bind(userController));
router.get('/orders', userController.getUserOrders.bind(userController));
router.get('/orders/:orderId', userController.getOrderDetails.bind(userController));

export default router;