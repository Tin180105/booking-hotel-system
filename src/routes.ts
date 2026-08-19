import { Router } from "express";

import authRoutes from "./modules/auth/auth.routes";

import hotelRoutes from "./modules/hotels/hotel.routes";

import hotelImageRoutes from "./modules/hotels/hotelImage.routes";

const router = Router();

router.use(
    "/api/auth",
    authRoutes
);

router.use(
    "/api/hotels",
    hotelRoutes
);

router.use(
    "/api",
    hotelImageRoutes
);

export default router;