using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitorEntriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VisitorEntriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<object>> RecordVisit([FromBody] RecordVisitorEntryRequest request)
    {
        var clientVisitorId = request.ClientVisitorId.Trim();
        var name = request.Name.Trim();

        if (string.IsNullOrWhiteSpace(clientVisitorId))
        {
            return BadRequest(new { message = "A client visitor id is required." });
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new { message = "Visitor name is required." });
        }

        var socialMediaId = NormalizeOptionalText(request.SocialMediaId);
        var source = NormalizeOptionalText(request.Source);
        var now = DateTime.UtcNow;

        var existing = await _context.VisitorEntries.FirstOrDefaultAsync(item => item.ClientVisitorId == clientVisitorId);
        var isFirstVisit = existing == null;

        if (existing == null)
        {
            existing = new VisitorEntry
            {
                ClientVisitorId = clientVisitorId,
                Name = name,
                SocialMediaId = socialMediaId,
                Source = source,
                UserAgent = NormalizeOptionalText(Request.Headers.UserAgent.ToString()),
                IpAddress = NormalizeOptionalText(HttpContext.Connection.RemoteIpAddress?.ToString()),
                FirstCompletedAt = now,
                LastCompletedAt = now
            };

            _context.VisitorEntries.Add(existing);
        }
        else
        {
            existing.Name = name;
            existing.SocialMediaId = socialMediaId;
            existing.Source = source;
            existing.UserAgent = NormalizeOptionalText(Request.Headers.UserAgent.ToString());
            existing.IpAddress = NormalizeOptionalText(HttpContext.Connection.RemoteIpAddress?.ToString());
            existing.LastCompletedAt = now;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            existing.Id,
            existing.ClientVisitorId,
            existing.Name,
            existing.SocialMediaId,
            existing.Source,
            existing.UserAgent,
            existing.IpAddress,
            existing.FirstCompletedAt,
            existing.LastCompletedAt,
            isFirstVisit
        });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<VisitorEntry>>> GetVisitorEntries()
    {
        return await _context.VisitorEntries
            .AsNoTracking()
            .OrderByDescending(item => item.LastCompletedAt)
            .ToListAsync();
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
