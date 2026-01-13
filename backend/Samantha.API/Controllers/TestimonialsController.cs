using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TestimonialsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Testimonial>>> GetTestimonials()
    {
        return await _context.Testimonials.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Testimonial>> GetTestimonial(int id)
    {
        var testimonial = await _context.Testimonials.FindAsync(id);

        if (testimonial == null)
        {
            return NotFound();
        }

        return testimonial;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Testimonial>> PostTestimonial(Testimonial testimonial)
    {
        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTestimonial), new { id = testimonial.Id }, testimonial);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutTestimonial(int id, Testimonial testimonial)
    {
        if (id != testimonial.Id)
        {
            return BadRequest();
        }

        _context.Entry(testimonial).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Testimonials.Any(e => e.Id == id))
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

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTestimonial(int id)
    {
        var testimonial = await _context.Testimonials.FindAsync(id);
        if (testimonial == null)
        {
            return NotFound();
        }

        _context.Testimonials.Remove(testimonial);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
