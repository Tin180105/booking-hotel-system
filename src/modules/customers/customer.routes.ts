import { Router } from 'express';
import { CustomerController } from './customer.controller';

const router = Router();

// GET ALL
router.get('/',CustomerController.getAll);
// GET BY ID
router.get('/:id',CustomerController.getById);
// CREATE
router.post('/',CustomerController.create);
// UPDATE
router.put('/:id',CustomerController.update);
// DELETE
router.delete('/:id',CustomerController.delete);
export default router;