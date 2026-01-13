using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsArticle>>> GetNews()
    {
        return await _context.NewsArticles.ToListAsync();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<NewsArticle>> CreateNews(NewsArticle news)
    {
        _context.NewsArticles.Add(news);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNews), new { id = news.Id }, news);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateNews(int id, NewsArticle news)
    {
        if (id != news.Id) return BadRequest();
        _context.Entry(news).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteNews(int id)
    {
        var news = await _context.NewsArticles.FindAsync(id);
        if (news == null) return NotFound();
        _context.NewsArticles.Remove(news);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
