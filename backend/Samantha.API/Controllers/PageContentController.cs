using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Samantha.API.Data;
using Samantha.API.Models;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PageContentController : ControllerBase
{
    private static readonly Regex LocalUploadUrlPattern = new(
        @"^https?://(?:localhost|127\.0\.0\.1)(?::\d+)?(?<path>/uploads/.*)$",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private readonly AppDbContext _context;

    public PageContentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{key}")]
    public async Task<IActionResult> GetPageContent(string key)
    {
        var pageContent = await _context.PageContents
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Key == key);

        if (pageContent == null)
        {
            if (!FrontendContentSync.TryGetDefaultPageContent(key, out _, out var fallbackContentJson))
            {
                return NotFound();
            }

            ApplyResponseHeaders(GetFallbackUpdatedAtUtc());
            return Content(NormalizePageContentJson(fallbackContentJson), "application/json");
        }

        ApplyResponseHeaders(pageContent.UpdatedAt);

        return Content(NormalizePageContentJson(pageContent.ContentJson), "application/json");
    }

    [HttpPost("{key}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PageContent>> UpsertPageContent(string key, [FromBody] JsonElement payload)
    {
        if (payload.ValueKind == JsonValueKind.Undefined || payload.ValueKind == JsonValueKind.Null)
        {
            return BadRequest(new { message = "Page content payload is required." });
        }

        var contentJson = NormalizePageContentJson(payload.GetRawText());
        var existing = await _context.PageContents.FirstOrDefaultAsync(item => item.Key == key);

        if (existing == null)
        {
            existing = new PageContent
            {
                Key = key,
                ContentJson = contentJson,
                UpdatedAt = DateTime.UtcNow
            };
            _context.PageContents.Add(existing);
        }
        else
        {
            existing.ContentJson = contentJson;
            existing.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    private void ApplyResponseHeaders(DateTime updatedAt)
    {
        var updatedAtUtc = updatedAt.ToUniversalTime();

        Response.Headers.CacheControl = "no-store, no-cache, max-age=0, must-revalidate";
        Response.Headers.Pragma = "no-cache";
        Response.Headers.Expires = "0";
        Response.Headers.ETag = $"W/\"{updatedAtUtc.Ticks}\"";
        Response.Headers.LastModified = updatedAtUtc.ToString("R");
        Response.Headers["X-Content-Updated-At"] = updatedAtUtc.ToString("O");
    }

    private string NormalizePageContentJson(string contentJson)
    {
        if (string.IsNullOrWhiteSpace(contentJson))
        {
            return contentJson;
        }

        var uploadsOrigin = GetUploadsOrigin();
        if (string.IsNullOrWhiteSpace(uploadsOrigin))
        {
            return contentJson;
        }

        try
        {
            var node = JsonNode.Parse(contentJson);
            if (node == null)
            {
                return contentJson;
            }

            NormalizeUploadUrls(node, uploadsOrigin);
            return node.ToJsonString();
        }
        catch (JsonException)
        {
            return contentJson;
        }
    }

    private string GetUploadsOrigin()
    {
        if (Request?.Host.HasValue == true && !string.IsNullOrWhiteSpace(Request.Scheme))
        {
            return $"{Request.Scheme}://{Request.Host.Value}";
        }

        return string.Empty;
    }

    private static DateTime GetFallbackUpdatedAtUtc()
    {
        var assemblyPath = typeof(PageContentController).Assembly.Location;
        return System.IO.File.Exists(assemblyPath)
            ? System.IO.File.GetLastWriteTimeUtc(assemblyPath)
            : DateTime.UnixEpoch;
    }

    private static void NormalizeUploadUrls(JsonNode node, string uploadsOrigin)
    {
        if (node is JsonObject jsonObject)
        {
            var propertyNames = new List<string>();
            foreach (var property in jsonObject)
            {
                propertyNames.Add(property.Key);
            }

            foreach (var propertyName in propertyNames)
            {
                var childNode = jsonObject[propertyName];
                if (childNode == null)
                {
                    continue;
                }

                var normalizedValue = NormalizeUploadString(childNode, uploadsOrigin);
                if (normalizedValue != null)
                {
                    jsonObject[propertyName] = normalizedValue;
                    continue;
                }

                NormalizeUploadUrls(childNode, uploadsOrigin);
            }

            return;
        }

        if (node is JsonArray jsonArray)
        {
            for (var index = 0; index < jsonArray.Count; index++)
            {
                var childNode = jsonArray[index];
                if (childNode == null)
                {
                    continue;
                }

                var normalizedValue = NormalizeUploadString(childNode, uploadsOrigin);
                if (normalizedValue != null)
                {
                    jsonArray[index] = normalizedValue;
                    continue;
                }

                NormalizeUploadUrls(childNode, uploadsOrigin);
            }
        }
    }

    private static string? NormalizeUploadString(JsonNode node, string uploadsOrigin)
    {
        if (node is not JsonValue jsonValue || !jsonValue.TryGetValue<string>(out var currentValue) || string.IsNullOrWhiteSpace(currentValue))
        {
            return null;
        }

        if (currentValue.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return $"{uploadsOrigin}{currentValue}";
        }

        var localUploadMatch = LocalUploadUrlPattern.Match(currentValue);
        if (localUploadMatch.Success)
        {
            return $"{uploadsOrigin}{localUploadMatch.Groups["path"].Value}";
        }

        return null;
    }
}
