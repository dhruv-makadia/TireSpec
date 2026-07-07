using System.Data;
using Microsoft.Data.SqlClient;

namespace TireSpec.Api.Services;

public sealed class UserSessionValidator(IConfiguration configuration, ILogger<UserSessionValidator> logger) : IUserSessionValidator
{
    private readonly string _connectionString = configuration.GetConnectionString("TireSpec") ?? string.Empty;

    public async Task<bool> UserSessionExistsAsync(string jwt, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_connectionString))
        {
            logger.LogWarning("TireSpec connection string is not configured. Bypassing session validation.");
            return true;
        }

        await using SqlConnection connection = new SqlConnection(_connectionString);
        await using SqlCommand command = new SqlCommand("TireSpec.UserSessionSearch", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.Add(new SqlParameter("@JSONWebToken", SqlDbType.NVarChar)
        {
            Value = jwt
        });

        object? result;

        try
        {
            await connection.OpenAsync(cancellationToken);
            result = await command.ExecuteScalarAsync(cancellationToken);
        }
        catch (SqlException ex)
        {
            logger.LogWarning(ex, "Session validation stored procedure failed. Bypassing validation.");
            return true;
        }

        if (result is bool exists) return exists;

        if (result is int intValue) return intValue == 1;

        if (result is byte byteValue) return byteValue == 1;

        return false;
    }
}
