import {
    BookingRoomModel,
    CreateBookingRoomDTO,
    UpdateBookingRoomDTO
} from './bookingRoom.model';

export class BookingRoomService {

    // =========================
    // GET ALL
    // =========================
    static async getAll() {
        return await BookingRoomModel.getAll();
    }

    // =========================
    // GET BY ID
    // =========================
    static async getById(id: number) {

        const bookingRoom =
            await BookingRoomModel.getById(id);

        if (!bookingRoom) {
            throw new Error('Booking room not found');
        }

        return bookingRoom;
    }

    // =========================
    // GET BY BOOKING ID
    // =========================
    static async getByBookingId(
        bookingId: number
    ) {

        return await BookingRoomModel.getByBookingId(
            bookingId
        );
    }

    // =========================
    // CREATE
    // =========================
    static async create(
        data: CreateBookingRoomDTO
    ) {

        if (!data.booking_id || data.booking_id <= 0) {
            throw new Error(
                'Valid booking_id is required'
            );
        }

        if (!data.room_type_id || data.room_type_id <= 0) {
            throw new Error(
                'Valid room_type_id is required'
            );
        }

        const quantity = data.quantity ?? 1;

        if (quantity <= 0) {
            throw new Error(
                'Quantity must be greater than 0'
            );
        }

        if (data.total_room_price < 0) {
            throw new Error(
                'Total room price cannot be negative'
            );
        }

        const checkIn =
            new Date(data.expected_check_in);

        const checkOut =
            new Date(data.expected_check_out);

        if (
            isNaN(checkIn.getTime()) ||
            isNaN(checkOut.getTime())
        ) {
            throw new Error(
                'Invalid check-in or check-out date'
            );
        }

        if (checkOut <= checkIn) {
            throw new Error(
                'Expected check-out must be greater than check-in'
            );
        }

        return await BookingRoomModel.create({
            ...data,
            quantity,
            expected_check_in: checkIn,
            expected_check_out: checkOut
        });
    }

    // =========================
    // UPDATE
    // =========================
    static async update(
        id: number,
        data: UpdateBookingRoomDTO
    ) {

        const existingBookingRoom =
            await BookingRoomModel.getById(id);

        if (!existingBookingRoom) {
            throw new Error(
                'Booking room not found'
            );
        }

        if (!data.booking_id || data.booking_id <= 0) {
            throw new Error(
                'Valid booking_id is required'
            );
        }

        if (!data.room_type_id || data.room_type_id <= 0) {
            throw new Error(
                'Valid room_type_id is required'
            );
        }

        if (data.quantity <= 0) {
            throw new Error(
                'Quantity must be greater than 0'
            );
        }

        if (data.total_room_price < 0) {
            throw new Error(
                'Total room price cannot be negative'
            );
        }

        const checkIn =
            new Date(data.expected_check_in);

        const checkOut =
            new Date(data.expected_check_out);

        if (
            isNaN(checkIn.getTime()) ||
            isNaN(checkOut.getTime())
        ) {
            throw new Error(
                'Invalid check-in or check-out date'
            );
        }

        if (checkOut <= checkIn) {
            throw new Error(
                'Expected check-out must be greater than check-in'
            );
        }

        return await BookingRoomModel.update(id, {
            ...data,
            expected_check_in: checkIn,
            expected_check_out: checkOut
        });
    }

    // =========================
    // DELETE
    // =========================
    static async delete(id: number) {

        const existingBookingRoom =
            await BookingRoomModel.getById(id);

        if (!existingBookingRoom) {
            throw new Error(
                'Booking room not found'
            );
        }

        return await BookingRoomModel.delete(id);
    }

    // =========================
    // CALCULATE STAY DAYS
    // =========================
    static async calculateStayDays(
        checkIn: string,
        checkOut: string
    ) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (
            isNaN(checkInDate.getTime()) ||
            isNaN(checkOutDate.getTime())
        ) {
            throw new Error(
                'Invalid check-in or check-out date'
            );
        }

        if (checkOutDate <= checkInDate) {
            throw new Error(
                'Check-out must be greater than check-in'
            );
        }

        return await BookingRoomModel.calculateStayDays(
            checkInDate,
            checkOutDate
        );
    }

        // =========================
        // CALCULATE ROOM PRICE
        // =========================
    static async calculateRoomPrice(
        roomTypeId: number,
        checkIn: string,
        checkOut: string,
        quantity: number
    ) {

        if (!roomTypeId || roomTypeId <= 0) {
            throw new Error(
                'Valid room_type_id is required'
            );
        }

        if (!quantity || quantity <= 0) {
            throw new Error(
                'Quantity must be greater than 0'
            );
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (
            isNaN(checkInDate.getTime()) ||
            isNaN(checkOutDate.getTime())
        ) {
            throw new Error(
                'Invalid check-in or check-out date'
            );
        }

        if (checkOutDate <= checkInDate) {
            throw new Error(
                'Check-out must be greater than check-in'
            );
        }

        return await BookingRoomModel.calculateRoomPrice(
            roomTypeId,
            checkInDate,
            checkOutDate,
            quantity
        );
    }
}