import { Request, Response } from 'express';
import { WishlistService } from './wishlist.service';

export class WishlistController {

    // ==========================================
    // GET ALL
    // ==========================================

    static async getAll(
        req: Request,
        res: Response
    ) {
        try {

            const data =
                await WishlistService.getAll();

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            console.error(
                'Get wishlists error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    'Failed to get wishlists'
            });
        }
    }


    // ==========================================
    // GET ONE
    // ==========================================

    static async getOne(
        req: Request,
        res: Response
    ) {
        try {

            const customerId =
                Number(req.params.customerId);

            const hotelId =
                Number(req.params.hotelId);

            if (
                isNaN(customerId) ||
                isNaN(hotelId)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer ID or hotel ID'
                });
            }

            const data =
                await WishlistService.getOne(
                    customerId,
                    hotelId
                );

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            return res.status(404).json({
                success: false,
                message:
                    error.message ||
                    'Wishlist not found'
            });
        }
    }


    // ==========================================
    // GET BY CUSTOMER
    // ==========================================

    static async getByCustomer(
        req: Request,
        res: Response
    ) {
        try {

            const customerId =
                Number(req.params.customerId);

            if (isNaN(customerId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer ID'
                });
            }

            const data =
                await WishlistService.getByCustomer(
                    customerId
                );

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            console.error(
                'Get customer wishlist error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    'Failed to get wishlist'
            });
        }
    }


    // ==========================================
    // GET BY HOTEL
    // ==========================================

    static async getByHotel(
        req: Request,
        res: Response
    ) {
        try {

            const hotelId =
                Number(req.params.hotelId);

            if (isNaN(hotelId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid hotel ID'
                });
            }

            const data =
                await WishlistService.getByHotel(
                    hotelId
                );

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            console.error(
                'Get hotel wishlist error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    'Failed to get wishlist'
            });
        }
    }


    // ==========================================
    // CREATE
    // ==========================================

    static async create(
        req: Request,
        res: Response
    ) {
        try {

            const {
                customer_id,
                hotel_id
            } = req.body;

            if (
                customer_id === undefined ||
                hotel_id === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'customer_id and hotel_id are required'
                });
            }

            const customerId =
                Number(customer_id);

            const hotelId =
                Number(hotel_id);

            if (
                isNaN(customerId) ||
                isNaN(hotelId)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer_id or hotel_id'
                });
            }

            const data =
                await WishlistService.create(
                    customerId,
                    hotelId
                );

            return res.status(201).json({
                success: true,
                message:
                    'Hotel added to wishlist successfully',
                data
            });

        } catch (error: any) {

            console.error(
                'Create wishlist error:',
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    'Failed to add hotel to wishlist'
            });
        }
    }


    // ==========================================
    // UPDATE
    // ==========================================

    static async update(
        req: Request,
        res: Response
    ) {
        try {

            const customerId =
                Number(req.params.customerId);

            const oldHotelId =
                Number(req.params.hotelId);

            const {
                new_hotel_id
            } = req.body;

            if (
                isNaN(customerId) ||
                isNaN(oldHotelId)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer ID or hotel ID'
                });
            }

            if (new_hotel_id === undefined) {
                return res.status(400).json({
                    success: false,
                    message:
                        'new_hotel_id is required'
                });
            }

            const newHotelId =
                Number(new_hotel_id);

            if (isNaN(newHotelId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid new hotel ID'
                });
            }

            const data =
                await WishlistService.update(
                    customerId,
                    oldHotelId,
                    newHotelId
                );

            return res.status(200).json({
                success: true,
                message:
                    'Wishlist updated successfully',
                data
            });

        } catch (error: any) {

            console.error(
                'Update wishlist error:',
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    'Failed to update wishlist'
            });
        }
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(
        req: Request,
        res: Response
    ) {
        try {

            const customerId =
                Number(req.params.customerId);

            const hotelId =
                Number(req.params.hotelId);

            if (
                isNaN(customerId) ||
                isNaN(hotelId)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer ID or hotel ID'
                });
            }

            await WishlistService.delete(
                customerId,
                hotelId
            );

            return res.status(200).json({
                success: true,
                message:
                    'Hotel removed from wishlist successfully'
            });

        } catch (error: any) {

            console.error(
                'Delete wishlist error:',
                error
            );

            return res.status(404).json({
                success: false,
                message:
                    error.message ||
                    'Failed to remove wishlist'
            });
        }
    }
}