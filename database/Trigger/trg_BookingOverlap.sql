CREATE OR ALTER TRIGGER trg_BookingOverlap
ON booking_rooms
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM inserted i
        INNER JOIN booking_rooms br
            ON br.room_type_id = i.room_type_id
            AND br.id <> i.id
            AND br.expected_check_in < i.expected_check_out
            AND br.expected_check_out > i.expected_check_in
        INNER JOIN bookings b
            ON b.id = br.booking_id
        INNER JOIN bookings bi
            ON bi.id = i.booking_id
        WHERE b.status <> 'CANCELLED'
          AND bi.status <> 'CANCELLED'
    )
    BEGIN
        ROLLBACK TRANSACTION;

        RAISERROR(
            N'Phòng đã được đặt trong khoảng thời gian này.',
            16,
            1
        );

        RETURN;
    END
END;
GO