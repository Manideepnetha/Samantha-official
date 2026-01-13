using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ContactMessage>> PostContactMessage(ContactMessage message)
    {
        message.SubmittedAt = DateTime.UtcNow; // Ensure server time
        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        // Return 201 Created but maybe don't return the message object if sensitive in some contexts, 
        // but for now standard practice is fine.
        return CreatedAtAction(nameof(GetContactMessage), new { id = message.Id }, message);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetContactMessages()
    {
        return await _context.ContactMessages.OrderByDescending(m => m.SubmittedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ContactMessage>> GetContactMessage(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);

        if (message == null)
        {
            return NotFound();
        }

        return message;
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteContactMessage(int id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null)
        {
            return NotFound();
        }

        _context.ContactMessages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
