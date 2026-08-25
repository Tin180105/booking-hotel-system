import { PriceRuleModel } from './priceRule.model';

export class PriceRuleService {

    // ==========================================
    // GET ALL
    // ==========================================

    static async getAll() {
        return await PriceRuleModel.getAll();
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    static async getById(id: number) {
        const priceRule =
            await PriceRuleModel.getById(id);

        if (!priceRule) {
            throw new Error(
                'Price rule not found'
            );
        }

        return priceRule;
    }


    // ==========================================
    // GET BY ROOM TYPE
    // ==========================================

    static async getByRoomType(
        roomTypeId: number
    ) {
        return await PriceRuleModel.getByRoomType(
            roomTypeId
        );
    }


    // ==========================================
    // CREATE
    // ==========================================

    static async create(data: {
        room_type_id: number;
        rule_name: string;
        start_date?: string | null;
        end_date?: string | null;
        days_of_week?: string | null;
        adjustment_type: string;
        adjustment_value: number;
        priority?: number;
        is_active?: boolean;
    }) {

        if (!data.room_type_id) {
            throw new Error(
                'Room type is required'
            );
        }

        if (!data.rule_name?.trim()) {
            throw new Error(
                'Rule name is required'
            );
        }

        if (!data.adjustment_type) {
            throw new Error(
                'Adjustment type is required'
            );
        }

        if (
            data.adjustment_value === undefined ||
            data.adjustment_value === null
        ) {
            throw new Error(
                'Adjustment value is required'
            );
        }

        if (data.adjustment_value < 0) {
            throw new Error(
                'Adjustment value cannot be negative'
            );
        }

        if (
            data.start_date &&
            data.end_date &&
            data.end_date < data.start_date
        ) {
            throw new Error(
                'End date must be greater than or equal to start date'
            );
        }

        if (
            data.priority !== undefined &&
            data.priority < 0
        ) {
            throw new Error(
                'Priority cannot be negative'
            );
        }

        return await PriceRuleModel.create(data);
    }


    // ==========================================
    // UPDATE
    // ==========================================

    static async update(
        id: number,
        data: {
            room_type_id?: number;
            rule_name?: string;
            start_date?: string | null;
            end_date?: string | null;
            days_of_week?: string | null;
            adjustment_type?: string;
            adjustment_value?: number;
            priority?: number;
            is_active?: boolean;
        }
    ) {

        const existing =
            await PriceRuleModel.getById(id);

        if (!existing) {
            throw new Error(
                'Price rule not found'
            );
        }

        if (
            data.rule_name !== undefined &&
            !data.rule_name.trim()
        ) {
            throw new Error(
                'Rule name cannot be empty'
            );
        }

        if (
            data.adjustment_value !== undefined &&
            data.adjustment_value < 0
        ) {
            throw new Error(
                'Adjustment value cannot be negative'
            );
        }

        if (
            data.priority !== undefined &&
            data.priority < 0
        ) {
            throw new Error(
                'Priority cannot be negative'
            );
        }

        if (
            data.start_date &&
            data.end_date &&
            data.end_date < data.start_date
        ) {
            throw new Error(
                'End date must be greater than or equal to start date'
            );
        }

        return await PriceRuleModel.update(
            id,
            data
        );
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(id: number) {

        const existing =
            await PriceRuleModel.getById(id);

        if (!existing) {
            throw new Error(
                'Price rule not found'
            );
        }

        await PriceRuleModel.delete(id);

        return true;
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    static async updateStatus(
        id: number,
        isActive: boolean
    ) {

        const existing =
            await PriceRuleModel.getById(id);

        if (!existing) {
            throw new Error(
                'Price rule not found'
            );
        }

        return await PriceRuleModel.updateStatus(
            id,
            isActive
        );
    }
}