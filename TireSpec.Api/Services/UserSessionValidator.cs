using System.Data;
using Microsoft.Data.SqlClient;

namespace TireSpec.Api.Services;

public sealed class UserSessionValidator(IConfiguration configuration) : IUserSessionValidator
{
    private readonly string _connectionString = configuration.GetConnectionString("TireSpec") ?? string.Empty;

    public async Task<bool> UserSessionExistsAsync(Guid userSessionId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_connectionString))
        {
            return false;
        }

        await using SqlConnection connection = new SqlConnection(_connectionString);
        await using SqlCommand command = new SqlCommand("TireSpec.UserSessionExists", connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.Add(new SqlParameter("@JSONWebToken", SqlDbType.UniqueIdentifier)
        {
            Value = userSessionId
        });

        object? result;

        try
        {
            await connection.OpenAsync(cancellationToken);
            result = await command.ExecuteScalarAsync(cancellationToken);
        }
        catch (SqlException)
        {
            return false;
        }

        if (result is bool exists) return exists;

        if (result is int intValue) return intValue == 1;

        if (result is byte byteValue) return byteValue == 1;

        return false;
    }
}
