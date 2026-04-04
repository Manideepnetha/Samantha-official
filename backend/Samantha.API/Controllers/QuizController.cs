using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuizController(AppDbContext context)
    {
        _context = context;
    }

    // POST /api/quiz/submit — save a quiz result
    [HttpPost("submit")]
    public async Task<ActionResult<QuizEntry>> Submit(QuizEntry entry)
    {
        // Prevent duplicate submissions from same email on same day
        var today = DateTime.UtcNow.Date;
        var existing = await _context.QuizEntries
            .Where(q => q.Email == entry.Email && q.SubmittedAt.Date == today)
            .FirstOrDefaultAsync();

        if (existing != null)
        {
            // Update if they scored higher
            if (entry.Score > existing.Score)
            {
                existing.Score = entry.Score;
                existing.TimeTakenSeconds = entry.TimeTakenSeconds;
                existing.SubmittedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            return Ok(existing);
        }

        entry.SubmittedAt = DateTime.UtcNow;
        _context.QuizEntries.Add(entry);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetLeaderboard), entry);
    }

    // GET /api/quiz/leaderboard — top 20 all-time
    [HttpGet("leaderboard")]
    public async Task<ActionResult<IEnumerable<LeaderboardEntry>>> GetLeaderboard()
    {
        var entries = await _context.QuizEntries
            .OrderByDescending(q => q.Score)
            .ThenBy(q => q.TimeTakenSeconds)
            .ThenByDescending(q => q.SubmittedAt)
            .Take(20)
            .Select(q => new LeaderboardEntry
            {
                Rank = 0,
                Name = q.Name,
                City = q.City ?? "—",
                Score = q.Score,
                TotalQuestions = q.TotalQuestions,
                TimeTakenSeconds = q.TimeTakenSeconds,
                SubmittedAt = q.SubmittedAt
            })
            .ToListAsync();

        for (int i = 0; i < entries.Count; i++)
            entries[i].Rank = i + 1;

        return Ok(entries);
    }

    // GET /api/quiz/check?email=x — check if already played today
    [HttpGet("check")]
    public async Task<ActionResult<object>> CheckPlayed([FromQuery] string email)
    {
        var today = DateTime.UtcNow.Date;
        var existing = await _context.QuizEntries
            .Where(q => q.Email == email && q.SubmittedAt.Date == today)
            .FirstOrDefaultAsync();

        return Ok(new { played = existing != null, score = existing?.Score ?? 0 });
    }
}

public class LeaderboardEntry
{
    public int Rank { get; set; }
    public required string Name { get; set; }
    public string City { get; set; } = "—";
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int TimeTakenSeconds { get; set; }
    public DateTime SubmittedAt { get; set; }
}
