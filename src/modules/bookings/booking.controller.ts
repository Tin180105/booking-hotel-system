import { Request, Response } from 'express';
import { BookingService } from './booking.service';

export const BookingController = {

    // GET /api/bookings
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


    // GET /api/bookings/hotel/:hotelId
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


    // GET /api/bookings/:id
    async getById(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            const data = await BookingService.getById(id);

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },


    // PATCH /api/bookings/:id/status
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
    }
};