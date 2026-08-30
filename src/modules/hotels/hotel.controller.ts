import {
    Request,
    Response,
} from "express";
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as hotelService
    from "./hotel.service";


// ========================================
// CREATE
// ========================================

export const createHotel = async (
    req: Request,
    res: Response
) => {

    try {

        const hotel =
            await hotelService.createHotel(
                req.body
            );

        return res.status(201).json({
            message:
                "Tạo hotel thành công",
            hotel,
        });

    } catch (error) {

        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra",
        });
    }
};


// ========================================
// GET ALL
// ========================================

export const getHotels = async (
    req: Request,
    res: Response
) => {

    try {

        const hotels =
            await hotelService.getHotels();

        return res.status(200).json({
            hotels,
        });

    } catch (error) {

        return res.status(500).json({
            message:
                "Không thể lấy danh sách hotel",
        });
    }
};


// ========================================
// GET OVERVIEW - VIEW
// ========================================

export const getHotelOverview = async (
    req: Request,
    res: Response
) => {

    try {

        const hotels =
            await hotelService.getHotelOverview();

        return res.status(200).json({
            hotels,
        });

    } catch (error) {

        return res.status(500).json({
            message:
                "Không thể lấy tổng quan hotel",
        });
    }
};


// ========================================
// GET REVENUE - VIEW
// ========================================

export const getHotelRevenue = async (
    req: Request,
    res: Response
) => {

    try {

        const revenue =
            await hotelService.getHotelRevenue();

        return res.status(200).json({
            revenue,
        });

    } catch (error) {

        return res.status(500).json({
            message:
                "Không thể lấy doanh thu hotel",
        });
    }
};


// ========================================
// GET BY ID
// ========================================

export const getHotelById = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message:
                    "ID hotel không hợp lệ",
            });
        }

        const hotel =
            await hotelService.getHotelById(
                id
            );

        return res.status(200).json({
            hotel,
        });

    } catch (error) {

        return res.status(404).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Hotel không tồn tại",
        });
    }
};


// ========================================
// UPDATE
// ========================================

export const updateHotel = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message:
                    "ID hotel không hợp lệ",
            });
        }

        const hotel =
            await hotelService.updateHotel(
                id,
                req.body
            );

        return res.status(200).json({
            message:
                "Cập nhật hotel thành công",
            hotel,
        });

    } catch (error) {

        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật hotel",
        });
    }
};


// ========================================
// DELETE
// ========================================

export const deleteHotel = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message:
                    "ID hotel không hợp lệ",
            });
        }

        const result =
            await hotelService.deleteHotel(
                id
            );

        return res.status(200).json(
            result
        );

    } catch (error) {

        return res.status(404).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Không thể xóa hotel",
        });
    }
};


// ========================================
// UPDATE STATUS
// ========================================

export const updateHotelStatus = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            Number(req.params.id);

        const {
            status,
        } = req.body;

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message:
                    "ID hotel không hợp lệ",
            });
        }

        const hotel =
            await hotelService.updateHotelStatus(
                id,
                status
            );

        return res.status(200).json({
            message:
                "Cập nhật trạng thái thành công",
            hotel,
        });

    } catch (error) {

        return res.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật trạng thái",
        });
    }
};

// ========================================
// GET BEST COMBOS
// ========================================

export const getBestCombos = async (
    req: Request,
    res: Response
) => {

    try {

        const hotels =
            await hotelService.getBestCombos();

        return res.status(200).json({
            hotels
        });

    } catch (error) {

        console.error(
            "GET BEST COMBOS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Không thể lấy danh sách combo tốt nhất"
        });
    }
};

// ========================================
// GET MY HOTEL (dành cho role hotel)
// ========================================

export const getMyHotel = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const hotelId = req.user?.hotelId;

        if (!hotelId) {
            return res.status(400).json({
                message: "Tài khoản chưa được gắn với khách sạn nào",
            });
        }

        const hotel =
            await hotelService.getHotelById(hotelId);

        return res.status(200).json({
            hotel,
        });

    } catch (error) {

        return res.status(404).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Hotel không tồn tại",
        });
    }
};