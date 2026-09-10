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
    DECLARE @adjustment_type VARCHAR(20);
    DECLARE @adjustment_value DECIMAL(12,2);

    -- Lấy giá phòng
    SELECT @base_price = base_price
    FROM room_types
    WHERE id = @room_type_id;

    -- Tính số ngày ở
    SET @stay_days = dbo.fn_CalculateStayDays(
        @check_in,
        @check_out
    );

    SELECT TOP 1
        @adjustment_type = adjustment_type,
        @adjustment_value = adjustment_value
    FROM price_rules
    WHERE room_type_id = @room_type_id
      AND is_active = 1
      AND (
            start_date IS NULL
            OR CAST(@check_in AS DATE) >= start_date
          )
      AND (
            end_date IS NULL
            OR CAST(@check_in AS DATE) <= end_date
          )
    ORDER BY priority DESC;

    IF @adjustment_type = 'PERCENT'
    BEGIN
        SET @base_price = @base_price
            + (@base_price * @adjustment_value / 100);
    END;

    IF @adjustment_type = 'FIXED'
    BEGIN
        SET @base_price = @base_price + @adjustment_value;
    END;

    IF @base_price < 0
    BEGIN
        SET @base_price = 0;
    END;

    -- Tính tổng tiền
    RETURN
        @base_price
        * @stay_days
        * @quantity;
END;
GO