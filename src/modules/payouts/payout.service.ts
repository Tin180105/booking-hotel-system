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
}