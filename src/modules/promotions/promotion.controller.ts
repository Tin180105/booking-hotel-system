import { Request, Response } from 'express';
import {
    PromotionService
} from './promotion.service';

export class PromotionController {

    // =========================
    // GET ALL
    // =========================
    static async getAll(
        req: Request,
        res: Response
    ) {
        try {
            const promotions = await PromotionService.getAll();

            return res.status(200).json({
                success: true,
                data: promotions
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // GET BY ID
    // =========================
    static async getById(
        req: Request,
        res: Response
    ) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid promotion id'
                });
            }

            const promotion =
                await PromotionService.getById(id);

            return res.status(200).json({
                success: true,
                data: promotion
            });

        } catch (error: any) {

            if (error.message === 'Promotion not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // CREATE
    // =========================
    static async create(
        req: Request,
        res: Response
    ) {
        try {

            const promotion =
                await PromotionService.create(req.body);

            return res.status(201).json({
                success: true,
                message: 'Promotion created successfully',
                data: promotion
            });

        } catch (error: any) {

            if (
                error.message.includes('required') ||
                error.message.includes('must') ||
                error.message.includes('Invalid') ||
                error.message.includes('cannot')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // SQL Server UNIQUE constraint
            if (
                error.number === 2627 ||
                error.number === 2601
            ) {
                return res.status(409).json({
                    success: false,
                    message: 'Promotion code already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // UPDATE
    // =========================
    static async update(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid promotion id'
                });
            }

            const promotion =
                await PromotionService.update(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: 'Promotion updated successfully',
                data: promotion
            });

        } catch (error: any) {

            if (error.message === 'Promotion not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message.includes('required') ||
                error.message.includes('must') ||
                error.message.includes('Invalid') ||
                error.message.includes('cannot')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.number === 2627 ||
                error.number === 2601
            ) {
                return res.status(409).json({
                    success: false,
                    message: 'Promotion code already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // =========================
    // DELETE
    // =========================
    static async delete(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid promotion id'
                });
            }

            await PromotionService.delete(id);

            return res.status(200).json({
                success: true,
                message: 'Promotion deleted successfully'
            });

        } catch (error: any) {

            if (error.message === 'Promotion not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}