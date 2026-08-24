import { Request, Response } from 'express';
import { RoomTypeService } from './roomType.service';

export const RoomTypeController = {

    // ========================================
    // GET OVERVIEW
    // ========================================

    async getOverview(
        req: Request,
        res: Response
    ) {

        try {

            const data =
                await RoomTypeService.getOverview();

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

    // ========================================
    // GET ALL
    // ========================================

    async getAll(
        req: Request,
        res: Response
    ) {

        try {

            const data =
                await RoomTypeService.getAll();

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


    // ========================================
    // GET BY HOTEL
    // ========================================

    async getByHotelId(
        req: Request,
        res: Response
    ) {

        try {

            const hotelId =
                Number(req.params.hotelId);

            const data =
                await RoomTypeService.getByHotelId(
                    hotelId
                );

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


    // ========================================
    // GET BY ID
    // ========================================

    async getById(
        req: Request,
        res: Response
    ) {

        try {

            const id =
                Number(req.params.id);

            const data =
                await RoomTypeService.getById(id);

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


    // ========================================
    // CREATE
    // ========================================

    async create(
        req: Request,
        res: Response
    ) {

        try {

            const {
                hotel_id,
                name,
                capacity,
                total_rooms,
                base_price,
                description
            } = req.body;


            const data =
                await RoomTypeService.create(
                    Number(hotel_id),
                    name,
                    Number(capacity),
                    Number(total_rooms),
                    Number(base_price),
                    description
                );


            return res.status(201).json({
                success: true,
                message:
                    'Tạo loại phòng thành công',
                data
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },


    // ========================================
    // UPDATE
    // ========================================

    async update(
        req: Request,
        res: Response
    ) {

        try {

            const id =
                Number(req.params.id);

            const {
                name,
                capacity,
                total_rooms,
                base_price,
                description
            } = req.body;


            const data =
                await RoomTypeService.update(
                    id,
                    name,
                    Number(capacity),
                    Number(total_rooms),
                    Number(base_price),
                    description
                );


            return res.status(200).json({
                success: true,
                message:
                    'Cập nhật loại phòng thành công',
                data
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },


    // ========================================
    // DELETE
    // ========================================

    async delete(
        req: Request,
        res: Response
    ) {

        try {

            const id =
                Number(req.params.id);

            await RoomTypeService.delete(id);

            return res.status(200).json({
                success: true,
                message:
                    'Xóa loại phòng thành công'
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};