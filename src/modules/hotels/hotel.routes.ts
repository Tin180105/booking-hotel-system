import {
    Router,
} from "express";

import {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    updateHotelStatus,
    getHotelOverview,
    getHotelRevenue,
} from "./hotel.controller";

import {
    authenticateJWT as auth,
    role
} from '../../middlewares/auth.middleware';

const router = Router();


// ========================================
// HOTEL ROUTES
// ========================================

// Xem danh sách khách sạn
router.get(
    "/",
    getHotels
);

// Xem tổng quan khách sạn từ VIEW
router.get(
    "/overview",
    getHotelOverview
);

// Xem doanh thu khách sạn từ VIEW
router.get(
    "/revenue",
    getHotelRevenue
);

// Xem khách sạn theo ID
router.get(
    "/:id",
    getHotelById
);


// ========================================
// ADMIN / HOTEL
// ========================================

// Tạo khách sạn
router.post(
    "/",
    auth,
    role('admin', 'hotel'),
    createHotel
);

// Cập nhật khách sạn
router.put(
    "/:id",
    auth,
    role('admin', 'hotel'),
    updateHotel
);

// Xóa khách sạn
router.delete(
    "/:id",
    auth,
    role('admin', 'hotel'),
    deleteHotel
);

// Cập nhật trạng thái
router.patch(
    "/:id/status",
    auth,
    role('admin', 'hotel'),
    updateHotelStatus
);

export default router;