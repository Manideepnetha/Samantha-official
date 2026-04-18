using System.Text.Json.Serialization;

internal sealed record CollectionImportPlan(
    string RelativePath,
    string Key,
    string Title,
    string Subtitle,
    string Description,
    string Category,
    string AccentTone,
    int SortOrder,
    IReadOnlyList<string> Files);

internal sealed record UploadedAsset(
    string Url,
    string PublicId,
    string FilePath);

internal sealed class ImportReport
{
    public required DateTimeOffset ImportedAt { get; init; }
    public required int CollectionCount { get; init; }
    public required int ImageCount { get; init; }
    public required int FinalCollectionCount { get; init; }
    public required int FinalImageCount { get; init; }
    public required string[] ImportedCollectionKeys { get; init; }
}

internal sealed record LoginRequest(
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("password")] string Password);

internal sealed class LoginResponse
{
    [JsonPropertyName("token")]
    public string Token { get; set; } = string.Empty;
}

internal sealed class CloudinaryUploadResponse
{
    [JsonPropertyName("secure_url")]
    public string? SecureUrl { get; set; }

    [JsonPropertyName("public_id")]
    public string? PublicId { get; set; }
}

internal sealed class GalleryCollectionDto
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("key")]
    public string Key { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("subtitle")]
    public string Subtitle { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;

    [JsonPropertyName("coverImageUrl")]
    public string CoverImageUrl { get; set; } = string.Empty;

    [JsonPropertyName("accentTone")]
    public string AccentTone { get; set; } = string.Empty;

    [JsonPropertyName("sortOrder")]
    public int SortOrder { get; set; }
}

internal sealed class MediaGalleryDto
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("caption")]
    public string Caption { get; set; } = string.Empty;

    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;

    [JsonPropertyName("altText")]
    public string AltText { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("collectionKey")]
    public string CollectionKey { get; set; } = string.Empty;

    [JsonPropertyName("displayOrder")]
    public int DisplayOrder { get; set; }
}

internal sealed class UploadedMediaAssetDto
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;

    [JsonPropertyName("publicId")]
    public string PublicId { get; set; } = string.Empty;

    [JsonPropertyName("fileName")]
    public string FileName { get; set; } = string.Empty;
}

internal static class GalleryImportRunnerJson
{
    public static System.Text.Json.JsonSerializerOptions Options { get; } = new(System.Text.Json.JsonSerializerDefaults.Web)
    {
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };
}
