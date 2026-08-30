import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticateJWT as auth, role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, role('admin'), CustomerController.getAll);
router.get('/:id', auth, role('admin'), CustomerController.getById);
router.put('/:id', auth, role('admin'), CustomerController.update);
router.delete('/:id', auth, role('admin'), CustomerController.delete);

export default router;