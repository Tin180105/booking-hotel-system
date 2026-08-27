import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {

    // =========================
    // CREATE
    // =========================
    static async createPayment(
        req: Request,
        res: Response
    ) {
        try {

            const {
                booking_id,
                payment_method,
                transaction_code,
                amount
            } = req.body;

            // =========================
            // Validate
            // =========================
            if (!booking_id) {
                return res.status(400).json({
                    success: false,
                    message: 'booking_id là bắt buộc'
                });
            }

            if (!payment_method) {
                return res.status(400).json({
                    success: false,
                    message: 'payment_method là bắt buộc'
                });
            }

            if (
                amount === undefined ||
                amount === null
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'amount là bắt buộc'
                });
            }

            if (Number(amount) < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'amount phải lớn hơn hoặc bằng 0'
                });
            }

            const payment =
                await PaymentService.createPayment({
                    booking_id: Number(booking_id),
                    payment_method,
                    transaction_code,
                    amount: Number(amount)
                });

            return res.status(201).json({
                success: true,
                message: 'Tạo payment thành công',
                data: payment
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
    static async getPayments(
        req: Request,
        res: Response
    ) {
        try {

            const payments =
                await PaymentService.getPayments();

            return res.status(200).json({
                success: true,
                data: payments
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
    static async getPaymentById(
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

            const payment =
                await PaymentService.getPaymentById(id);

            return res.status(200).json({
                success: true,
                data: payment
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
    static async updatePayment(
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

            const payment =
                await PaymentService.updatePayment(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: 'Cập nhật payment thành công',
                data: payment
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
    static async deletePayment(
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

            await PaymentService.deletePayment(id);

            return res.status(200).json({
                success: true,
                message: 'Xóa payment thành công'
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}