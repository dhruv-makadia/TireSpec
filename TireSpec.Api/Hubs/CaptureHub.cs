using Microsoft.AspNetCore.SignalR;

namespace TireSpec.Api.Hubs;

public sealed class CaptureHub : Hub
{
    public async Task JoinSession(string sessionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        await Clients.Group(sessionId).SendAsync("CaptureStatus", new
        {
            sessionId,
            status = "connected",
            connectionId = Context.ConnectionId
        });
    }

    public async Task LeaveSession(string sessionId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
        await Clients.Group(sessionId).SendAsync("CaptureStatus", new
        {
            sessionId,
            status = "disconnected",
            connectionId = Context.ConnectionId
        });
    }

    public async Task TriggerQuoteOnDesktop(string sessionId, Contracts.QuoteRequest quoteRequest)
    {
        await Clients.Group(sessionId).SendAsync("QuoteRequestTriggered", new
        {
            sessionId,
            quoteRequest
        });
    }
}
