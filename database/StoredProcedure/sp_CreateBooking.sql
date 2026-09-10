USE [BOOKING-HOTEL];
GO

IF OBJECT_ID('dbo.sp_CreateBooking', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_CreateBooking;
GO

CREATE PROCEDURE dbo.sp_CreateBooking
    @HotelId BIGINT,
    @CustomerId BIGINT,
    @RoomTypeId BIGINT,
    @Quantity INT,
    @CheckIn DATETIME2,
    @CheckOut DATETIME2,
    @PromotionId BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- ========================================
        -- 1. KIỂM TRA SỐ LƯỢNG
        -- ========================================

        IF @Quantity <= 0
        BEGIN
            RAISERROR(
                N'Số lượng phòng phải lớn hơn 0',
                16,
                1
            );
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- ========================================
        -- 2. KIỂM TRA NGÀY
        -- ========================================

        IF @CheckOut <= @CheckIn
        BEGIN
            RAISERROR(
                N'Ngày check-out phải lớn hơn ngày check-in',
                16,
                1
            );
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- ========================================
        -- 3. KIỂM TRA CUSTOMER
        -- ========================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM customers
            WHERE id = @CustomerId
        )
        BEGIN
            RAISERROR(
                N'Customer không tồn tại',
                16,
                1
            );
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- ========================================
        -- 4. LẤY ROOM TYPE
        -- ========================================

        DECLARE @TotalRooms INT;
        DECLARE @BasePrice DECIMAL(12,2);

        SELECT
            @TotalRooms = total_rooms,
            @BasePrice = base_price
        FROM room_types
        WHERE id = @RoomTypeId
          AND hotel_id = @HotelId;

        IF @TotalRooms IS NULL
        BEGIN
            RAISERROR(
                N'Loại phòng không tồn tại hoặc không thuộc khách sạn',
                16,
                1
            );
            ROLLBACK TRANSACTION;
            RETURN;
        END;

        -- ========================================
        -- 5. TÍNH TIỀN PHÒNG QUA FUNCTION
        -- ========================================

        DECLARE @TotalNights INT;
        DECLARE @TotalRoomPrice DECIMAL(12,2);

        SET @TotalNights = dbo.fn_CalculateStayDays(
            @CheckIn,
            @CheckOut
        );

        SET @TotalRoomPrice = dbo.fn_CalculateRoomPrice(
            @RoomTypeId,
            @CheckIn,
            @CheckOut,
            @Quantity
        );

        -- ========================================
        -- 10. TÍNH PROMOTION
        -- ========================================

        DECLARE @DiscountAmount DECIMAL(12,2) = 0;
        DECLARE @DiscountType VARCHAR(20);
        DECLARE @DiscountValue DECIMAL(12,2);
        DECLARE @MaxDiscount DECIMAL(12,2);

        IF @PromotionId IS NOT NULL
        BEGIN
            SELECT
                @DiscountType = discount_type,
                @DiscountValue = discount_value,
                @MaxDiscount = max_discount
            FROM promotions
            WHERE id = @PromotionId
              AND is_active = 1
              AND @CheckIn >= start_date
              AND @CheckIn <= end_date;

            IF @DiscountType IS NULL
            BEGIN
                RAISERROR(
                    N'Promotion không tồn tại, đã hết hạn hoặc không hoạt động',
                    16,
                    1
                );
                ROLLBACK TRANSACTION;
                RETURN;
            END;

            IF @DiscountType = 'PERCENT'
            BEGIN
                SET @DiscountAmount =
                    @TotalRoomPrice * @DiscountValue / 100;
            END;

            IF @DiscountType = 'FIXED'
            BEGIN
                SET @DiscountAmount = @DiscountValue;
            END;

            IF @MaxDiscount IS NOT NULL
               AND @DiscountAmount > @MaxDiscount
            BEGIN
                SET @DiscountAmount = @MaxDiscount;
            END;

            IF @DiscountAmount > @TotalRoomPrice
            BEGIN
                SET @DiscountAmount = @TotalRoomPrice;
            END;
        END;

        -- ========================================
        -- 11. TÍNH FINAL AMOUNT
        -- ========================================

        DECLARE @FinalAmount DECIMAL(12,2);

        SET @FinalAmount =
            @TotalRoomPrice - @DiscountAmount;

        -- ========================================
        -- 12. BOOKING CODE
        -- ========================================

        DECLARE @BookingCode VARCHAR(30);

        SET @BookingCode =
            'BK' + FORMAT(GETDATE(), 'yyyyMMddHHmmssfff');

        -- ========================================
        -- 13. INSERT BOOKING
        -- ========================================

        INSERT INTO bookings
        (
            hotel_id,
            customer_id,
            promotion_id,
            booking_code,
            status,
            total_amount,
            commission_amount,
            final_amount
        )
        VALUES
        (
            @HotelId,
            @CustomerId,
            @PromotionId,
            @BookingCode,
            'PENDING',
            @TotalRoomPrice,
            0,
            @FinalAmount
        );

        -- ========================================
        -- 14. LẤY BOOKING ID
        -- ========================================

        DECLARE @BookingId BIGINT;

        SET @BookingId = SCOPE_IDENTITY();

        -- ========================================
        -- 15. INSERT BOOKING ROOM
        -- Trigger trg_BookingOverlap sẽ chạy ở đây
        -- ========================================

        INSERT INTO booking_rooms
        (
            booking_id,
            room_type_id,
            quantity,
            total_room_price,
            expected_check_in,
            expected_check_out
        )
        VALUES
        (
            @BookingId,
            @RoomTypeId,
            @Quantity,
            @TotalRoomPrice,
            @CheckIn,
            @CheckOut
        );

        -- ========================================
        -- 16. COMMIT
        -- ========================================

        COMMIT TRANSACTION;

        -- ========================================
        -- 17. TRẢ KẾT QUẢ
        -- ========================================

        SELECT
            b.id AS booking_id,
            b.booking_code,
            b.hotel_id,
            b.customer_id,
            b.status,
            b.total_amount,
            b.final_amount,
            br.room_type_id,
            br.quantity,
            br.total_room_price,
            br.expected_check_in,
            br.expected_check_out
        FROM bookings b
        INNER JOIN booking_rooms br
            ON b.id = br.booking_id
        WHERE b.id = @BookingId;

    END TRY

    BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
END;
GO