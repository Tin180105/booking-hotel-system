import { Request, Response } from 'express';
import { RoomTypeImageService } from './roomTypeImage.service';

export const RoomTypeImageController = {

    // ========================================
    // GET ALL
    // ========================================

    async getAll(
        req: Request,
        res: Response
    ) {

        try {

            const data =
                await RoomTypeImageService.getAll();

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
    // GET BY ROOM TYPE
    // ========================================

    async getByRoomTypeId(
        req: Request,
        res: Response
    ) {

        try {

            const roomTypeId =
                Number(req.params.roomTypeId);

            const data =
                await RoomTypeImageService
                    .getByRoomTypeId(roomTypeId);

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
                await RoomTypeImageService
                    .getById(id);

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
                room_type_id,
                image_url,
                is_thumbnail
            } = req.body;


            const data =
                await RoomTypeImageService.create(
                    Number(room_type_id),
                    image_url,
                    Boolean(is_thumbnail)
                );


            return res.status(201).json({
                success: true,
                message:
                    'Thêm hình ảnh loại phòng thành công',
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
                image_url,
                is_thumbnail
            } = req.body;


            const data =
                await RoomTypeImageService.update(
                    id,
                    image_url,
                    Boolean(is_thumbnail)
                );


            return res.status(200).json({
                success: true,
                message:
                    'Cập nhật hình ảnh thành công',
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

            await RoomTypeImageService.delete(id);

            return res.status(200).json({
                success: true,
                message:
                    'Xóa hình ảnh thành công'
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};