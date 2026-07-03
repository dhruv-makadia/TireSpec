using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TireSpec.Api.Contracts;

namespace TireSpec.Api.Controllers;

[ApiController]
[Route("api/tire-scan")]
[Authorize]
public sealed class TireScanController : ControllerBase
{
    [HttpPost]
    public ActionResult<TireScanResponse> Post([FromBody] TireScanRequest request)
    {
        var result = new TireScanResponse(
            request.ImageDataUrl,
            request.ManualData?.Brand ?? "Michelin",
            request.ManualData?.Model ?? "Defender 2",
            request.ManualData?.TireSize ?? "225/60R17",
            request.ManualData?.DotCode ?? "DOT 1A2B 3C4D",
            request.ManualData?.DotYear ?? "2024",
            request.ManualData?.LoadIndex ?? "99",
            request.ManualData?.SpeedRating ?? "H");

        return Ok(result);
    }
}
