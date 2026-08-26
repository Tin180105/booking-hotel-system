import {
    BookingModel,
    CreateBookingDTO,
    UpdateBookingDTO
} from './booking.model';

export class BookingService {

    // =========================
    // GET ALL
    // =========================
    static async getAll() {
        return await BookingModel.getAll();
    }

    // =========================
    // GET OVERVIEW
    // =========================
    static async getOverview() {
        return await BookingModel.getOverview();
    }

    // =========================
    // GET BY ID
    // =========================
    static async getById(id: number) {

        const booking = await BookingModel.getById(id);

        if (!booking) {
            throw new Error('Booking not found');
        }

        return booking;
    }

    // =========================
    // CREATE
    // =========================
    static async create(data: CreateBookingDTO) {

        if (!data.hotel_id || data.hotel_id <= 0) {
            throw new Error('Valid hotel_id is required');
        }

        if (!data.customer_id || data.customer_id <= 0) {
            throw new Error('Valid customer_id is required');
        }

        if (!data.room_type_id || data.room_type_id <= 0) {
            throw new Error('Valid room_type_id is required');
        }

        if (!data.quantity || data.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        if (!data.check_in || !data.check_out) {
            throw new Error('Check-in and check-out are required');
        }

        if (Number.isNaN(Date.parse(String(data.check_in))) ||
            Number.isNaN(Date.parse(String(data.check_out))) ||
            new Date(data.check_out) <= new Date(data.check_in)) {
            throw new Error('Check-out must be later than check-in');
        }

        return await BookingModel.create(data);
    }

    // =========================
    // UPDATE
    // =========================
    static async update(
        id: number,
        data: UpdateBookingDTO
    ) {

        const existingBooking =
            await BookingModel.getById(id);

        if (!existingBooking) {
            throw new Error('Booking not found');
        }

        if (!data.hotel_id || data.hotel_id <= 0) {
            throw new Error('Valid hotel_id is required');
        }

        if (!data.customer_id || data.customer_id <= 0) {
            throw new Error('Valid customer_id is required');
        }

        if (!data.booking_code ||
            data.booking_code.trim() === '') {
            throw new Error('Booking code is required');
        }

        if (data.total_amount < 0) {
            throw new Error(
                'Total amount cannot be negative'
            );
        }

        if (data.commission_amount < 0) {
            throw new Error(
                'Commission amount cannot be negative'
            );
        }

        if (data.final_amount < 0) {
            throw new Error(
                'Final amount cannot be negative'
            );
        }

        const status = data.status.toUpperCase();

        const allowedStatuses = [
            'PENDING',
            'CONFIRMED',
            'CANCELLED',
            'COMPLETED'
        ];

        if (!allowedStatuses.includes(status)) {
            throw new Error(
                'Invalid booking status'
            );
        }

        return await BookingModel.update(id, {
            ...data,
            booking_code: data.booking_code
                .trim()
                .toUpperCase(),
            status
        });
    }

    // =========================
    // DELETE
    // =========================
    static async delete(id: number) {

        const existingBooking =
            await BookingModel.getById(id);

        if (!existingBooking) {
            throw new Error('Booking not found');
        }

        return await BookingModel.delete(id);
    }
}