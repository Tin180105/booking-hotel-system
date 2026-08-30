import { Request, Response } from 'express';
import { BookingService } from './booking.service';

export const BookingController = {

    // =========================
    // GET ALL
    // =========================
    async getAll(req: Request, res: Response) {

        try {

            const data = await BookingService.getAll();

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },


    // =========================
    // GET OVERVIEW
    // =========================
    async getOverview(req: Request, res: Response) {

        try {

            const data = await BookingService.getOverview();

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },


    // =========================
    // GET BY HOTEL
    // =========================
    async getByHotelId(req: Request, res: Response) {

        try {

            const hotelId = Number(req.params.hotelId);

            const data = await BookingService.getByHotelId(hotelId);

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },


    // =========================
    // GET BY ID
    // =========================
    async getById(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid booking id'
                });
            }

            const data = await BookingService.getById(id);

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            if (error.message === 'Booking not found' || error.message === 'Không tìm thấy booking') {
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
    },


    // =========================
    // CREATE
    // =========================
    async create(req: Request, res: Response) {

        try {
            const booking = await BookingService.create(req.body);

            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: booking
            });

        } catch (error: any) {

            // TRIGGER BOOKING OVERLAP
            if (
                error.number === 50000 &&
                error.message?.includes('trùng')
            ) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            // VALIDATION
            if (
                error.message?.includes('required') ||
                error.message?.includes('Valid') ||
                error.message?.includes('cannot') ||
                error.message?.includes('Invalid')
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

            // FOREIGN KEY
            if (error.number === 547) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Hotel, customer, room type or promotion does not exist'
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },


    // =========================
    // UPDATE
    // =========================
    async update(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid booking id'
                });
            }

            const booking = await BookingService.update(id, req.body);

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
    },


    // =========================
    // UPDATE STATUS
    // =========================
    async updateStatus(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);
            const { status } = req.body;

            const data = await BookingService.updateStatus(id, status);

            return res.status(200).json({
                success: true,
                message: 'Cập nhật trạng thái booking thành công',
                data
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },


    // =========================
    // DELETE
    // =========================
    async delete(req: Request, res: Response) {

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
    },

    async getByCustomerId(req: Request, res: Response) {
  try {
    const customerId = Number(req.params.customerId);
    const data = await BookingService.getByCustomerId(customerId);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
};