using Microsoft.AspNetCore.Mvc;
using TireSpec.Api.Contracts;
using TireSpec.Api.Services;

namespace TireSpec.Api.Controllers;

[ApiController]
[Route("api/sessions")]
public sealed class SessionController(ISessionService sessionService) : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<CreateSessionResponse>> Create(
        [FromBody] CreateSessionRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await sessionService.CreateSessionAsync(request.WebsiteId, cancellationToken));
        }
        catch (SessionCreationException exception)
        {
            return BadRequest(new ErrorResponse(exception.Message));
        }
    }
}
