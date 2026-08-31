USE [BOOKING-HOTEL];
GO

-- ============================================
-- 1. DROP FK cũ (refresh_tokens.user_id -> users) nếu còn tồn tại
-- ============================================
IF EXISTS (
    SELECT 1
    FROM sys.foreign_keys fk
    WHERE fk.parent_object_id = OBJECT_ID('refresh_tokens')
      AND fk.referenced_object_id = OBJECT_ID('users')
)
BEGIN
    DECLARE @fkName NVARCHAR(200);

    SELECT @fkName = fk.name
    FROM sys.foreign_keys fk
    WHERE fk.parent_object_id = OBJECT_ID('refresh_tokens')
      AND fk.referenced_object_id = OBJECT_ID('users');

    EXEC('ALTER TABLE refresh_tokens DROP CONSTRAINT ' + @fkName);
END
GO

-- ============================================
-- 2. Cho phép user_id NULL
-- ============================================
ALTER TABLE refresh_tokens ALTER COLUMN user_id BIGINT NULL;
GO

-- ============================================
-- 3. Thêm cột customer_id nếu chưa có
-- ============================================
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID('refresh_tokens')
      AND name = 'customer_id'
)
BEGIN
    ALTER TABLE refresh_tokens ADD customer_id BIGINT NULL;
END
GO

-- ============================================
-- 4. FK -> users (nếu chưa có)
-- ============================================
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_refresh_tokens_user'
)
BEGIN
    ALTER TABLE refresh_tokens ADD CONSTRAINT FK_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
END
GO

-- ============================================
-- 5. FK -> customers (nếu chưa có)
-- ============================================
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_refresh_tokens_customer'
)
BEGIN
    ALTER TABLE refresh_tokens ADD CONSTRAINT FK_refresh_tokens_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
END
GO

-- ============================================
-- 6. CHECK: đúng 1 trong 2 (user_id / customer_id) khác NULL
-- ============================================
IF NOT EXISTS (
    SELECT 1 FROM sys.check_constraints WHERE name = 'CK_refresh_tokens_owner'
)
BEGIN
    ALTER TABLE refresh_tokens ADD CONSTRAINT CK_refresh_tokens_owner
        CHECK (
            (user_id IS NOT NULL AND customer_id IS NULL)
            OR (user_id IS NULL AND customer_id IS NOT NULL)
        );
END
GO

-- ============================================
-- 7. Kiểm tra lại kết quả
-- ============================================
SELECT
    c.name AS column_name,
    c.is_nullable
FROM sys.columns c
WHERE c.object_id = OBJECT_ID('refresh_tokens')
  AND c.name IN ('user_id', 'customer_id');

SELECT name AS constraint_name, type_desc
FROM sys.objects
WHERE parent_object_id = OBJECT_ID('refresh_tokens')
  AND type IN ('F', 'C');
GO