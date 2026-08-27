USE [BOOKING-HOTEL];
GO

CREATE OR ALTER TRIGGER trg_PriceRuleAudit
ON price_rules
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- INSERT
    INSERT INTO price_rule_audits
    (
        price_rule_id,
        room_type_id,
        action_type,
        old_adjustment_type,
        old_adjustment_value,
        new_adjustment_type,
        new_adjustment_value
    )
    SELECT
        i.id,
        i.room_type_id,
        'INSERT',
        NULL,
        NULL,
        i.adjustment_type,
        i.adjustment_value
    FROM inserted i
    LEFT JOIN deleted d
        ON d.id = i.id
    WHERE d.id IS NULL;


    -- UPDATE
    INSERT INTO price_rule_audits
    (
        price_rule_id,
        room_type_id,
        action_type,
        old_adjustment_type,
        old_adjustment_value,
        new_adjustment_type,
        new_adjustment_value
    )
    SELECT
        i.id,
        i.room_type_id,
        'UPDATE',
        d.adjustment_type,
        d.adjustment_value,
        i.adjustment_type,
        i.adjustment_value
    FROM inserted i
    INNER JOIN deleted d
        ON d.id = i.id;


    -- DELETE
    INSERT INTO price_rule_audits
    (
        price_rule_id,
        room_type_id,
        action_type,
        old_adjustment_type,
        old_adjustment_value,
        new_adjustment_type,
        new_adjustment_value
    )
    SELECT
        d.id,
        d.room_type_id,
        'DELETE',
        d.adjustment_type,
        d.adjustment_value,
        NULL,
        NULL
    FROM deleted d
    LEFT JOIN inserted i
        ON i.id = d.id
    WHERE i.id IS NULL;

END;
GO