using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using TireSpec.Api.Contracts;

namespace TireSpec.Api.Services;

public sealed class SessionService(IConfiguration configuration) : ISessionService
{
    private const string StoredProcedureName = "TireSpec.UserSessionCreate";

    public async Task<CreateSessionResponse> CreateSessionAsync(Guid websiteId, CancellationToken cancellationToken)
    {
        if (websiteId == Guid.Empty) throw new SessionCreationException("A valid website id is required.");

        Guid userSessionId = Guid.NewGuid();
        DateTimeOffset expire = DateTimeOffset.UtcNow.AddMinutes(GetSessionLifetimeMinutes());
        string jwt = CreateJsonWebToken(userSessionId, websiteId, expire);
        string? connectionString = configuration.GetConnectionString("TireSpec");

        if (string.IsNullOrWhiteSpace(connectionString)) throw new SessionCreationException("TireSpec database connection string is not configured.");

        await using SqlConnection connection = new SqlConnection(connectionString);
        await using SqlCommand command = new SqlCommand(StoredProcedureName, connection)
        {
            CommandType = CommandType.StoredProcedure
        };

        command.Parameters.Add(new("@UserSessionID", SqlDbType.UniqueIdentifier)
        {
            Value = userSessionId
        });
        command.Parameters.Add(new("@WebsiteID", SqlDbType.UniqueIdentifier)
        {
            Value = websiteId
        });
        command.Parameters.Add(new("@JSONWebToken", SqlDbType.NVarChar, -1)
        {
            Value = jwt
        });

        try
        {
            await connection.OpenAsync(cancellationToken);
            await command.ExecuteNonQueryAsync(cancellationToken);
        }
        catch (SqlException exception)
        {
            throw new SessionCreationException(exception.Message, exception);
        }

        return new CreateSessionResponse(expire, jwt);
    }

    private string CreateJsonWebToken(Guid userSessionId, Guid websiteId, DateTimeOffset expire)
    {
        string? secret = configuration["Session:JwtSecret"];

        if (string.IsNullOrWhiteSpace(secret))
        {
            throw new SessionCreationException("Session JWT secret is not configured.");
        }

        SymmetricSecurityKey signingKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secret));
        SecurityTokenDescriptor descriptor = new SecurityTokenDescriptor
        {
            Claims = new Dictionary<string, object>
            {
                ["UserSessionID"] = userSessionId.ToString("D"),
                ["WebsiteID"] = websiteId.ToString("D"),
                ["expire"] = expire.UtcDateTime.ToString("O")
            },
            Expires = expire.UtcDateTime,
            SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
        };

        return new JsonWebTokenHandler().CreateToken(descriptor);
    }

    private int GetSessionLifetimeMinutes()
    {
        int? configuredLifetime = configuration.GetValue<int?>("Session:LifetimeMinutes");
        return configuredLifetime is > 0 ? configuredLifetime.Value : 30;
    }
}
