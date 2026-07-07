CREATE OR ALTER PROCEDURE TireSpec.UserSessionSearch
(
    @JSONWebToken NVARCHAR ( MAX )
)
AS
/*****************************************************************************************************
	Procedure: 	TireSpec.UserSessionSearch
	Written By:	Dhruv Makadia
	Copyright: 	Tire Profiles, Inc.
	Procedure Created: 	2026/07/03
	Procedure Purpose: 	Creates the user session for TireSpec.

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
IF ( @JSONWebToken IS NULL )
BEGIN
	SELECT	@TpiError = 1
		, @RaiseErrorSeverity = 16
		, @RaiseErrorState = 1
		, @CustomErrorMessage =
		CASE
			WHEN ( @JSONWebToken IS NULL ) THEN 'Error. From JSONWebToken cannot be NULL.'
			ELSE 'Error. Invalid input parameters.'
		END
		, @SqlErrorMessage = 'SQL Error = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_NUMBER () ), 'Not a SQL Error' ) + ''''
			+ ', Line = ''' + ISNULL ( CONVERT ( NVARCHAR ( MAX ), ERROR_LINE () ), 'Unknown Line' ) + ''''
			+ ', Message = ''' + ISNULL ( ERROR_MESSAGE (), 'Not a SQL Message' ) + ''''
END

IF ( @TpiError = 0 )
BEGIN
	BEGIN TRY
	SELECT	CASE
			WHEN EXISTS
			(
				SELECT	1
				FROM	TireSpec.UserSession AS u
				WHERE	u.JSONWebToken = @JSONWebToken
			)
			THEN CAST ( 1 AS BIT )
			ELSE CAST ( 0 AS BIT )
		END AS SessionExists
	END TRY
	BEGIN CATCH
		SELECT	@TpiError = 1
			, @RaiseErrorSeverity = ERROR_SEVERITY ()
			, @RaiseErrorState = ERROR_STATE ()
			, @CustomErrorMessage = 'Error while fetching UserSession'
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
		+ 'Parameters: @JSONWebToken = ''' + ISNULL ( @JSONWebToken , 'NULL' ) + ''''
		+ CHAR ( 13 ) + CHAR ( 10 )
		+ @SqlErrorMessage

	RAISERROR ( '%s', @RaiseErrorSeverity, @RaiseErrorState, @TpiErrorDescription )
END

SET NOCOUNT OFF
GO