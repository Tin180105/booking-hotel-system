import { CustomerModel } from './customer.model';

export class CustomerService {

    // GET ALL
    static async getAll() {
        return await CustomerModel.getAll();
    }


    // GET BY ID
    static async getById(id: number) {
        const customer =
            await CustomerModel.getById(id);

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer;
    }


    // CREATE
    static async create(data: {
        full_name: string;
        phone: string;
        email: string;
        password_hash: string;
    }) {

        if (!data.full_name?.trim()) {
            throw new Error(
                'Full name is required'
            );
        }

        if (!data.phone?.trim()) {
            throw new Error(
                'Phone is required'
            );
        }

        if (!data.email?.trim()) {
            throw new Error(
                'Email is required'
            );
        }

        if (!data.password_hash?.trim()) {
            throw new Error(
                'Password is required'
            );
        }

        const existingCustomer =
            await CustomerModel.getByEmail(
                data.email
            );

        if (existingCustomer) {
            throw new Error(
                'Email already exists'
            );
        }

        return await CustomerModel.create(data);
    }


    // UPDATE
    static async update(
        id: number,
        data: {
            full_name?: string;
            phone?: string;
            email?: string;
            password_hash?: string;
        }
    ) {

        const existingCustomer =
            await CustomerModel.getById(id);

        if (!existingCustomer) {
            throw new Error(
                'Customer not found'
            );
        }

        if (
            data.full_name !== undefined &&
            !data.full_name.trim()
        ) {
            throw new Error(
                'Full name cannot be empty'
            );
        }

        if (
            data.phone !== undefined &&
            !data.phone.trim()
        ) {
            throw new Error(
                'Phone cannot be empty'
            );
        }

        if (
            data.email !== undefined &&
            !data.email.trim()
        ) {
            throw new Error(
                'Email cannot be empty'
            );
        }

        if (data.email !== undefined) {
            const customerWithEmail =
                await CustomerModel.getByEmail(
                    data.email
                );

            if (
                customerWithEmail &&
                customerWithEmail.id !== id
            ) {
                throw new Error(
                    'Email already exists'
                );
            }
        }

        return await CustomerModel.update(
            id,
            data
        );
    }


    // DELETE
    static async delete(id: number) {

        const existingCustomer =
            await CustomerModel.getById(id);

        if (!existingCustomer) {
            throw new Error(
                'Customer not found'
            );
        }

        await CustomerModel.delete(id);

        return true;
    }
}