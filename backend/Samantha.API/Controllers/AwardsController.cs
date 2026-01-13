using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace Samantha.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AwardsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AwardsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Award>>> GetAwards()
    {
        return await _context.Awards.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Award>> GetAward(int id)
    {
        var award = await _context.Awards.FindAsync(id);

        if (award == null)
        {
            return NotFound();
        }

        return award;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Award>> PostAward(Award award)
    {
        _context.Awards.Add(award);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetAward", new { id = award.Id }, award);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAward(int id, Award award)
    {
        if (id != award.Id)
        {
            return BadRequest();
        }

        _context.Entry(award).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AwardExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAward(int id)
    {
        var award = await _context.Awards.FindAsync(id);
        if (award == null)
        {
            return NotFound();
        }

        _context.Awards.Remove(award);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AwardExists(int id)
    {
        return _context.Awards.Any(e => e.Id == id);
    }
}
