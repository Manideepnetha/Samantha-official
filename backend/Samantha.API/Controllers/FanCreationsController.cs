using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FanCreationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FanCreationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FanCreation>>> GetFanCreations()
    {
        return await _context.FanCreations
            .AsNoTracking()
            .OrderByDescending(item => item.IsFeatured)
            .ThenByDescending(item => item.Id)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FanCreation>> GetFanCreation(int id)
    {
        var fanCreation = await _context.FanCreations.FindAsync(id);

        if (fanCreation == null)
        {
            return NotFound();
        }

        return fanCreation;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<FanCreation>> PostFanCreation(FanCreation fanCreation)
    {
        _context.FanCreations.Add(fanCreation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFanCreation), new { id = fanCreation.Id }, fanCreation);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutFanCreation(int id, FanCreation fanCreation)
    {
        if (id != fanCreation.Id)
        {
            return BadRequest();
        }

        _context.Entry(fanCreation).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.FanCreations.AnyAsync(item => item.Id == id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFanCreation(int id)
    {
        var fanCreation = await _context.FanCreations.FindAsync(id);
        if (fanCreation == null)
        {
            return NotFound();
        }

        _context.FanCreations.Remove(fanCreation);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
