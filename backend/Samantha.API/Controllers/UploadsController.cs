using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Samantha.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UploadsController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<UploadsController> _logger;

    public UploadsController(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IWebHostEnvironment environment,
        ILogger<UploadsController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _environment = environment;
        _logger = logger;
    }

    [HttpPost("images")]
    public async Task<ActionResult<IEnumerable<UploadedImageResponse>>> UploadImages(
        [FromForm] List<IFormFile> files,
        [FromForm] string? folder = null)
    {
        if (files.Count == 0)
        {
            return BadRequest(new { message = "At least one image file is required." });
        }

        var cloudName = _configuration["Cloudinary:CloudName"] ?? "dpnd6ve1e";
        var uploadPreset = _configuration["Cloudinary:UnsignedUploadPreset"] ?? "ml_default";
        var apiKey = _configuration["Cloudinary:ApiKey"];
        var apiSecret = _configuration["Cloudinary:ApiSecret"];
        var defaultFolder = _configuration["Cloudinary:DefaultFolder"] ?? "samantha-official-website";
        var targetFolder = BuildFolder(defaultFolder, folder);

        var client = _httpClientFactory.CreateClient();
        var results = new List<UploadedImageResponse>();

        foreach (var file in files)
        {
            if (file.Length == 0)
            {
                continue;
            }

            if (string.IsNullOrWhiteSpace(file.ContentType) ||
                !file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    message = $"'{file.FileName}' is not a supported image file."
                });
            }

            var uploaded = await TryUploadToCloudinaryAsync(file, targetFolder, cloudName, uploadPreset, apiKey, apiSecret, client);
            if (uploaded != null)
            {
                results.Add(uploaded);
                continue;
            }

            results.Add(await SaveLocallyAsync(file, targetFolder));
        }

        if (results.Count == 0)
        {
            return BadRequest(new { message = "No valid image files were uploaded." });
        }

        return Ok(results);
    }

    private async Task<UploadedImageResponse?> TryUploadToCloudinaryAsync(
        IFormFile file,
        string targetFolder,
        string? cloudName,
        string? uploadPreset,
        string? apiKey,
        string? apiSecret,
        HttpClient client)
    {
        if (string.IsNullOrWhiteSpace(cloudName))
        {
            return null;
        }

        var uploadUrl = $"https://api.cloudinary.com/v1_1/{cloudName}/image/upload";

        try
        {
            await using var stream = file.OpenReadStream();
            using var content = new MultipartFormDataContent();
            using var fileContent = new StreamContent(stream);

            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

            if (!string.IsNullOrWhiteSpace(targetFolder))
            {
                content.Add(new StringContent(targetFolder), "folder");
            }

            content.Add(fileContent, "file", file.FileName);

            if (!string.IsNullOrWhiteSpace(apiKey) && !string.IsNullOrWhiteSpace(apiSecret))
            {
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
                var signature = CreateCloudinarySignature(targetFolder, timestamp, apiSecret);

                content.Add(new StringContent(apiKey), "api_key");
                content.Add(new StringContent(timestamp), "timestamp");
                content.Add(new StringContent(signature), "signature");
            }
            else if (!string.IsNullOrWhiteSpace(uploadPreset))
            {
                content.Add(new StringContent(uploadPreset), "upload_preset");
            }
            else
            {
                return null;
            }

            var response = await client.PostAsync(uploadUrl, content, HttpContext.RequestAborted);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Cloudinary upload failed for {FileName} with status {StatusCode}: {Body}. Falling back to local storage.",
                    file.FileName,
                    response.StatusCode,
                    responseBody);

                return null;
            }

            using var document = JsonDocument.Parse(responseBody);
            var root = document.RootElement;

            return new UploadedImageResponse(
                Url: root.GetProperty("secure_url").GetString() ?? string.Empty,
                PublicId: root.TryGetProperty("public_id", out var publicId)
                    ? publicId.GetString() ?? string.Empty
                    : string.Empty,
                FileName: root.TryGetProperty("original_filename", out var fileName)
                    ? fileName.GetString() ?? Path.GetFileNameWithoutExtension(file.FileName)
                    : Path.GetFileNameWithoutExtension(file.FileName),
                Format: root.TryGetProperty("format", out var format)
                    ? format.GetString() ?? string.Empty
                    : string.Empty,
                Width: root.TryGetProperty("width", out var width) && width.TryGetInt32(out var imageWidth)
                    ? imageWidth
                    : 0,
                Height: root.TryGetProperty("height", out var height) && height.TryGetInt32(out var imageHeight)
                    ? imageHeight
                    : 0);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cloudinary upload threw an exception for {FileName}. Falling back to local storage.", file.FileName);
            return null;
        }
    }

    private async Task<UploadedImageResponse> SaveLocallyAsync(IFormFile file, string targetFolder)
    {
        var webRootPath = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var relativeFolder = BuildRelativeUploadFolder(targetFolder);
        var destinationFolder = Path.Combine(webRootPath, relativeFolder);
        Directory.CreateDirectory(destinationFolder);

        var extension = ResolveExtension(file);
        var generatedFileName = $"{Guid.NewGuid():N}{extension}";
        var destinationPath = Path.Combine(destinationFolder, generatedFileName);

        await using (var fileStream = new FileStream(destinationPath, FileMode.Create, FileAccess.Write, FileShare.None))
        await using (var sourceStream = file.OpenReadStream())
        {
            await sourceStream.CopyToAsync(fileStream, HttpContext.RequestAborted);
        }

        var relativePath = "/" + Path.Combine(relativeFolder, generatedFileName).Replace("\\", "/", StringComparison.Ordinal);
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        return new UploadedImageResponse(
            Url: $"{baseUrl}{relativePath}",
            PublicId: relativePath,
            FileName: Path.GetFileNameWithoutExtension(file.FileName),
            Format: extension.TrimStart('.'),
            Width: 0,
            Height: 0);
    }

    private static string BuildFolder(string defaultFolder, string? requestedFolder)
    {
        var normalizedDefault = NormalizeFolder(defaultFolder);
        var normalizedRequested = NormalizeFolder(requestedFolder);

        if (string.IsNullOrWhiteSpace(normalizedRequested))
        {
            return normalizedDefault;
        }

        if (string.IsNullOrWhiteSpace(normalizedDefault))
        {
            return normalizedRequested;
        }

        return $"{normalizedDefault}/{normalizedRequested}";
    }

    private static string NormalizeFolder(string? folder)
    {
        if (string.IsNullOrWhiteSpace(folder))
        {
            return string.Empty;
        }

        return folder
            .Trim()
            .Replace("\\", "/", StringComparison.Ordinal)
            .Trim('/');
    }

    private static string BuildRelativeUploadFolder(string? folder)
    {
        var segments = NormalizeFolder(folder)
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .Select(SanitizePathSegment)
            .Where(segment => !string.IsNullOrWhiteSpace(segment))
            .ToList();

        segments.Insert(0, "uploads");
        return Path.Combine(segments.ToArray());
    }

    private static string SanitizePathSegment(string segment)
    {
        var sanitized = new string(segment
            .Where(ch => char.IsLetterOrDigit(ch) || ch == '-' || ch == '_')
            .ToArray());

        return string.IsNullOrWhiteSpace(sanitized) ? "assets" : sanitized;
    }

    private static string ResolveExtension(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName);
        if (!string.IsNullOrWhiteSpace(extension))
        {
            return extension;
        }

        return file.ContentType.ToLowerInvariant() switch
        {
            "image/png" => ".png",
            "image/webp" => ".webp",
            "image/gif" => ".gif",
            _ => ".jpg"
        };
    }

    private static string CreateCloudinarySignature(string folder, string timestamp, string apiSecret)
    {
        var parts = new List<string>();

        if (!string.IsNullOrWhiteSpace(folder))
        {
            parts.Add($"folder={folder}");
        }

        parts.Add($"timestamp={timestamp}");

        var payload = string.Join("&", parts) + apiSecret;
        var hash = SHA1.HashData(Encoding.UTF8.GetBytes(payload));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}

public sealed record UploadedImageResponse(
    string Url,
    string PublicId,
    string FileName,
    string Format,
    int Width,
    int Height);
