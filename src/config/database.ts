import sql from 'mssql';

import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME || process.env.DB_DATABASE,

    server: process.env.DB_SERVER || 'localhost',

    options: {

        encrypt: false,

        trustServerCertificate: true,

    },

    pool: {

        max: 10,

        min: 0,

        idleTimeoutMillis: 30000,

    },

};


// Khởi tạo connection pool dùng chung

const poolPromise =
    new sql.ConnectionPool(dbConfig)

        .connect()

        .then((pool) => {

            console.log(
                '✅ Connected to SQL Server successfully!'
            );

            return pool;

        })

        .catch((err) => {

            console.error(
                '❌ Database connection failed:',
                err
            );

            throw err;

        });


// Export 1: Dùng cho auth.model.ts để query

export const getConnection = async () => {

    return await poolPromise;

};


// Export 2: Dùng cho index.ts để khởi tạo kết nối khi start server

export const connectDB = async () => {

    return await poolPromise;

};


// ========================================
// Export 3: Dùng cho các service
// ========================================

export const getDB = async () => {

    return await poolPromise;

};