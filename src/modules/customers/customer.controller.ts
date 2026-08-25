import { Request, Response } from 'express';
import { CustomerService } from './customer.service';

export class CustomerController {

    // ==========================================
    // GET ALL
    // ==========================================

    static async getAll(
        req: Request,
        res: Response
    ) {
        try {

            const data =
                await CustomerService.getAll();

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            console.error(
                'Get customers error:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    'Failed to get customers'
            });
        }
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    static async getById(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer ID'
                });
            }

            const data =
                await CustomerService.getById(id);

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error: any) {

            return res.status(404).json({
                success: false,
                message:
                    error.message ||
                    'Customer not found'
            });
        }
    }


    // ==========================================
    // CREATE
    // ==========================================

    static async create(
        req: Request,
        res: Response
    ) {
        try {

            const data =
                await CustomerService.create(
                    req.body
                );

            return res.status(201).json({
                success: true,
                message:
                    'Customer created successfully',
                data
            });

        } catch (error: any) {

            console.error(
                'Create customer error:',
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    'Failed to create customer'
            });
        }
    }


    // ==========================================
    // UPDATE
    // ==========================================

    static async update(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer ID'
                });
            }

            const data =
                await CustomerService.update(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message:
                    'Customer updated successfully',
                data
            });

        } catch (error: any) {

            console.error(
                'Update customer error:',
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    'Failed to update customer'
            });
        }
    }


    // ==========================================
    // DELETE
    // ==========================================

    static async delete(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Invalid customer ID'
                });
            }

            await CustomerService.delete(id);

            return res.status(200).json({
                success: true,
                message:
                    'Customer deleted successfully'
            });

        } catch (error: any) {

            console.error(
                'Delete customer error:',
                error
            );

            return res.status(404).json({
                success: false,
                message:
                    error.message ||
                    'Failed to delete customer'
            });
        }
    }
}