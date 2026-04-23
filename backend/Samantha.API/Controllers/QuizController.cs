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

    // POST /api/quiz/submit - save or improve a quiz result
    [HttpPost("submit")]
    public async Task<ActionResult<LeaderboardEntry>> Submit(QuizEntry entry)
    {
        entry.ClientSubmissionId = NormalizeOptionalText(entry.ClientSubmissionId);
        entry.Email = NormalizeEmail(entry.Email);
        entry.Name = NormalizeRequiredText(entry.Name);
        entry.City = NormalizeOptionalText(entry.City);

        if (string.IsNullOrWhiteSpace(entry.Name) || entry.Name.Length > 80)
        {
            return BadRequest(new { message = "Name is required and must be 80 characters or fewer." });
        }

        if (string.IsNullOrWhiteSpace(entry.Email) || !entry.Email.Contains('@'))
        {
            return BadRequest(new { message = "A valid email is required." });
        }

        if (entry.City is { Length: > 80 })
        {
            return BadRequest(new { message = "City must be 80 characters or fewer." });
        }

        if (entry.TotalQuestions <= 0 || entry.TotalQuestions > 100)
        {
            return BadRequest(new { message = "Total questions must be between 1 and 100." });
        }

        if (entry.Score < 0)
        {
            return BadRequest(new { message = "Score cannot be negative." });
        }

        if (entry.TimeTakenSeconds < 0)
        {
            return BadRequest(new { message = "Time taken cannot be negative." });
        }

        if (!string.IsNullOrWhiteSpace(entry.ClientSubmissionId))
        {
            var existingBySubmissionId = await _context.QuizEntries
                .FirstOrDefaultAsync(q => q.ClientSubmissionId == entry.ClientSubmissionId);

            if (existingBySubmissionId != null)
            {
                return Ok(await BuildLeaderboardEntry(existingBySubmissionId));
            }
        }

        var today = DateTime.UtcNow.Date;
        var existing = await _context.QuizEntries
            .Where(q => q.Email == entry.Email && q.SubmittedAt.Date == today)
            .FirstOrDefaultAsync();

        if (existing != null)
        {
            var shouldUpdate = entry.Score > existing.Score
                || (entry.Score == existing.Score && entry.TimeTakenSeconds < existing.TimeTakenSeconds);

            if (shouldUpdate)
            {
                existing.ClientSubmissionId = entry.ClientSubmissionId ?? existing.ClientSubmissionId;
                existing.Name = entry.Name;
                existing.City = entry.City;
                existing.Score = entry.Score;
                existing.TotalQuestions = entry.TotalQuestions;
                existing.TimeTakenSeconds = entry.TimeTakenSeconds;
                existing.SubmittedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok(await BuildLeaderboardEntry(existing));
        }

        entry.ClientSubmissionId ??= Guid.NewGuid().ToString("N");
        entry.SubmittedAt = DateTime.UtcNow;
        _context.QuizEntries.Add(entry);
        await _context.SaveChangesAsync();

        var leaderboardEntry = await BuildLeaderboardEntry(entry);
        return CreatedAtAction(nameof(GetPlayerEntry), new { email = entry.Email }, leaderboardEntry);
    }

    // GET /api/quiz/leaderboard - all-time leaderboard, optional limit
    [HttpGet("leaderboard")]
    public async Task<ActionResult<IEnumerable<LeaderboardEntry>>> GetLeaderboard([FromQuery] int? limit = null)
    {
        IQueryable<QuizEntry> query = _context.QuizEntries
            .AsNoTracking()
            .OrderByDescending(q => q.Score)
            .ThenBy(q => q.TimeTakenSeconds)
            .ThenByDescending(q => q.SubmittedAt);

        if (limit is > 0)
        {
            query = query.Take(limit.Value);
        }

        var entries = await query
            .Select(q => new LeaderboardEntry
            {
                Rank = 0,
                Name = q.Name,
                City = q.City ?? "N/A",
                Score = q.Score,
                TotalQuestions = q.TotalQuestions,
                TimeTakenSeconds = q.TimeTakenSeconds,
                SubmittedAt = q.SubmittedAt
            })
            .ToListAsync();

        for (var i = 0; i < entries.Count; i++)
        {
            entries[i].Rank = i + 1;
        }

        return Ok(entries);
    }

    // GET /api/quiz/entry?email=x - best result for a player, including global rank
    [HttpGet("entry")]
    public async Task<ActionResult<LeaderboardEntry>> GetPlayerEntry([FromQuery] string email)
    {
        var normalizedEmail = NormalizeEmail(email);
        if (string.IsNullOrWhiteSpace(normalizedEmail))
        {
            return BadRequest(new { message = "Email is required." });
        }

        var entry = await _context.QuizEntries
            .Where(q => q.Email == normalizedEmail)
            .OrderByDescending(q => q.Score)
            .ThenBy(q => q.TimeTakenSeconds)
            .ThenByDescending(q => q.SubmittedAt)
            .FirstOrDefaultAsync();

        if (entry == null)
        {
            return NotFound();
        }

        return Ok(await BuildLeaderboardEntry(entry));
    }

    // GET /api/quiz/check?email=x - check if already played today
    [HttpGet("check")]
    public async Task<ActionResult<object>> CheckPlayed([FromQuery] string email)
    {
        var normalizedEmail = NormalizeEmail(email);
        var today = DateTime.UtcNow.Date;

        var existing = await _context.QuizEntries
            .Where(q => q.Email == normalizedEmail && q.SubmittedAt.Date == today)
            .FirstOrDefaultAsync();

        return Ok(new { played = existing != null, score = existing?.Score ?? 0 });
    }

    private async Task<LeaderboardEntry> BuildLeaderboardEntry(QuizEntry entry)
    {
        var higherRankCount = await _context.QuizEntries.CountAsync(q =>
            q.Score > entry.Score
            || (q.Score == entry.Score && q.TimeTakenSeconds < entry.TimeTakenSeconds)
            || (q.Score == entry.Score && q.TimeTakenSeconds == entry.TimeTakenSeconds && q.SubmittedAt > entry.SubmittedAt));

        return new LeaderboardEntry
        {
            Rank = higherRankCount + 1,
            Name = entry.Name,
            City = entry.City ?? "N/A",
            Score = entry.Score,
            TotalQuestions = entry.TotalQuestions,
            TimeTakenSeconds = entry.TimeTakenSeconds,
            SubmittedAt = entry.SubmittedAt
        };
    }

    private static string NormalizeEmail(string? email)
    {
        return string.IsNullOrWhiteSpace(email)
            ? string.Empty
            : email.Trim().ToLowerInvariant();
    }

    private static string NormalizeRequiredText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}

public class LeaderboardEntry
{
    public int Rank { get; set; }
    public required string Name { get; set; }
    public string City { get; set; } = "N/A";
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int TimeTakenSeconds { get; set; }
    public DateTime SubmittedAt { get; set; }
}
