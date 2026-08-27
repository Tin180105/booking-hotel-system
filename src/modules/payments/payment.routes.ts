import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.post(
    '/',
    PaymentController.createPayment
);

router.get(
    '/',
    PaymentController.getPayments
);

router.get(
    '/:id',
    PaymentController.getPaymentById
);

router.put(
    '/:id',
    PaymentController.updatePayment
);

router.delete(
    '/:id',
    PaymentController.deletePayment
);

export default router;