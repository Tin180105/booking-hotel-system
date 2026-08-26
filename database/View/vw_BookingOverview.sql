USE [BOOKING-HOTEL];
GO

CREATE OR ALTER VIEW vw_BookingOverview
AS
SELECT
    -- =========================
    -- BOOKING
    -- =========================
    b.id AS booking_id,
    b.booking_code,
    b.status AS booking_status,

    b.total_amount,
    b.commission_amount,
    b.final_amount,

    b.created_at AS booking_created_at,
    b.updated_at AS booking_updated_at,


    -- =========================
    -- CUSTOMER
    -- =========================
    c.id AS customer_id,
    c.full_name AS customer_name,
    c.phone AS customer_phone,
    c.email AS customer_email,


    -- =========================
    -- HOTEL
    -- =========================
    h.id AS hotel_id,
    h.name AS hotel_name,
    h.city AS hotel_city,
    h.address AS hotel_address,


    -- =========================
    -- ROOM TYPE
    -- =========================
    rt.id AS room_type_id,
    rt.name AS room_type_name,
    rt.capacity AS room_capacity,


    -- =========================
    -- BOOKING ROOM
    -- =========================
    br.quantity AS room_quantity,
    br.total_room_price,

    br.expected_check_in,
    br.expected_check_out

FROM bookings b

INNER JOIN customers c
    ON b.customer_id = c.id

INNER JOIN hotels h
    ON b.hotel_id = h.id

INNER JOIN booking_rooms br
    ON b.id = br.booking_id

INNER JOIN room_types rt
    ON br.room_type_id = rt.id;
GO