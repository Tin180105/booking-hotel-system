USE [BOOKING-HOTEL];
GO

CREATE VIEW vw_AmenityOverview
AS
SELECT
    a.id AS amenity_id,
    a.name AS amenity_name,
    a.icon_code,
    COUNT(DISTINCT ha.hotel_id) AS total_hotels

FROM amenities a

LEFT JOIN hotel_amenities ha
    ON a.id = ha.amenity_id

GROUP BY
    a.id,
    a.name,
    a.icon_code;
GO