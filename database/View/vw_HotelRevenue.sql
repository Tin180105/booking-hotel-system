USE [BOOKING-HOTEL];
GO

CREATE OR ALTER VIEW vw_HotelRevenue
AS
SELECT
    -- =========================
    -- HOTEL
    -- =========================
    h.id AS hotel_id,
    h.name AS hotel_name,
    h.city,

    -- =========================
    -- BOOKING STATISTICS
    -- =========================
    COUNT(DISTINCT b.id) AS total_bookings,

    -- =========================
    -- REVENUE
    -- =========================
    ISNULL(
        SUM(
            CASE
                WHEN p.payment_status = 'PAID'
                THEN p.amount
                ELSE 0
            END
        ),
        0
    ) AS total_revenue

FROM hotels h

LEFT JOIN bookings b
    ON h.id = b.hotel_id

LEFT JOIN payments p
    ON b.id = p.booking_id

GROUP BY
    h.id,
    h.name,
    h.city;
GO