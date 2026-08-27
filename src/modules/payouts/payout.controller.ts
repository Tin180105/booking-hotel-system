import { Request, Response } from 'express';
import { PayoutService } from './payout.service';

export class PayoutController {

    // =========================
    // CREATE
    // =========================
    static async createPayout(
        req: Request,
        res: Response
    ) {
        try {

            const {
                hotel_id,
                payout_code
            } = req.body;

            if (!hotel_id) {
                return res.status(400).json({
                    success: false,
                    message: 'hotel_id là bắt buộc'
                });
            }

            if (!payout_code) {
                return res.status(400).json({
                    success: false,
                    message: 'payout_code là bắt buộc'
                });
            }

            const payout =
                await PayoutService.createPayout({
                    hotel_id: Number(hotel_id),
                    payout_code
                });

            return res.status(201).json({
                success: true,
                message: 'Tạo payout thành công',
                data: payout
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // GET ALL
    // =========================
    static async getPayouts(
        req: Request,
        res: Response
    ) {
        try {

            const payouts =
                await PayoutService.getPayouts();

            return res.status(200).json({
                success: true,
                data: payouts
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
    static async getPayoutById(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID không hợp lệ'
                });
            }

            const payout =
                await PayoutService.getPayoutById(id);

            return res.status(200).json({
                success: true,
                data: payout
            });

        } catch (error: any) {

            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // UPDATE
    // =========================
    static async updatePayout(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID không hợp lệ'
                });
            }

            const payout =
                await PayoutService.updatePayout(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: 'Cập nhật payout thành công',
                data: payout
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


    // =========================
    // DELETE
    // =========================
    static async deletePayout(
        req: Request,
        res: Response
    ) {
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID không hợp lệ'
                });
            }

            await PayoutService.deletePayout(id);

            return res.status(200).json({
                success: true,
                message: 'Xóa payout thành công'
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}