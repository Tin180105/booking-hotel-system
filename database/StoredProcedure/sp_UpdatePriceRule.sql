USE [BOOKING-HOTEL];
GO

DROP PROCEDURE IF EXISTS dbo.sp_UpdatePriceRule;
GO

CREATE PROCEDURE dbo.sp_UpdatePriceRule
    @Id BIGINT = NULL,
    @RoomTypeId BIGINT,
    @RuleName NVARCHAR(100),
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @DaysOfWeek VARCHAR(20) = NULL,
    @AdjustmentType VARCHAR(20),
    @AdjustmentValue DECIMAL(12,2),
    @Priority INT = 0,
    @IsActive BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        -- ========================================
        -- 1. KIỂM TRA ROOM TYPE
        -- ========================================

        IF NOT EXISTS (
            SELECT 1
            FROM room_types
            WHERE id = @RoomTypeId
        )
        BEGIN
            RAISERROR(
                N'Room type không tồn tại',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;
        END;


        -- ========================================
        -- 2. KIỂM TRA TÊN RULE
        -- ========================================

        IF @RuleName IS NULL
           OR LTRIM(RTRIM(@RuleName)) = ''
        BEGIN
            RAISERROR(
                N'Tên quy tắc giá không được để trống',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;
        END;


        -- ========================================
        -- 3. KIỂM TRA NGÀY
        -- ========================================

        IF @StartDate IS NOT NULL
           AND @EndDate IS NOT NULL
           AND @EndDate < @StartDate
        BEGIN
            RAISERROR(
                N'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;
        END;


        -- ========================================
        -- 4. KIỂM TRA LOẠI ĐIỀU CHỈNH
        -- ========================================

        IF @AdjustmentType NOT IN ('PERCENT', 'FIXED')
        BEGIN
            RAISERROR(
                N'AdjustmentType chỉ được là PERCENT hoặc FIXED',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;
        END;


        -- ========================================
        -- 5. KIỂM TRA GIÁ TRỊ ĐIỀU CHỈNH
        -- ========================================

        IF @AdjustmentType = 'PERCENT'
           AND @AdjustmentValue < -100
        BEGIN
            RAISERROR(
                N'Giá trị phần trăm không được nhỏ hơn -100',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;
        END;


        -- ========================================
        -- 6. THÊM PRICE RULE
        -- ========================================

        IF @Id IS NULL
        BEGIN

            INSERT INTO price_rules
            (
                room_type_id,
                rule_name,
                start_date,
                end_date,
                days_of_week,
                adjustment_type,
                adjustment_value,
                priority,
                is_active
            )
            VALUES
            (
                @RoomTypeId,
                @RuleName,
                @StartDate,
                @EndDate,
                @DaysOfWeek,
                @AdjustmentType,
                @AdjustmentValue,
                @Priority,
                @IsActive
            );


            SET @Id = SCOPE_IDENTITY();


            COMMIT TRANSACTION;


            -- Trả rule vừa tạo
            SELECT
                id,
                room_type_id,
                rule_name,
                start_date,
                end_date,
                days_of_week,
                adjustment_type,
                adjustment_value,
                priority,
                is_active
            FROM price_rules
            WHERE id = @Id;

            RETURN;
        END;


        -- ========================================
        -- 7. KIỂM TRA PRICE RULE CẦN SỬA
        -- ========================================

        IF NOT EXISTS (
            SELECT 1
            FROM price_rules
            WHERE id = @Id
        )
        BEGIN
            RAISERROR(
                N'Price rule không tồn tại',
                16,
                1
            );

            ROLLBACK TRANSACTION;
            RETURN;
        END;


        -- ========================================
        -- 8. CẬP NHẬT PRICE RULE
        -- ========================================

        UPDATE price_rules
        SET
            room_type_id = @RoomTypeId,
            rule_name = @RuleName,
            start_date = @StartDate,
            end_date = @EndDate,
            days_of_week = @DaysOfWeek,
            adjustment_type = @AdjustmentType,
            adjustment_value = @AdjustmentValue,
            priority = @Priority,
            is_active = @IsActive
        WHERE id = @Id;


        -- ========================================
        -- 9. COMMIT
        -- ========================================

        COMMIT TRANSACTION;


        -- ========================================
        -- 10. TRẢ KẾT QUẢ
        -- ========================================

        SELECT
            id,
            room_type_id,
            rule_name,
            start_date,
            end_date,
            days_of_week,
            adjustment_type,
            adjustment_value,
            priority,
            is_active
        FROM price_rules
        WHERE id = @Id;


    END TRY

    BEGIN CATCH

        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END;

        RAISERROR(
            N'Không thể thêm hoặc cập nhật price rule.',
            16,
            1
        );

    END CATCH;

END;
GO