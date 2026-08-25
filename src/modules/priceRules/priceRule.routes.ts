import { Router } from 'express';
import { PriceRuleController } from './priceRule.controller';

const router = Router();

router.get('/',PriceRuleController.getAll
);

router.get('/room-type/:roomTypeId',PriceRuleController.getByRoomType
);

router.get('/:id',PriceRuleController.getById
);

router.post('/',PriceRuleController.create
);

router.put('/:id',PriceRuleController.update
);

router.patch('/:id/status',PriceRuleController.updateStatus
);

router.delete('/:id',PriceRuleController.delete
);

export default router;