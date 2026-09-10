import { CustomerPromotionModel } from './customerPromotion.model';

export class CustomerPromotionService {
    static async getByCustomer(customerId: number) {
        return await CustomerPromotionModel.getByCustomer(customerId);
    }

    static async save(customerId: number, promotionId: number) {
        if (!Number.isInteger(promotionId) || promotionId <= 0) {
            throw new Error('Promotion ID không hợp lệ');
        }

        try {
            return await CustomerPromotionModel.save(customerId, promotionId);
        } catch (error: any) {
            if (error.number === 2627 || error.number === 2601) {
                throw new Error('Mã khuyến mãi đã được lưu');
            }

            throw error;
        }
    }
}