import { BookingModel } from './booking.model';

const ALLOWED_STATUS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export const BookingService = {

    async getAll() {
        return await BookingModel.getAll();
    },

    async getByHotelId(hotelId: number) {

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error('Hotel ID không hợp lệ');
        }

        return await BookingModel.getByHotelId(hotelId);
    },

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
    }
};

export { ALLOWED_STATUS };