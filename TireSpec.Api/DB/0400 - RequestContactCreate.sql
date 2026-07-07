CREATE OR ALTER PROCEDURE TireSpec.RequestContactCreate
(
    @UserSessionID UNIQUEIDENTIFIER
    , @VehicleOwnerName NVARCHAR(100) = NULL
    , @VehicleOwnerPhone NVARCHAR(100)
    , @VehicleOwnerEmail NVARCHAR(100) = NULL
)
AS
/*****************************************************************************************************
	Procedure: 	TireSpec.RequestContactCreate
	Written By:	Dhruv Makadia
	Copyright: 	Tire Profiles, Inc.
	Procedure Created: 	2026/07/07
	Procedure Purpose: 	Inserts in RequestContact table.

	Modification History:
*****************************************************************************************************/
SET NOCOUNT ON

DECLARE	@TpiError BIT = 0
DECLARE	@TpiErrorDescription NVARCHAR ( MAX ) = 'Successfully executed.'
DECLARE	@RaiseErrorSeverity INT = 0
DECLARE	@RaiseErrorState INT = 0
DECLARE	@CustomErrorMessage NVARCHAR ( MAX ) = ''
DECLARE	@SqlErrorMessage NVARCHAR ( MAX ) = ''

IF
(
	( @UserSessionID IS NULL )
	OR ( @VehicleOwnerPhone IS NULL )
)
BEGIN
	SELECT	@TpiError = 1
		, @RaiseErrorSeverity = 16
		, @RaiseErrorState = 1
		, @CustomErrorMessage =
		CASE
			WHEN ( @UserSessionID IS NULL ) THEN 'Error. From UserSessionID cannot be NULL.'
			WHEN ( @VehicleOwnerPhone IS NULL ) THEN 'Error. To VehicleOwnerPhone cannot be NULL.'
			ELSE 'Error. Invalid input parameters.'
		END
		, @SqlErrorMessage = 'SQL Error = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_NUMBER () ), 'Not a SQL Error' ) + ''''
			+ ', Line = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_LINE () ), 'Unknown Line' ) + ''''
			+ ', Message = ''' + ISNULL ( ERROR_MESSAGE (), 'Not a SQL Message' ) + ''''
END

IF ( @TpiError = 0 )
BEGIN
	BEGIN TRY
		INSERT INTO TireSpec.RequestContact
		(
			UserSessionID
			, VehicleOwnerName
			, VehicleOwnerPhone
			, VehicleOwnerEmail
			, CreatedAt
		)
		VALUES
		(
			@UserSessionID
			, @VehicleOwnerName
			, @VehicleOwnerPhone
			, @VehicleOwnerEmail
			, GETDATE()
		)
	END TRY
	BEGIN CATCH
		SELECT	@TpiError = 1
			, @RaiseErrorSeverity = ERROR_SEVERITY ()
			, @RaiseErrorState = ERROR_STATE ()
			, @CustomErrorMessage = 'Error while inserting UserSession'
			, @SqlErrorMessage = 'SQL Error = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_NUMBER () ), 'Not a SQL Error' ) + ''''
				+ ', Line = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_LINE () ), 'Unknown Line' ) + ''''
				+ ', Message = ''' + ISNULL ( ERROR_MESSAGE (), 'Not a SQL Message' ) + ''''

	END CATCH
END

IF ( @TpiError <> 0 )
BEGIN
	SELECT	@TpiErrorDescription = 'Procedure = ' + OBJECT_NAME ( @@PROCID )
		+ ', ''' + @CustomErrorMessage + ''''
		+ CHAR ( 13 ) + CHAR ( 10 )
		+ 'Parameters: @UserSessionID = ''' + ISNULL ( CONVERT ( NVARCHAR ( 36 ), @UserSessionID ), 'NULL' ) + ''''
		+ ', @VehicleOwnerName = ''' + ISNULL ( @VehicleOwnerName , 'NULL' ) + ''''
		+ ', @VehicleOwnerPhone = ''' + ISNULL ( @VehicleOwnerPhone , 'NULL' ) + ''''
		+ ', @VehicleOwnerEmail = ''' + ISNULL ( @VehicleOwnerEmail , 'NULL' ) + ''''
		+ CHAR ( 13 ) + CHAR ( 10 )
		+ @SqlErrorMessage

	RAISERROR ( '%s', @RaiseErrorSeverity, @RaiseErrorState, @TpiErrorDescription )
END

SET NOCOUNT OFF
GO