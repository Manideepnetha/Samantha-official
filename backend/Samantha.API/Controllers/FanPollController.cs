using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FanPollController : ControllerBase
{
    private static readonly Dictionary<string, PollDefinition> Polls = new(StringComparer.OrdinalIgnoreCase)
    {
        ["favorite-samantha-movie"] = new(
            "favorite-samantha-movie",
            "Favorite Samantha Movie",
            new[]
            {
                new PollOptionDefinition("ye-maaya-chesave", "Ye Maaya Chesave"),
                new PollOptionDefinition("eega", "Eega"),
                new PollOptionDefinition("mahanati", "Mahanati"),
                new PollOptionDefinition("the-family-man-2", "The Family Man 2"),
                new PollOptionDefinition("citadel-honey-bunny", "Citadel: Honey Bunny")
            })
    };

    private readonly AppDbContext _context;

    public FanPollController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{pollKey}")]
    public async Task<ActionResult<FanPollResultResponse>> GetPoll(string pollKey, [FromQuery] string? clientId = null)
    {
        var definition = GetDefinition(pollKey);
        if (definition is null)
        {
            return NotFound();
        }

        return Ok(await BuildResultAsync(definition, NormalizeClientId(clientId)));
    }

    [HttpPost("{pollKey}/vote")]
    public async Task<ActionResult<FanPollResultResponse>> Vote(string pollKey, SubmitFanPollVoteRequest request)
    {
        var definition = GetDefinition(pollKey);
        if (definition is null)
        {
            return NotFound();
        }

        var clientId = NormalizeClientId(request.ClientId);
        if (string.IsNullOrWhiteSpace(clientId))
        {
            return BadRequest(new { message = "A valid client identifier is required." });
        }

        var option = definition.Options.FirstOrDefault(item => item.Key == request.OptionKey?.Trim());
        if (option is null)
        {
            return BadRequest(new { message = "Selected option is invalid." });
        }

        var existingVote = await _context.FanPollVotes
            .AsNoTracking()
            .FirstOrDefaultAsync(vote => vote.PollKey == definition.Key && vote.ClientId == clientId);

        if (existingVote != null)
        {
            var existingResult = await BuildResultAsync(definition, clientId);
            return Conflict(existingResult);
        }

        _context.FanPollVotes.Add(new FanPollVote
        {
            PollKey = definition.Key,
            OptionKey = option.Key,
            ClientId = clientId,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
        return Ok(await BuildResultAsync(definition, clientId));
    }

    private async Task<FanPollResultResponse> BuildResultAsync(PollDefinition definition, string? clientId)
    {
        var votes = await _context.FanPollVotes
            .AsNoTracking()
            .Where(vote => vote.PollKey == definition.Key)
            .ToListAsync();

        var totalVotes = votes.Count;
        var userVote = clientId is null
            ? null
            : votes.FirstOrDefault(vote => vote.ClientId == clientId)?.OptionKey;

        var options = definition.Options
            .Select(option =>
            {
                var voteCount = votes.Count(vote => vote.OptionKey == option.Key);
                var percentage = totalVotes == 0
                    ? 0
                    : Math.Round((double)voteCount / totalVotes * 100, 1);

                return new FanPollOptionResultResponse(option.Key, option.Label, voteCount, percentage);
            })
            .ToList();

        return new FanPollResultResponse(definition.Key, definition.Title, totalVotes, userVote is not null, userVote, options);
    }

    private static PollDefinition? GetDefinition(string? pollKey)
    {
        if (string.IsNullOrWhiteSpace(pollKey))
        {
            return null;
        }

        Polls.TryGetValue(pollKey.Trim(), out var definition);
        return definition;
    }

    private static string? NormalizeClientId(string? clientId)
    {
        if (string.IsNullOrWhiteSpace(clientId))
        {
            return null;
        }

        return clientId.Trim();
    }
}

public sealed record PollDefinition(
    string Key,
    string Title,
    IReadOnlyList<PollOptionDefinition> Options);

public sealed record PollOptionDefinition(
    string Key,
    string Label);

public sealed record FanPollResultResponse(
    string PollKey,
    string Title,
    int TotalVotes,
    bool HasVoted,
    string? UserOptionKey,
    IReadOnlyList<FanPollOptionResultResponse> Options);

public sealed record FanPollOptionResultResponse(
    string OptionKey,
    string Label,
    int Votes,
    double Percentage);
