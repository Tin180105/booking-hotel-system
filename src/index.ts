import "dotenv/config";

import express from "express";
import cors from "cors";

import routes from "./routes";

import {
    connectDB,
} from "./config/database";

import hotelRoutes
    from "../src/modules/hotels/hotel.routes";

// ========================================
// ENV CHECK
// ========================================

console.log("\n========================================");
console.log("        ENV CONFIG CHECK");
console.log("========================================");

console.log(
    "DB_SERVER:",
    process.env.DB_SERVER
);

console.log(
    "DB_DATABASE:",
    process.env.DB_DATABASE
);

console.log(
    "DB_USER:",
    process.env.DB_USER
);

console.log(
    "DB_PASSWORD:",
    process.env.DB_PASSWORD
        ? "********"
        : "❌ UNDEFINED"
);

console.log(
    "JWT_ACCESS_SECRET:",
    process.env.JWT_ACCESS_SECRET
        ? "********"
        : "❌ UNDEFINED"
);

console.log(
    "JWT_REFRESH_SECRET:",
    process.env.JWT_REFRESH_SECRET
        ? "********"
        : "❌ UNDEFINED"
);

console.log(
    "JWT_SECRET length:",
    process.env.JWT_SECRET?.length
);

console.log("========================================\n");


const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(
    express.json()
);


// ========================================
// TEST API
// ========================================

app.get("/", (req, res) => {
    res.json({
        message:
            "Booking Hotel API is running",
    });
});


// ========================================
// ROUTES
// ========================================

app.use(routes);

// 👇 THÊM HOTEL ROUTE Ở ĐÂY
app.use("/api/hotels",hotelRoutes);
app.use('/uploads', express.static('uploads'));

// ========================================
// START SERVER
// ========================================

const PORT =
    Number(process.env.PORT) || 5000;

const startServer = async () => {

    try {

        await connectDB();

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running at http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Cannot start server:",
            error
        );

        process.exit(1);
    }
};

startServer();