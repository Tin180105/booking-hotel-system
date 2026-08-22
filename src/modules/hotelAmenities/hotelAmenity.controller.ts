import { Request, Response } from "express";
import { HotelAmenityService } from "./hotelAmenity.service";

export const HotelAmenityController = {

    // GET /api/hotel-amenities/hotel/:hotelId
    async getByHotelId(
        req: Request,
        res: Response
    ) {

        try {

            const hotelId =
                Number(req.params.hotelId);

            const data =
                await HotelAmenityService.getByHotelId(
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


    // POST /api/hotel-amenities
    async create(
        req: Request,
        res: Response
    ) {

        try {

            const {
                hotel_id,
                amenity_id
            } = req.body;


            const data =
                await HotelAmenityService.create(
                    Number(hotel_id),
                    Number(amenity_id)
                );


            return res.status(201).json({
                success: true,
                message: "Thêm tiện nghi cho hotel thành công",
                data
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },


    // DELETE /api/hotel-amenities
    async delete(
        req: Request,
        res: Response
    ) {

        try {

            const {
                hotel_id,
                amenity_id
            } = req.body;


            await HotelAmenityService.delete(
                Number(hotel_id),
                Number(amenity_id)
            );


            return res.status(200).json({
                success: true,
                message: "Xóa tiện nghi khỏi hotel thành công"
            });

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};