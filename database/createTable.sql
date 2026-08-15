USE [BOOKING-HOTEL]
-- =========================================================
-- HOTEL MANAGEMENT SYSTEM
-- SQL SERVER DATABASE
-- =========================================================

-- Nếu muốn tạo database mới:
-- CREATE DATABASE HotelManagement;
-- GO
-- USE HotelManagement;
-- GO


-- =========================================================
-- 1. RBAC & ACCOUNTS
-- =========================================================

CREATE TABLE roles (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255)
);
GO


CREATE TABLE permissions (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name NVARCHAR(100) NOT NULL
);
GO


CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,

    CONSTRAINT PK_role_permissions
        PRIMARY KEY (role_id, permission_id),

    CONSTRAINT FK_role_permissions_roles
        FOREIGN KEY (role_id)
        REFERENCES roles(id),

    CONSTRAINT FK_role_permissions_permissions
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
);
GO


CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    role_id BIGINT NOT NULL,
    hotel_id BIGINT NULL,
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_users_roles
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);
GO


-- =========================================================
-- 2. PARTNER HOTELS & MEDIA
-- =========================================================

CREATE TABLE hotels (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    description NVARCHAR(MAX),
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
    star_rating INT NOT NULL DEFAULT 3,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_APPROVAL',
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT CK_hotels_commission_rate
        CHECK (commission_rate >= 0 AND commission_rate <= 100),

    CONSTRAINT CK_hotels_star_rating
        CHECK (star_rating >= 1 AND star_rating <= 5)
);
GO


CREATE INDEX IX_hotels_city_status
ON hotels(city, status);
GO


CREATE TABLE hotel_images (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_hotel_images_hotels
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE
);
GO


CREATE TABLE amenities (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    icon_code VARCHAR(50)
);
GO


CREATE TABLE hotel_amenities (
    hotel_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,

    CONSTRAINT PK_hotel_amenities
        PRIMARY KEY (hotel_id, amenity_id),

    CONSTRAINT FK_hotel_amenities_hotels
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_hotel_amenities_amenities
        FOREIGN KEY (amenity_id)
        REFERENCES amenities(id)
        ON DELETE CASCADE
);
GO


-- =========================================================
-- 3. ROOM TYPES & PRICING ENGINE
-- =========================================================

CREATE TABLE room_types (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 2,
    total_rooms INT NOT NULL DEFAULT 1,
    base_price DECIMAL(12,2) NOT NULL,
    description NVARCHAR(MAX),

    CONSTRAINT FK_room_types_hotels
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE,

    CONSTRAINT CK_room_types_capacity
        CHECK (capacity > 0),

    CONSTRAINT CK_room_types_total_rooms
        CHECK (total_rooms > 0),

    CONSTRAINT CK_room_types_base_price
        CHECK (base_price >= 0)
);
GO


CREATE TABLE room_type_images (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    room_type_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_thumbnail BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_room_type_images_room_types
        FOREIGN KEY (room_type_id)
        REFERENCES room_types(id)
        ON DELETE CASCADE
);
GO


CREATE TABLE price_rules (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    room_type_id BIGINT NOT NULL,
    rule_name NVARCHAR(100) NOT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    days_of_week VARCHAR(20) NULL,
    adjustment_type VARCHAR(20) NOT NULL,
    adjustment_value DECIMAL(12,2) NOT NULL,
    priority INT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,

    CONSTRAINT FK_price_rules_room_types
        FOREIGN KEY (room_type_id)
        REFERENCES room_types(id)
        ON DELETE CASCADE,

    CONSTRAINT CK_price_rules_dates
        CHECK (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        )
);
GO


CREATE INDEX IX_price_rules_room_type_active_dates
ON price_rules(room_type_id, is_active, start_date, end_date);
GO


-- =========================================================
-- 4. CUSTOMERS, BOOKING, WISHLIST & REVIEWS
-- =========================================================

CREATE TABLE customers (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO


CREATE TABLE wishlists (
    customer_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_wishlists
        PRIMARY KEY (customer_id, hotel_id),

    CONSTRAINT FK_wishlists_customers
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_wishlists_hotels
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE
);
GO


CREATE TABLE promotions (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL,
    max_discount DECIMAL(12,2) NULL,
    start_date DATETIME2 NOT NULL,
    end_date DATETIME2 NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,

    CONSTRAINT CK_promotions_dates
        CHECK (end_date > start_date),

    CONSTRAINT CK_promotions_discount_value
        CHECK (discount_value >= 0),

    CONSTRAINT CK_promotions_max_discount
        CHECK (max_discount IS NULL OR max_discount >= 0)
);
GO


CREATE TABLE bookings (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    promotion_id BIGINT NULL,
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    commission_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_bookings_hotels
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id),

    CONSTRAINT FK_bookings_customers
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT FK_bookings_promotions
        FOREIGN KEY (promotion_id)
        REFERENCES promotions(id)
);
GO


CREATE TABLE booking_rooms (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    room_type_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_room_price DECIMAL(12,2) NOT NULL,
    expected_check_in DATETIME2 NOT NULL,
    expected_check_out DATETIME2 NOT NULL,

    CONSTRAINT FK_booking_rooms_bookings
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_booking_rooms_room_types
        FOREIGN KEY (room_type_id)
        REFERENCES room_types(id),

    CONSTRAINT CK_booking_rooms_quantity
        CHECK (quantity > 0),

    CONSTRAINT CK_booking_rooms_dates
        CHECK (expected_check_out > expected_check_in),

    CONSTRAINT CK_booking_rooms_price
        CHECK (total_room_price >= 0)
);
GO


CREATE INDEX IX_booking_rooms_availability
ON booking_rooms(
    room_type_id,
    expected_check_in,
    expected_check_out
);
GO


CREATE TABLE reviews (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    hotel_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating_score INT NOT NULL,
    comment NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_reviews_bookings
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id),

    CONSTRAINT FK_reviews_hotels
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id),

    CONSTRAINT FK_reviews_customers
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT CK_reviews_rating
        CHECK (rating_score >= 1 AND rating_score <= 5)
);
GO


-- =========================================================
-- 5. PAYMENTS & PAYOUTS
-- =========================================================

CREATE TABLE payments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_code VARCHAR(100) NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    paid_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_payments_bookings
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    CONSTRAINT CK_payments_amount
        CHECK (amount >= 0)
);
GO


CREATE UNIQUE INDEX UX_payments_transaction_code
ON payments(transaction_code)
WHERE transaction_code IS NOT NULL;
GO


CREATE TABLE payouts (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    payout_code VARCHAR(30) NOT NULL UNIQUE,
    total_booking_amount DECIMAL(12,2) NOT NULL,
    total_commission DECIMAL(12,2) NOT NULL,
    payout_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    payout_date DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_payouts_hotels
        FOREIGN KEY (hotel_id)
        REFERENCES hotels(id),

    CONSTRAINT CK_payouts_amounts
        CHECK (
            total_booking_amount >= 0
            AND total_commission >= 0
            AND payout_amount >= 0
        )
);
GO


-- =========================================================
-- 6. BỔ SUNG FK users -> hotels
-- =========================================================

ALTER TABLE users
ADD CONSTRAINT FK_users_hotels
    FOREIGN KEY (hotel_id)
    REFERENCES hotels(id);
GO