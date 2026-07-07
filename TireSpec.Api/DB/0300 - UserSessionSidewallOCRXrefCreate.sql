CREATE OR ALTER PROCEDURE TireSpec.UserSessionSidewallOCRXrefCreate
(
    @UserSessionID UNIQUEIDENTIFIER,
    @SidewallOCRID INT
)
AS
/*****************************************************************************************************
	Procedure: 	TireSpec.UserSessionSidewallOCRXrefCreate
	Written By:	Dhruv Makadia
	Copyright: 	Tire Profiles, Inc.
	Procedure Created: 	2026/07/03
	Procedure Purpose: 	Inserts in InsertUserSessionSidewallOCRXref table.

	Modification History:
*****************************************************************************************************/
SET NOCOUNT ON;

DECLARE	@TpiError BIT = 0
DECLARE	@TpiErrorDescription NVARCHAR ( MAX ) = 'Successfully executed.'
DECLARE	@RaiseErrorSeverity INT = 0
DECLARE	@RaiseErrorState INT = 0
DECLARE	@CustomErrorMessage NVARCHAR ( MAX ) = ''
DECLARE	@SqlErrorMessage NVARCHAR ( MAX ) = ''

-- Validate
IF
(
	( @UserSessionID IS NULL )
	OR ( @SidewallOCRID IS NULL )
)
BEGIN
	SELECT	@TpiError = 1
		, @RaiseErrorSeverity = 16
		, @RaiseErrorState = 1
		, @CustomErrorMessage =
		CASE
			WHEN ( @UserSessionID IS NULL ) THEN 'Error. From UserSessionID cannot be NULL.'
			WHEN ( @SidewallOCRID IS NULL ) THEN 'Error. To WebsiteID cannot be NULL.'
			ELSE 'Error. Invalid input parameters.'
		END
		, @SqlErrorMessage = 'SQL Error = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_NUMBER () ), 'Not a SQL Error' ) + ''''
			+ ', Line = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_LINE () ), 'Unknown Line' ) + ''''
			+ ', Message = ''' + ISNULL ( ERROR_MESSAGE (), 'Not a SQL Message' ) + ''''
END

IF ( @TpiError = 0 )
BEGIN
	BEGIN TRY
		INSERT	[TireSpec].[UserSessionSidewallOCRXref]
		(
			[UserSessionID]
			, [SidewallOCRID]
		)
		VALUES
		(
			@UserSessionID
			, @SidewallOCRID
		);
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
		+ ', @SidewallOCRID = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), @SidewallOCRID ), 'NULL' ) + ''''
		+ CHAR ( 13 ) + CHAR ( 10 )
		+ @SqlErrorMessage

	RAISERROR ( '%s', @RaiseErrorSeverity, @RaiseErrorState, @TpiErrorDescription )
END

SET NOCOUNT OFF
GO