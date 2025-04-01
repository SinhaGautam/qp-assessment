import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();
const adminController = new AdminController();

router.use(authenticate, authorizeAdmin);

router.post('/groceries', adminController.addGroceryItem.bind(adminController));
router.get('/groceries', adminController.getGroceryItems.bind(adminController));
router.patch('/groceries/:id', adminController.updateGroceryItem.bind(adminController));
router.delete('/groceries/:id', adminController.deleteGroceryItem.bind(adminController));
router.post('/groceries/:id/inventory', adminController.manageInventory.bind(adminController));

export default router;