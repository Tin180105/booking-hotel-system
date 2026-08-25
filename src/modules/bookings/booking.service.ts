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

        if (!data.booking_code || data.booking_code.trim() === '') {
            throw new Error('Booking code is required');
        }

        if (data.total_amount !== undefined &&
            data.total_amount < 0) {
            throw new Error('Total amount cannot be negative');
        }

        if (data.commission_amount !== undefined &&
            data.commission_amount < 0) {
            throw new Error('Commission amount cannot be negative');
        }

        if (data.final_amount !== undefined &&
            data.final_amount < 0) {
            throw new Error('Final amount cannot be negative');
        }

        const status = (
            data.status ?? 'PENDING'
        ).toUpperCase();

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

        return await BookingModel.create({
            ...data,
            booking_code: data.booking_code.trim().toUpperCase(),
            status
        });
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