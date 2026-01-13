using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FashionController : ControllerBase
{
    private readonly AppDbContext _context;

    public FashionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FashionItem>>> GetFashion()
    {
        return await _context.FashionItems.ToListAsync();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<FashionItem>> CreateFashion(FashionItem item)
    {
        _context.FashionItems.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFashion), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateFashion(int id, FashionItem item)
    {
        if (id != item.Id) return BadRequest();
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteFashion(int id)
    {
        var item = await _context.FashionItems.FindAsync(id);
        if (item == null) return NotFound();
        _context.FashionItems.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
