USE [BOOKING-HOTEL];
GO

-- =========================
-- ROLES & PERMISSIONS
-- =========================

CREATE TABLE roles (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50),
    code VARCHAR(50),
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

    PRIMARY KEY (role_id, permission_id),

    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
GO


-- =========================
-- HOTELS & MEDIA
-- =========================

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

    CHECK (commission_rate BETWEEN 0 AND 100),
    CHECK (star_rating BETWEEN 1 AND 5)
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

    PRIMARY KEY (hotel_id, amenity_id),

    FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE,

    FOREIGN KEY (amenity_id)
        REFERENCES amenities(id)
        ON DELETE CASCADE
);
GO


-- =========================
-- USERS
-- =========================

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

    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
GO


-- =========================
-- ROOM TYPES
-- =========================

CREATE TABLE room_types (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 2,
    total_rooms INT NOT NULL DEFAULT 1,
    base_price DECIMAL(12,2) NOT NULL,
    description NVARCHAR(MAX),

    FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE,

    CHECK (capacity > 0),
    CHECK (total_rooms > 0),
    CHECK (base_price >= 0)
);
GO

CREATE TABLE room_type_images (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    room_type_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_thumbnail BIT NOT NULL DEFAULT 0,

    FOREIGN KEY (room_type_id)
        REFERENCES room_types(id)
        ON DELETE CASCADE
);
GO


-- =========================
-- PRICE RULES
-- =========================

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

    FOREIGN KEY (room_type_id)
        REFERENCES room_types(id)
        ON DELETE CASCADE,

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


-- =========================
-- CUSTOMERS
-- =========================

CREATE TABLE customers (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO


-- =========================
-- WISHLIST
-- =========================

CREATE TABLE wishlists (
    customer_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    PRIMARY KEY (customer_id, hotel_id),

    FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE,

    FOREIGN KEY (hotel_id)
        REFERENCES hotels(id)
        ON DELETE CASCADE
);
GO


-- =========================
-- PROMOTIONS
-- =========================

CREATE TABLE promotions (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL,
    max_discount DECIMAL(12,2) NULL,
    start_date DATETIME2 NOT NULL,
    end_date DATETIME2 NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,

    CHECK (end_date > start_date),
    CHECK (discount_value >= 0),
    CHECK (max_discount IS NULL OR max_discount >= 0)
);
GO


-- =========================
-- BOOKINGS
-- =========================

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

    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);
GO


-- =========================
-- BOOKING ROOMS
-- =========================

CREATE TABLE booking_rooms (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    room_type_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_room_price DECIMAL(12,2) NOT NULL,
    expected_check_in DATETIME2 NOT NULL,
    expected_check_out DATETIME2 NOT NULL,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (room_type_id)
        REFERENCES room_types(id),

    CHECK (quantity > 0),
    CHECK (expected_check_out > expected_check_in),
    CHECK (total_room_price >= 0)
);
GO

CREATE INDEX IX_booking_rooms_availability
ON booking_rooms(room_type_id, expected_check_in, expected_check_out);
GO


-- =========================
-- REVIEWS
-- =========================

CREATE TABLE reviews (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    hotel_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating_score INT NOT NULL,
    comment NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),

    CHECK (rating_score BETWEEN 1 AND 5)
);
GO


-- =========================
-- PAYMENTS
-- =========================

CREATE TABLE payments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_code VARCHAR(100) NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    paid_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    CHECK (amount >= 0)
);
GO

CREATE UNIQUE INDEX UX_payments_transaction_code
ON payments(transaction_code)
WHERE transaction_code IS NOT NULL;
GO


-- =========================
-- PAYOUTS
-- =========================

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

    FOREIGN KEY (hotel_id)
        REFERENCES hotels(id),

    CHECK (
        total_booking_amount >= 0
        AND total_commission >= 0
        AND payout_amount >= 0
    )
);
GO

USE [BOOKING-HOTEL];
GO

SELECT id, name, code
FROM roles;

INSERT INTO roles
(
    name,
    code,
    description
)
VALUES
(
    N'Customer',
    'customer',
    N'Quản trị người dùng'
);

USE [BOOKING-HOTEL];
GO

DELETE FROM roles;
GO

SELECT id, name, code
FROM roles;

CREATE TABLE refresh_tokens (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME2 NOT NULL,
    revoked_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);