using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FanWallController : ControllerBase
{
    private readonly AppDbContext _context;

    public FanWallController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FanWallMessage>>> GetApprovedMessages()
    {
        return Ok(await _context.FanWallMessages
            .AsNoTracking()
            .Where(message => message.Status == "Approved")
            .OrderByDescending(message => message.CreatedAt)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<FanWallMessage>> SubmitMessage(FanWallMessage message)
    {
        var normalized = Normalize(message);
        if (normalized is not null)
        {
            return normalized;
        }

        message.Status = "Pending";
        message.CreatedAt = DateTime.UtcNow;

        _context.FanWallMessages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApprovedMessages), new { id = message.Id }, message);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<FanWallMessage>>> GetAllMessages()
    {
        return Ok(await _context.FanWallMessages
            .AsNoTracking()
            .OrderBy(message => message.Status == "Pending" ? 0 : message.Status == "Approved" ? 1 : 2)
            .ThenByDescending(message => message.CreatedAt)
            .ToListAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public async Task<ActionResult<FanWallMessage>> UpdateStatus(int id, UpdateFanWallStatusRequest request)
    {
        var message = await _context.FanWallMessages.FindAsync(id);
        if (message == null)
        {
            return NotFound();
        }

        var status = NormalizeStatus(request.Status);
        if (status == null)
        {
            return BadRequest(new { message = "Status must be Pending, Approved, or Rejected." });
        }

        message.Status = status;
        await _context.SaveChangesAsync();

        return Ok(message);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var message = await _context.FanWallMessages.FindAsync(id);
        if (message == null)
        {
            return NotFound();
        }

        _context.FanWallMessages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private ActionResult? Normalize(FanWallMessage message)
    {
        message.Name = message.Name?.Trim() ?? string.Empty;
        message.City = string.IsNullOrWhiteSpace(message.City) ? null : message.City.Trim();
        message.Message = message.Message?.Trim() ?? string.Empty;

        if (message.Name.Length < 2 || message.Name.Length > 60)
        {
            return BadRequest(new { message = "Name should be between 2 and 60 characters." });
        }

        if (message.City is { Length: > 60 })
        {
            return BadRequest(new { message = "City should be 60 characters or fewer." });
        }

        if (message.Message.Length < 6 || message.Message.Length > 150)
        {
            return BadRequest(new { message = "Message should be between 6 and 150 characters." });
        }

        return null;
    }

    private static string? NormalizeStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return null;
        }

        return status.Trim().ToLowerInvariant() switch
        {
            "pending" => "Pending",
            "approved" => "Approved",
            "rejected" => "Rejected",
            _ => null
        };
    }
}
