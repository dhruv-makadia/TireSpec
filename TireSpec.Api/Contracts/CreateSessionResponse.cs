namespace TireSpec.Api.Contracts;

public sealed record CreateSessionResponse(DateTimeOffset Expire, string Jwt);
