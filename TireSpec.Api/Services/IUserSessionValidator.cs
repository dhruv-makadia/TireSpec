namespace TireSpec.Api.Services;

public interface IUserSessionValidator
{
    Task<bool> UserSessionExistsAsync(string jwt, CancellationToken cancellationToken = default);
}
