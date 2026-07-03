namespace TireSpec.Api.Services;

public interface IUserSessionValidator
{
    Task<bool> UserSessionExistsAsync(Guid userSessionId, CancellationToken cancellationToken = default);
}
