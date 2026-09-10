import { Router } from 'express';
import { PromotionController } from './promotion.controller';
import { authenticateJWT as auth, role } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', PromotionController.getAll);

router.get('/:id', PromotionController.getById);

router.post('/', auth, role('admin'), PromotionController.create);

router.put('/:id', auth, role('admin'), PromotionController.update);

router.delete('/:id', auth, role('admin'), PromotionController.delete);
export default router;