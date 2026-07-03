using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TireSpec.Api.Contracts;

namespace TireSpec.Api.Controllers;

[ApiController]
[Route("api/quotes")]
[Authorize]
public sealed class QuoteController : ControllerBase
{
    [HttpPost]
    public ActionResult<QuoteResponse> Post([FromBody] QuoteRequest request)
    {
        var tires = new[]
        {
            new TireQuote("rec-1", "Michelin Defender 2", "$182.99", "All-season touring tire with long tread life and quiet road manners.", "70,000 mile limited warranty", request.TireSize),
            new TireQuote("rec-2", "Continental TrueContact Tour", "$169.50", "Balanced wet braking, fuel efficiency, and daily comfort.", "80,000 mile limited warranty", request.TireSize),
            new TireQuote("rec-3", "Goodyear Assurance ComfortDrive", "$176.25", "Comfort-focused replacement tire with confident all-weather traction.", "60,000 mile limited warranty", request.TireSize)
        };

        return Ok(new QuoteResponse(tires));
    }
}
