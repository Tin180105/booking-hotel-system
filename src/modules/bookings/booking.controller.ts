import { Request, Response } from 'express';
import { BookingService } from './booking.service';

export class BookingController {

    // =========================
    // GET ALL
    // =========================
    static async getAll(
        req: Request,
        res: Response
    ) {
        try {

            const bookings =
                await BookingService.getAll();

            return res.status(200).json({
                success: true,
                data: bookings
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
                    message: 'Invalid booking id'
                });
            }

            const booking =
                await BookingService.getById(id);

            return res.status(200).json({
                success: true,
                data: booking
            });

        } catch (error: any) {

            if (error.message === 'Booking not found') {
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

            const booking =
                await BookingService.create(req.body);

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: booking
            });

        } catch (error: any) {

            if (
                error.message.includes('required') ||
                error.message.includes('Valid') ||
                error.message.includes('cannot') ||
                error.message.includes('Invalid')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // UNIQUE booking_code
            if (
                error.number === 2627 ||
                error.number === 2601
            ) {
                return res.status(409).json({
                    success: false,
                    message: 'Booking code already exists'
                });
            }

            // Foreign key
            if (error.number === 547) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Hotel, customer or promotion does not exist'
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
                    message: 'Invalid booking id'
                });
            }

            const booking =
                await BookingService.update(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: 'Booking updated successfully',
                data: booking
            });

        } catch (error: any) {

            if (error.message === 'Booking not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message.includes('required') ||
                error.message.includes('Valid') ||
                error.message.includes('cannot') ||
                error.message.includes('Invalid')
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
                    message: 'Booking code already exists'
                });
            }

            if (error.number === 547) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Hotel, customer or promotion does not exist'
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
                    message: 'Invalid booking id'
                });
            }

            await BookingService.delete(id);

            return res.status(200).json({
                success: true,
                message: 'Booking deleted successfully'
            });

        } catch (error: any) {

            if (error.message === 'Booking not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            // Có thể xảy ra nếu booking đã có review
            if (error.number === 547) {
                return res.status(409).json({
                    success: false,
                    message:
                        'Cannot delete booking because it is referenced by another record'
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}