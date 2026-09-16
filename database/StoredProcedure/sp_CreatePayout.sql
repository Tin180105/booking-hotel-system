USE [BOOKING-HOTEL];
GO

CREATE OR ALTER PROCEDURE dbo.sp_CreatePayout
    @HotelId BIGINT,
    @PayoutCode VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- =========================================
    -- 1. Kiểm tra Hotel
    -- =========================================

    DECLARE @CommissionRate DECIMAL(5,2);

    SELECT
        @CommissionRate = commission_rate
    FROM hotels
    WHERE id = @HotelId;

    IF @CommissionRate IS NULL
    BEGIN
        RAISERROR('Hotel không tồn tại.', 16, 1);
        RETURN;
    END;


    -- =========================================
    -- 2. Kiểm tra payout code
    -- =========================================

    IF EXISTS (
        SELECT 1
        FROM payouts
        WHERE payout_code = @PayoutCode
    )
    BEGIN
        RAISERROR('Payout code đã tồn tại.', 16, 1);
        RETURN;
    END;


    BEGIN TRY

        BEGIN TRANSACTION;


        -- =========================================
        -- 3. Tổng booking SUCCESS
        -- =========================================

        DECLARE @TotalBookingAmount DECIMAL(12,2);

        SELECT
            @TotalBookingAmount =
                ISNULL(SUM(b.final_amount), 0)
        FROM bookings b
        WHERE b.hotel_id = @HotelId
          AND EXISTS (
                SELECT 1
                FROM payments p
                WHERE p.booking_id = b.id
                  AND p.payment_status = 'SUCCESS'
          );


        -- =========================================
        -- 4. Kiểm tra dữ liệu
        -- =========================================

        IF @TotalBookingAmount <= 0
        BEGIN
            RAISERROR(
                'Hotel chưa có booking thanh toán thành công để tạo payout.',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;
        END;


                -- =========================================
        -- 5. Commission
        -- =========================================

        -- ⚠️ DEMO NON-REPEATABLE READ — XÓA SAU KHI QUAY XONG
        DECLARE @CommissionRateAtStart DECIMAL(5,2) = @CommissionRate;

        WAITFOR DELAY '00:00:08'; -- chờ 8s để kịp đổi commission ở tab admin khác

        DECLARE @CommissionRateRecheck DECIMAL(5,2);

        SELECT @CommissionRateRecheck = commission_rate
        FROM hotels
        WHERE id = @HotelId;
        -- ⚠️ HẾT ĐOẠN DEMO

        DECLARE @TotalCommission DECIMAL(12,2);

        SET @TotalCommission =
            ROUND(
                @TotalBookingAmount
                * @CommissionRateRecheck   -- dùng giá trị đọc lại (đã đổi), thay vì @CommissionRate ban đầu
                / 100,
                2
            );


        -- =========================================
        -- 6. Payout amount
        -- =========================================

        DECLARE @PayoutAmount DECIMAL(12,2);

        SET @PayoutAmount =
            @TotalBookingAmount
            - @TotalCommission;


        -- =========================================
        -- 7. INSERT
        -- =========================================

        INSERT INTO payouts
        (
            hotel_id,
            payout_code,
            total_booking_amount,
            total_commission,
            payout_amount,
            status
        )
        VALUES
        (
            @HotelId,
            @PayoutCode,
            @TotalBookingAmount,
            @TotalCommission,
            @PayoutAmount,
            'PENDING'
        );


        -- =========================================
        -- 8. Trả về dữ liệu
        -- =========================================

                SELECT
            p.id,
            p.hotel_id,
            h.name AS hotel_name,
            p.payout_code,
            p.total_booking_amount,
            p.total_commission,
            p.payout_amount,
            p.status,
            p.payout_date,
            p.created_at,
            @CommissionRateAtStart AS debug_commission_rate_lan1,   -- ⚠️ DEMO, xóa sau
            @CommissionRateRecheck AS debug_commission_rate_lan2    -- ⚠️ DEMO, xóa sau
        FROM payouts p
        INNER JOIN hotels h ON p.hotel_id = h.id
        WHERE p.id = SCOPE_IDENTITY();


        COMMIT TRANSACTION;

    END TRY

    BEGIN CATCH

        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END;

        DECLARE @ErrorMessage NVARCHAR(4000);

        SET @ErrorMessage = ERROR_MESSAGE();

        RAISERROR(@ErrorMessage, 16, 1);

    END CATCH;

END;
GO