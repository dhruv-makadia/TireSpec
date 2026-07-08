using Microsoft.AspNetCore.SignalR;

namespace TireSpec.Api.Hubs;

public sealed class CaptureHub : Hub
{
    public async Task JoinSession(string jwt)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, jwt);
        await Clients.Group(jwt).SendAsync("CaptureStatus", new
        {
            jwt,
            status = "connected",
            connectionId = Context.ConnectionId
        });
    }

    public async Task LeaveSession(string jwt)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, jwt);
        await Clients.Group(jwt).SendAsync("CaptureStatus", new
        {
            jwt,
            status = "disconnected",
            connectionId = Context.ConnectionId
        });
    }

    public async Task TriggerQuoteOnDesktop(string jwt, Contracts.QuoteRequest quoteRequest)
    {
        await Clients.Group(jwt).SendAsync("QuoteRequestTriggered", new
        {
            jwt,
            quoteRequest
        });
    }
}
