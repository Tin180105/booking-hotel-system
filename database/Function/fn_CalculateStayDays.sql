USE [BOOKING-HOTEL];
GO

CREATE FUNCTION dbo.fn_CalculateStayDays
(
    @check_in DATETIME2,
    @check_out DATETIME2
)
RETURNS INT
AS
BEGIN
    DECLARE @stay_days INT;

    SET @stay_days = DATEDIFF(DAY, @check_in, @check_out);

    RETURN @stay_days;
END;
GO