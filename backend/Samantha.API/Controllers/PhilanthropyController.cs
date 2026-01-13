using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhilanthropyController : ControllerBase
{
    private readonly AppDbContext _context;

    public PhilanthropyController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Philanthropy>>> GetPhilanthropies()
    {
        return await _context.Philanthropies.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Philanthropy>> GetPhilanthropy(int id)
    {
        var philanthropy = await _context.Philanthropies.FindAsync(id);

        if (philanthropy == null)
        {
            return NotFound();
        }

        return philanthropy;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Philanthropy>> CreatePhilanthropy(Philanthropy philanthropy)
    {
        _context.Philanthropies.Add(philanthropy);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPhilanthropy", new { id = philanthropy.Id }, philanthropy);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePhilanthropy(int id, Philanthropy philanthropy)
    {
        if (id != philanthropy.Id)
        {
            return BadRequest();
        }

        _context.Entry(philanthropy).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Philanthropies.Any(e => e.Id == id))
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
    public async Task<IActionResult> DeletePhilanthropy(int id)
    {
        var philanthropy = await _context.Philanthropies.FindAsync(id);
        if (philanthropy == null)
        {
            return NotFound();
        }

        _context.Philanthropies.Remove(philanthropy);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
