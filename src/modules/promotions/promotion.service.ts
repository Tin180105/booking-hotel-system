import {
    PromotionModel,
    CreatePromotionDTO,
    UpdatePromotionDTO
} from './promotion.model';

export class PromotionService {

    // =========================
    // GET ALL
    // =========================
    static async getAll() {
        return await PromotionModel.getAll();
    }

    // =========================
    // GET BY ID
    // =========================
    static async getById(id: number) {
        const promotion = await PromotionModel.getById(id);

        if (!promotion) {
            throw new Error('Promotion not found');
        }

        return promotion;
    }

    // =========================
    // CREATE
    // =========================
    static async create(data: CreatePromotionDTO) {

        if (!data.code || data.code.trim() === '') {
            throw new Error('Promotion code is required');
        }

        if (!data.discount_type) {
            throw new Error('Discount type is required');
        }

        const discountType = data.discount_type.toUpperCase();

        if (!['PERCENTAGE', 'FIXED'].includes(discountType)) {
            throw new Error(
                'Discount type must be PERCENTAGE or FIXED'
            );
        }

        if (data.discount_value < 0) {
            throw new Error(
                'Discount value must be greater than or equal to 0'
            );
        }

        if (
            discountType === 'PERCENTAGE' &&
            data.discount_value > 100
        ) {
            throw new Error(
                'Percentage discount cannot be greater than 100'
            );
        }

        if (
            data.max_discount !== null &&
            data.max_discount !== undefined &&
            data.max_discount < 0
        ) {
            throw new Error(
                'Max discount must be greater than or equal to 0'
            );
        }

        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid start date or end date');
        }

        if (endDate <= startDate) {
            throw new Error(
                'End date must be greater than start date'
            );
        }

        return await PromotionModel.create({
            ...data,
            code: data.code.trim().toUpperCase(),
            discount_type: discountType,
            start_date: startDate,
            end_date: endDate
        });
    }

    // =========================
    // UPDATE
    // =========================
    static async update(
        id: number,
        data: UpdatePromotionDTO
    ) {

        const existingPromotion = await PromotionModel.getById(id);

        if (!existingPromotion) {
            throw new Error('Promotion not found');
        }

        if (!data.code || data.code.trim() === '') {
            throw new Error('Promotion code is required');
        }

        const discountType = data.discount_type.toUpperCase();

        if (!['PERCENTAGE', 'FIXED'].includes(discountType)) {
            throw new Error(
                'Discount type must be PERCENTAGE or FIXED'
            );
        }

        if (data.discount_value < 0) {
            throw new Error(
                'Discount value must be greater than or equal to 0'
            );
        }

        if (
            discountType === 'PERCENTAGE' &&
            data.discount_value > 100
        ) {
            throw new Error(
                'Percentage discount cannot be greater than 100'
            );
        }

        if (
            data.max_discount !== null &&
            data.max_discount !== undefined &&
            data.max_discount < 0
        ) {
            throw new Error(
                'Max discount must be greater than or equal to 0'
            );
        }

        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid start date or end date');
        }

        if (endDate <= startDate) {
            throw new Error(
                'End date must be greater than start date'
            );
        }

        return await PromotionModel.update(id, {
            ...data,
            code: data.code.trim().toUpperCase(),
            discount_type: discountType,
            start_date: startDate,
            end_date: endDate
        });
    }

    // =========================
    // DELETE
    // =========================
    static async delete(id: number) {

        const existingPromotion = await PromotionModel.getById(id);

        if (!existingPromotion) {
            throw new Error('Promotion not found');
        }

        return await PromotionModel.delete(id);
    }
}