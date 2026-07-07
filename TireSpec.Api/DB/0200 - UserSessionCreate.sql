CREATE OR ALTER PROCEDURE TireSpec.UserSessionCreate
(
	@UserSessionID UNIQUEIDENTIFIER
	, @WebsiteID UNIQUEIDENTIFIER
	, @JSONWebToken NVARCHAR ( MAX )
)
AS
/*****************************************************************************************************
	Procedure: 	TireSpec.UserSessionCreate
	Written By:	Dhruv Makadia
	Copyright: 	Tire Profiles, Inc.
	Procedure Created: 	2026/07/03
	Procedure Purpose: 	Creates the user session for TireSpec.

	Modification History:
*****************************************************************************************************/
SET NOCOUNT ON

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
	OR ( @WebsiteID IS NULL )
	OR ( @JSONWebToken IS NULL )
)
BEGIN
	SELECT	@TpiError = 1
		, @RaiseErrorSeverity = 16
		, @RaiseErrorState = 1
		, @CustomErrorMessage =
		CASE
			WHEN ( @UserSessionID IS NULL ) THEN 'Error. From UserSessionID cannot be NULL.'
			WHEN ( @WebsiteID IS NULL ) THEN 'Error. To WebsiteID cannot be NULL.'
			WHEN ( @JSONWebToken IS NULL ) THEN 'Error. To JSONWebToken cannot be NULL.'
			ELSE 'Error. Invalid input parameters.'
		END
		, @SqlErrorMessage = 'SQL Error = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_NUMBER () ), 'Not a SQL Error' ) + ''''
			+ ', Line = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_LINE () ), 'Unknown Line' ) + ''''
			+ ', Message = ''' + ISNULL ( ERROR_MESSAGE (), 'Not a SQL Message' ) + ''''
END

-- Check whether the website exists and is not deleted
IF ( @TpiError = 0 )
BEGIN
	BEGIN TRY
		IF NOT EXISTS
		(
			SELECT	1
			FROM	TireSpec.Website w
			WHERE	w.WebsiteID = @WebsiteID
				AND w.IsDeleted = 0
		)
		BEGIN
			SELECT	@TpiError = 1
				, @RaiseErrorSeverity = 16
				, @RaiseErrorState = 1
				, @CustomErrorMessage = 'Error while checking existance of Website'
				, @SqlErrorMessage = 'SQL Error = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_NUMBER () ), 'Not a SQL Error' ) + ''''
					+ ', Line = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_LINE () ), 'Unknown Line' ) + ''''
					+ ', Message = ''' + ISNULL ( ERROR_MESSAGE (), 'Not a SQL Message' ) + ''''
		END;
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

IF ( @TpiError = 0 )
BEGIN
	BEGIN TRY
		INSERT TireSpec.UserSession
		(
			UserSessionID
			, JSONWebToken
			, WebsiteID
		)
		VALUES
		(
			@UserSessionID
			, @JSONWebToken
			, @WebsiteID
		)

		-- Return the created session id
		SELECT	@UserSessionID AS UserSessionID
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
		+ ', @WebsiteID = ''' + ISNULL ( CONVERT ( NVARCHAR ( 36 ), @WebsiteID ), 'NULL' ) + ''''
		+ ', @JSONWebToken = ''' + ISNULL ( @JSONWebToken, 'NULL' ) + ''''
		+ CHAR ( 13 ) + CHAR ( 10 )
		+ @SqlErrorMessage

	RAISERROR ( '%s', @RaiseErrorSeverity, @RaiseErrorState, @TpiErrorDescription )
END

SET NOCOUNT OFF
GO