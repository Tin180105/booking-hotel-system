import { Request, Response } from 'express';
import { BookingRoomService } from './bookingRoom.service';

export class BookingRoomController {

    // =========================
    // GET ALL
    // =========================
    static async getAll(
        req: Request,
        res: Response
    ) {
        try {

            const bookingRooms =
                await BookingRoomService.getAll();

            return res.status(200).json({
                success: true,
                data: bookingRooms
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
                    message: 'Invalid booking room id'
                });
            }

            const bookingRoom =
                await BookingRoomService.getById(id);

            return res.status(200).json({
                success: true,
                data: bookingRoom
            });

        } catch (error: any) {

            if (
                error.message ===
                'Booking room not found'
            ) {
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
    // GET BY BOOKING ID
    // =========================
    static async getByBookingId(
        req: Request,
        res: Response
    ) {
        try {

            const bookingId =
                Number(req.params.bookingId);

            if (
                !Number.isInteger(bookingId) ||
                bookingId <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid booking id'
                });
            }

            const bookingRooms =
                await BookingRoomService.getByBookingId(
                    bookingId
                );

            return res.status(200).json({
                success: true,
                data: bookingRooms
            });

        } catch (error: any) {

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

            const bookingRoom =
                await BookingRoomService.create(
                    req.body
                );

            return res.status(201).json({
                success: true,
                message:
                    'Booking room created successfully',
                data: bookingRoom
            });

        } catch (error: any) {

            if (
                error.message.includes('required') ||
                error.message.includes('must') ||
                error.message.includes('cannot') ||
                error.message.includes('Invalid')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Foreign key violation
            if (error.number === 547) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Booking or room type does not exist'
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
                    message: 'Invalid booking room id'
                });
            }

            const bookingRoom =
                await BookingRoomService.update(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message:
                    'Booking room updated successfully',
                data: bookingRoom
            });

        } catch (error: any) {

            if (
                error.message ===
                'Booking room not found'
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message.includes('required') ||
                error.message.includes('must') ||
                error.message.includes('cannot') ||
                error.message.includes('Invalid')
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.number === 547) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Booking or room type does not exist'
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
                    message: 'Invalid booking room id'
                });
            }

            await BookingRoomService.delete(id);

            return res.status(200).json({
                success: true,
                message:
                    'Booking room deleted successfully'
            });

        } catch (error: any) {

            if (
                error.message ===
                'Booking room not found'
            ) {
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