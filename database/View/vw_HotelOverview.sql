USE [BOOKING-HOTEL];
GO

CREATE VIEW vw_HotelOverview
AS
SELECT
    h.id AS hotel_id,
    h.name AS hotel_name,
    h.city,
    h.address,
    h.phone,
    h.star_rating,
    h.status,
    h.commission_rate,

    COUNT(DISTINCT rt.id) AS total_room_types,
    COUNT(DISTINCT ha.amenity_id) AS total_amenities

FROM hotels h

LEFT JOIN room_types rt
    ON h.id = rt.hotel_id

LEFT JOIN hotel_amenities ha
    ON h.id = ha.hotel_id

GROUP BY
    h.id,
    h.name,
    h.city,
    h.address,
    h.phone,
    h.star_rating,
    h.status,
    h.commission_rate;
GO