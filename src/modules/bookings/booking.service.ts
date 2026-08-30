import {
    BookingModel,
    CreateBookingDTO,
    UpdateBookingDTO
} from './booking.model';

const ALLOWED_STATUS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export const BookingService = {

    // =========================
    // GET ALL
    // =========================
    async getAll() {
        return await BookingModel.getAll();
    },

    // =========================
    // GET OVERVIEW
    // =========================
    async getOverview() {
        return await BookingModel.getOverview();
    },

    // =========================
    // GET BY HOTEL
    // =========================
    async getByHotelId(hotelId: number) {

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error('Hotel ID không hợp lệ');
        }

        return await BookingModel.getByHotelId(hotelId);
    },

    // =========================
    // GET BY ID
    // =========================
    async getById(id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Booking ID không hợp lệ');
        }

        const booking = await BookingModel.getById(id);

        if (!booking) {
            throw new Error('Không tìm thấy booking');
        }

        return booking;
    },

    // =========================
    // CREATE
    // =========================
    async create(data: CreateBookingDTO) {

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
            throw new Error(
                'Check-in and check-out are required'
            );
        }

        if (
            new Date(data.check_out) <=
            new Date(data.check_in)
        ) {
            throw new Error(
                'Check-out must be greater than check-in'
            );
        }

        return await BookingModel.create(data);
    },

    // =========================
    // UPDATE (sửa toàn bộ)
    // =========================
    async update(
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

        if (!ALLOWED_STATUS.includes(status)) {
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
    },

    // =========================
    // UPDATE STATUS (chỉ đổi trạng thái)
    // =========================
    async updateStatus(id: number, status: string) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Booking ID không hợp lệ');
        }

        if (!ALLOWED_STATUS.includes(status)) {
            throw new Error(
                `Trạng thái không hợp lệ. Cho phép: ${ALLOWED_STATUS.join(', ')}`
            );
        }

        const existing = await BookingModel.getById(id);

        if (!existing) {
            throw new Error('Không tìm thấy booking');
        }

        return await BookingModel.updateStatus(id, status);
    },

    // =========================
    // DELETE
    // =========================
    async delete(id: number) {

        const existingBooking =
            await BookingModel.getById(id);

        if (!existingBooking) {
            throw new Error('Booking not found');
        }

        return await BookingModel.delete(id);
    },

    async getByCustomerId(customerId: number) {
  if (!Number.isInteger(customerId) || customerId <= 0) {
    throw new Error('Customer ID không hợp lệ');
  }
  return await BookingModel.getByCustomerId(customerId);
}
};

export { ALLOWED_STATUS };