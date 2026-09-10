import { Router } from 'express';
import { authenticateJWT, role } from '../../middlewares/auth.middleware';
import { CustomerPromotionController } from './customerPromotion.controller';

const router = Router();

router.use(authenticateJWT, role('customer'));
router.get('/mine', CustomerPromotionController.getMine);
router.post('/:promotionId', CustomerPromotionController.save);

export default router;