import { Router } from 'express';
import { PayoutController } from './payout.controller';

const router = Router();

// CREATE
router.post('/', PayoutController.createPayout);

// GET ALL
router.get('/', PayoutController.getPayouts);

// GET BY ID
router.get('/:id', PayoutController.getPayoutById);

// UPDATE
router.put('/:id', PayoutController.updatePayout);

// DELETE
router.delete('/:id', PayoutController.deletePayout);

export default router;