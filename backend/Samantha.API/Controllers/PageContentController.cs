using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PageContentController : ControllerBase
{
    private readonly AppDbContext _context;

    public PageContentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{key}")]
    public async Task<IActionResult> GetPageContent(string key)
    {
        var pageContent = await _context.PageContents
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Key == key);

        if (pageContent == null)
        {
            return NotFound();
        }

        return Content(pageContent.ContentJson, "application/json");
    }

    [HttpPost("{key}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PageContent>> UpsertPageContent(string key, [FromBody] JsonElement payload)
    {
        if (payload.ValueKind == JsonValueKind.Undefined || payload.ValueKind == JsonValueKind.Null)
        {
            return BadRequest(new { message = "Page content payload is required." });
        }

        var contentJson = payload.GetRawText();
        var existing = await _context.PageContents.FirstOrDefaultAsync(item => item.Key == key);

        if (existing == null)
        {
            existing = new PageContent
            {
                Key = key,
                ContentJson = contentJson,
                UpdatedAt = DateTime.UtcNow
            };
            _context.PageContents.Add(existing);
        }
        else
        {
            existing.ContentJson = contentJson;
            existing.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(existing);
    }
}
