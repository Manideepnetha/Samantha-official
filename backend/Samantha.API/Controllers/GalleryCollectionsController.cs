using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryCollectionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public GalleryCollectionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GalleryCollection>>> GetGalleryCollections()
    {
        return await _context.GalleryCollections
            .AsNoTracking()
            .OrderBy(item => item.SortOrder)
            .ThenBy(item => item.Title)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GalleryCollection>> GetGalleryCollection(int id)
    {
        var collection = await _context.GalleryCollections.FindAsync(id);
        if (collection == null)
        {
            return NotFound();
        }

        return collection;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<GalleryCollection>> CreateGalleryCollection(GalleryCollection collection)
    {
        collection.Key = NormalizeKey(collection.Key, collection.Title);

        if (await _context.GalleryCollections.AnyAsync(item => item.Key == collection.Key))
        {
            return Conflict(new { message = "A gallery set with this key already exists." });
        }

        _context.GalleryCollections.Add(collection);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGalleryCollection), new { id = collection.Id }, collection);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGalleryCollection(int id, GalleryCollection collection)
    {
        if (id != collection.Id)
        {
            return BadRequest();
        }

        var existing = await _context.GalleryCollections.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        var oldKey = existing.Key;
        var normalizedKey = NormalizeKey(collection.Key, collection.Title);

        if (await _context.GalleryCollections.AnyAsync(item => item.Id != id && item.Key == normalizedKey))
        {
            return Conflict(new { message = "A gallery set with this key already exists." });
        }

        existing.Key = normalizedKey;
        existing.Title = collection.Title;
        existing.Subtitle = collection.Subtitle;
        existing.Description = collection.Description;
        existing.Category = collection.Category;
        existing.CoverImageUrl = collection.CoverImageUrl;
        existing.AccentTone = collection.AccentTone;
        existing.SortOrder = collection.SortOrder;

        if (!string.Equals(oldKey, normalizedKey, StringComparison.Ordinal))
        {
            var linkedItems = await _context.MediaGalleries
                .Where(item => item.CollectionKey == oldKey)
                .ToListAsync();

            foreach (var item in linkedItems)
            {
                item.CollectionKey = normalizedKey;
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGalleryCollection(int id)
    {
        var collection = await _context.GalleryCollections.FindAsync(id);
        if (collection == null)
        {
            return NotFound();
        }

        var linkedItems = await _context.MediaGalleries
            .Where(item => item.CollectionKey == collection.Key)
            .ToListAsync();

        foreach (var item in linkedItems)
        {
            item.CollectionKey = null;
        }

        _context.GalleryCollections.Remove(collection);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static string NormalizeKey(string? key, string fallbackTitle)
    {
        var source = string.IsNullOrWhiteSpace(key) ? fallbackTitle : key;
        var normalized = Regex.Replace(source.Trim().ToLowerInvariant(), @"[^a-z0-9]+", "-").Trim('-');
        return string.IsNullOrWhiteSpace(normalized) ? $"gallery-set-{Guid.NewGuid():N}" : normalized;
    }
}
