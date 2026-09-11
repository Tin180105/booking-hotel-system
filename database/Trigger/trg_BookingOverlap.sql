-- database/Trigger/trg_BookingOverlap.sql
CREATE OR ALTER TRIGGER trg_BookingOverlap
ON booking_rooms
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN room_types rt
            ON rt.id = i.room_type_id
        INNER JOIN bookings bi
            ON bi.id = i.booking_id
        WHERE bi.status <> 'CANCELLED'
          AND (
              ISNULL((
                  SELECT SUM(br.quantity)
                  FROM booking_rooms br
                  INNER JOIN bookings b
                      ON b.id = br.booking_id
                  WHERE br.room_type_id = i.room_type_id
                    AND br.id <> i.id
                    AND br.expected_check_in < i.expected_check_out
                    AND br.expected_check_out > i.expected_check_in
                    AND b.status <> 'CANCELLED'
              ), 0) + i.quantity
          ) > rt.total_rooms
    )
    BEGIN
        ROLLBACK TRANSACTION;

        RAISERROR(
            N'Không đủ phòng trống trong khoảng thời gian này.',
            16,
            1
        );

        RETURN;
    END
END;
GO