using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MediaGalleryController : ControllerBase
{
    private readonly AppDbContext _context;

    public MediaGalleryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MediaGallery>>> GetMediaGalleries()
    {
        return await _context.MediaGalleries.ToListAsync();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MediaGallery>> CreateMediaGallery(MediaGallery media)
    {
        _context.MediaGalleries.Add(media);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMediaGalleries), new { id = media.Id }, media);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateMediaGallery(int id, MediaGallery media)
    {
        if (id != media.Id) return BadRequest();
        _context.Entry(media).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteMediaGallery(int id)
    {
        var media = await _context.MediaGalleries.FindAsync(id);
        if (media == null) return NotFound();
        _context.MediaGalleries.Remove(media);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
