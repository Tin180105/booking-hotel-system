import { WishlistModel } from './wishlist.model';

export class WishlistService {

    // ==========================================
    // GET ALL
    // ==========================================

    static async getAll() {
        return await WishlistModel.getAll();
    }


    // ==========================================
    // GET ONE
    // ==========================================

    static async getOne(
        customerId: number,
        hotelId: number
    ) {
        const wishlist =
            await WishlistModel.getOne(
                customerId,
                hotelId
            );

        if (!wishlist) {
            throw new Error(
                'Wishlist not found'
            );
        }

        return wishlist;
    }


    // ==========================================
    // GET BY CUSTOMER
    // ==========================================

    static async getByCustomer(
        customerId: number
    ) {
        return await WishlistModel.getByCustomer(
            customerId
        );
    }


    // ==========================================
    // GET BY HOTEL
    // ==========================================

    static async getByHotel(
        hotelId: number
    ) {
        return await WishlistModel.getByHotel(
            hotelId
        );
    }


    // ==========================================
    // CREATE
    // ==========================================

    static async create(
        customerId: number,
        hotelId: number
    ) {

        // Kiểm tra wishlist đã tồn tại chưa
        const existing =
            await WishlistModel.getOne(
                customerId,
                hotelId
            );

        if (existing) {
            throw new Error(
                'Hotel is already in wishlist'
            );
        }

        return await WishlistModel.create(
            customerId,
            hotelId
        );
    }


    // ==========================================
    // UPDATE
    // ==========================================

    static async update(
        customerId: number,
        oldHotelId: number,
        newHotelId: number
    ) {

        if (oldHotelId === newHotelId) {
            throw new Error(
                'New hotel must be different from old hotel'
            );
        }

        // Kiểm tra wishlist cũ
        const existing =
            await WishlistModel.getOne(
                customerId,
                oldHotelId
            );

        if (!existing) {
            throw new Error(
                'Wishlist not found'
            );
        }

        // Không cho đổi sang hotel đã có trong wishlist
        const duplicate =
            await WishlistModel.getOne(
                customerId,
                newHotelId
            );

        if (duplicate) {
            throw new Error(
                'New hotel is already in wishlist'
            );
        }

        return await WishlistModel.update(
            customerId,
            oldHotelId,
            newHotelId
        );
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(
        customerId: number,
        hotelId: number
    ) {

        const existing =
            await WishlistModel.getOne(
                customerId,
                hotelId
            );

        if (!existing) {
            throw new Error(
                'Wishlist not found'
            );
        }

        await WishlistModel.delete(
            customerId,
            hotelId
        );

        return true;
    }
}