using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TireSpec.Api.Contracts;

namespace TireSpec.Api.Controllers;

[ApiController]
[Route("api/contact")]
[Authorize]
public sealed class ContactController : ControllerBase
{
    [HttpPost]
    public ActionResult<ContactResponse> Post([FromBody] ContactRequest request)
    {
        return Ok(new ContactResponse(
            "received",
            "Thanks. A dealer representative will contact you shortly."));
    }
}
