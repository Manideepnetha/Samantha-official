using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SettingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SiteSetting>>> GetSettings()
    {
        return await _context.SiteSettings.ToListAsync();
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<SiteSetting>> GetSetting(string key)
    {
        var setting = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null) return NotFound();
        return setting;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SiteSetting>> UpsertSetting(SiteSetting setting)
    {
        var existing = await _context.SiteSettings.FirstOrDefaultAsync(s => s.Key == setting.Key);
        if (existing != null)
        {
            existing.Value = setting.Value;
            _context.Entry(existing).State = EntityState.Modified;
        }
        else
        {
            _context.SiteSettings.Add(setting);
        }

        await _context.SaveChangesAsync();
        return Ok(existing ?? setting);
    }
}
