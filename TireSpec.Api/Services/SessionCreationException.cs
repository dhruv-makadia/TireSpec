namespace TireSpec.Api.Services;

public sealed class SessionCreationException : Exception
{
    public SessionCreationException(string message)
        : base(message)
    {
    }

    public SessionCreationException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
