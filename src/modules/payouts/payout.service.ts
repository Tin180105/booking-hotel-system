import { PayoutModel } from './payout.model';

export class PayoutService {

    static async createPayout(data: {
        hotel_id: number;
        payout_code: string;
    }) {

        return await PayoutModel.createPayout(data);
    }


    static async getPayouts() {

        return await PayoutModel.getPayouts();
    }


    static async getPayoutById(id: number) {

        const payout =
            await PayoutModel.getPayoutById(id);

        if (!payout) {
            throw new Error('Payout không tồn tại');
        }

        return payout;
    }


    static async updatePayout(
        id: number,
        data: {
            status?: string;
            payout_date?: string | null;
        }
    ) {

        const payout =
            await PayoutModel.updatePayout(
                id,
                data
            );

        if (!payout) {
            throw new Error('Payout không tồn tại');
        }

        return payout;
    }


    static async deletePayout(id: number) {

        const payout =
            await PayoutModel.deletePayout(id);

        if (!payout) {
            throw new Error('Payout không tồn tại');
        }

        return payout;
    }

    // thêm vào trong class PayoutService

    static async getByHotelId(hotelId: number) {

        if (!Number.isInteger(hotelId) || hotelId <= 0) {
            throw new Error('Hotel ID không hợp lệ');
        }

        return await PayoutModel.getByHotelId(hotelId);
    }

    static async confirmReceived(id: number, hotelId: number) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Payout ID không hợp lệ');
    }

    const payout = await PayoutModel.getPayoutById(id);
    if (!payout) throw new Error('Payout không tồn tại');

    if (Number(payout.hotel_id) !== Number(hotelId)) {
        throw new Error('Bạn không có quyền xác nhận payout này');
    }

    if (payout.status !== 'PAID') {
        throw new Error('Chỉ có thể xác nhận payout đang ở trạng thái "Đã chi trả"');
    }

    const updated = await PayoutModel.confirmReceived(id);
    if (!updated) {
        throw new Error('Payout đã bị thay đổi trạng thái, vui lòng tải lại trang');
    }
    return updated;
}
}