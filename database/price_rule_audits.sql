USE [BOOKING-HOTEL];
GO

CREATE TABLE price_rule_audits (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,

    price_rule_id BIGINT NOT NULL,
    room_type_id BIGINT NOT NULL,

    action_type VARCHAR(20) NOT NULL,

    old_adjustment_type VARCHAR(20) NULL,
    old_adjustment_value DECIMAL(12,2) NULL,

    new_adjustment_type VARCHAR(20) NULL,
    new_adjustment_value DECIMAL(12,2) NULL,

    changed_at DATETIME2 NOT NULL DEFAULT GETDATE(),

    FOREIGN KEY (price_rule_id)
        REFERENCES price_rules(id)
);
GO