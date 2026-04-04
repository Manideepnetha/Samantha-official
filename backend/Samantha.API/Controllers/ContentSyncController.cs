using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Samantha.API.Data;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ContentSyncController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContentSyncController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("refresh")]
    public IActionResult RefreshContent()
    {
        var result = FrontendContentSync.ForceRefresh(_context);
        return Ok(result);
    }
}
