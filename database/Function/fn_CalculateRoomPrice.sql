USE [BOOKING-HOTEL];
GO

CREATE FUNCTION dbo.fn_CalculateRoomPrice
(
    @room_type_id BIGINT,
    @check_in DATETIME2,
    @check_out DATETIME2,
    @quantity INT
)
RETURNS DECIMAL(12,2)
AS
BEGIN
    DECLARE @base_price DECIMAL(12,2);
    DECLARE @stay_days INT;
    DECLARE @total_price DECIMAL(12,2);

    -- Lấy giá phòng
    SELECT @base_price = base_price
    FROM room_types
    WHERE id = @room_type_id;

    -- Tính số ngày ở
    SET @stay_days = dbo.fn_CalculateStayDays(
        @check_in,
        @check_out
    );

    -- Tính tổng tiền
    SET @total_price =
        @base_price
        * @stay_days
        * @quantity;

    RETURN @total_price;
END;
GO