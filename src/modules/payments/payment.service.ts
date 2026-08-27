import { PaymentModel } from './payment.model';

export class PaymentService {

    static async createPayment(data: {
        booking_id: number;
        payment_method: string;
        transaction_code?: string | null;
        amount: number;
    }) {
        return await PaymentModel.createPayment(data);
    }


    static async getPayments() {

        return await PaymentModel.getPayments();
    }


    static async getPaymentById(id: number) {

        const payment =
            await PaymentModel.getPaymentById(id);

        if (!payment) {
            throw new Error('Payment không tồn tại');
        }

        return payment;
    }


    static async updatePayment(
        id: number,
        data: {
            payment_method?: string;
            transaction_code?: string | null;
        }
    ) {

        const payment =
            await PaymentModel.updatePayment(id, data);

        if (!payment) {
            throw new Error('Payment không tồn tại');
        }

        return payment;
    }


    static async deletePayment(id: number) {

        const payment =
            await PaymentModel.deletePayment(id);

        if (!payment) {
            throw new Error('Payment không tồn tại');
        }

        return payment;
    }
}