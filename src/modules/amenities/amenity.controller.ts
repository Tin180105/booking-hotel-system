import { Request, Response } from "express";
import { AmenityService } from "./amenity.service";

export const AmenityController = {

    // GET /api/amenities
    async getAll(req: Request, res: Response) {

        try {

            const amenities = await AmenityService.getAll();

            return res.status(200).json({
                success: true,
                data: amenities
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // GET /api/amenities/:id
    async getById(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            const amenity =
                await AmenityService.getById(id);

            return res.status(200).json({
                success: true,
                data: amenity
            });

        } catch (error: any) {

            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    // POST /api/amenities
    async create(req: Request, res: Response) {

        try {

            const { name, icon_code } = req.body;

            const amenity =
                await AmenityService.create(
                    name,
                    icon_code
                );

            return res.status(201).json({
                success: true,
                message: "Tạo tiện nghi thành công",
                data: amenity
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // PUT /api/amenities/:id
    async update(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            const { name, icon_code } = req.body;

            const amenity =
                await AmenityService.update(
                    id,
                    name,
                    icon_code
                );

            return res.status(200).json({
                success: true,
                message: "Cập nhật tiện nghi thành công",
                data: amenity
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // DELETE /api/amenities/:id
    async delete(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            await AmenityService.delete(id);

            return res.status(200).json({
                success: true,
                message: "Xóa tiện nghi thành công"
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};