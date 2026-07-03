using TireSpec.Api.Contracts;

namespace TireSpec.Api.Services;

public interface ISessionService
{
    Task<CreateSessionResponse> CreateSessionAsync(Guid websiteId, CancellationToken cancellationToken);
}
