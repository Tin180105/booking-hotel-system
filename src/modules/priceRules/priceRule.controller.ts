import { Request, Response } from 'express';
import { PriceRuleService } from './priceRule.service';

export class PriceRuleController {

    // ==========================================
    // GET ALL
    // ==========================================

    static async getAll(
        req: Request,
        res: Response
    ) {
        try {

            const data =
                await PriceRuleService.getAll();

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            console.error(
                'Get price rules error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    'Failed to get price rules'
            });
        }
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    static async getById(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid price rule ID'
                });
            }

            const data =
                await PriceRuleService.getById(id);

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            return res.status(404).json({
                success: false,
                message:
                    error.message ||
                    'Price rule not found'
            });
        }
    }


    // ==========================================
    // GET BY ROOM TYPE
    // ==========================================

    static async getByRoomType(
        req: Request,
        res: Response
    ) {
        try {

            const roomTypeId =
                Number(req.params.roomTypeId);

            if (isNaN(roomTypeId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid room type ID'
                });
            }

            const data =
                await PriceRuleService.getByRoomType(
                    roomTypeId
                );

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            console.error(
                'Get price rules by room type error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    'Failed to get price rules'
            });
        }
    }


    // ==========================================
    // CREATE
    // ==========================================

    static async create(
        req: Request,
        res: Response
    ) {
        try {

            const data =
                await PriceRuleService.create(
                    req.body
                );

            return res.status(201).json({
                success: true,
                message:
                    'Price rule created successfully',
                data
            });

        } catch (error: any) {

            console.error(
                'Create price rule error:',
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    'Failed to create price rule'
            });
        }
    }


    // ==========================================
    // UPDATE
    // ==========================================

    static async update(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid price rule ID'
                });
            }

            const data =
                await PriceRuleService.update(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message:
                    'Price rule updated successfully',
                data
            });

        } catch (error: any) {

            console.error(
                'Update price rule error:',
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    'Failed to update price rule'
            });
        }
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid price rule ID'
                });
            }

            await PriceRuleService.delete(id);

            return res.status(200).json({
                success: true,
                message:
                    'Price rule deleted successfully'
            });

        } catch (error: any) {

            console.error(
                'Delete price rule error:',
                error
            );

            return res.status(404).json({
                success: false,
                message:
                    error.message ||
                    'Failed to delete price rule'
            });
        }
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    static async updateStatus(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid price rule ID'
                });
            }

            const {
                is_active
            } = req.body;

            if (
                typeof is_active !== 'boolean'
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'is_active must be boolean'
                });
            }

            const data =
                await PriceRuleService.updateStatus(
                    id,
                    is_active
                );

            return res.status(200).json({
                success: true,
                message:
                    'Price rule status updated successfully',
                data
            });

        } catch (error: any) {

            console.error(
                'Update price rule status error:',
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    'Failed to update price rule status'
            });
        }
    }
}