import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { CustomerPromotionService } from './customerPromotion.service';

export class CustomerPromotionController {
    static async getMine(req: AuthRequest, res: Response) {
        try {
            const data = await CustomerPromotionService.getByCustomer(req.user!.userId);
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async save(req: AuthRequest, res: Response) {
        try {
            const promotionId = Number(req.params.promotionId);
            const data = await CustomerPromotionService.save(req.user!.userId, promotionId);
            return res.status(201).json({
                success: true,
                message: 'Đã lưu mã khuyến mãi',
                data
            });
        } catch (error: any) {
            const status = error.message === 'Mã khuyến mãi đã được lưu' ? 409 : 400;
            return res.status(status).json({ success: false, message: error.message });
        }
    }
}