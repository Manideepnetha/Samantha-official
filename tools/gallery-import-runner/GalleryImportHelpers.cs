using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;

internal static class GalleryImportHelpers
{
    private static readonly Dictionary<string, string> AccentByCategory = new(StringComparer.OrdinalIgnoreCase)
    {
        ["films"] = "#69808f",
        ["events"] = "#b87050",
        ["fashion"] = "#d0a05a",
        ["photoshoots"] = "#d3b598",
        ["bts"] = "#7a7f68"
    };

    private static readonly Dictionary<string, int> CategoryRank = new(StringComparer.OrdinalIgnoreCase)
    {
        ["films"] = 1,
        ["events"] = 2,
        ["fashion"] = 3,
        ["photoshoots"] = 4,
        ["bts"] = 5
    };

    private static readonly HashSet<string> SupportedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private static readonly HashSet<string> GenericCollectionNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "event",
        "events",
        "set",
        "set 1",
        "set 2",
        "set 3",
        "set 4",
        "set 5",
        "set 6",
        "set 7",
        "set 8",
        "set 9",
        "set 10",
        "promotions",
        "promotion",
        "photoshoot",
        "photo shoot",
        "interviews",
        "interview",
        "audio launch",
        "movie launch",
        "launch",
        "premiere",
        "success meet",
        "bts stills"
    };

    public static List<CollectionImportPlan> BuildCollectionPlans(IReadOnlyList<string> batchDirectories)
    {
        var filesByRelativeDirectory = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase);

        foreach (var batchDirectory in batchDirectories)
        {
            var directories = Directory
                .EnumerateDirectories(batchDirectory, "*", SearchOption.AllDirectories)
                .Prepend(batchDirectory);

            foreach (var directory in directories)
            {
                var files = Directory
                    .EnumerateFiles(directory, "*", SearchOption.TopDirectoryOnly)
                    .Where(file => SupportedExtensions.Contains(Path.GetExtension(file)))
                    .OrderBy(file => Path.GetFileName(file), StringComparer.OrdinalIgnoreCase)
                    .ToList();

                if (files.Count == 0)
                {
                    continue;
                }

                var relativePath = NormalizePath(Path.GetRelativePath(batchDirectory, directory));
                if (relativePath == ".")
                {
                    relativePath = Path.GetFileName(batchDirectory);
                }

                if (!filesByRelativeDirectory.TryGetValue(relativePath, out var existing))
                {
                    existing = new List<string>();
                    filesByRelativeDirectory[relativePath] = existing;
                }

                existing.AddRange(files);
            }
        }

        var plans = filesByRelativeDirectory
            .Select(entry => CreateCollectionPlan(entry.Key, entry.Value))
            .OrderBy(plan => CategoryRank.GetValueOrDefault(plan.Category, 99))
            .ThenBy(plan => plan.RelativePath, StringComparer.OrdinalIgnoreCase)
            .ToList();

        for (var index = 0; index < plans.Count; index++)
        {
            plans[index] = plans[index] with { SortOrder = index + 1 };
        }

        return plans;
    }

    public static string BuildImageCaption(string collectionTitle, int index, int totalCount)
    {
        if (totalCount <= 1)
        {
            return collectionTitle;
        }

        return $"{collectionTitle} {index + 1:00}";
    }

    public static string BuildCloudinaryFolder(string defaultFolder, string collectionKey)
        => string.IsNullOrWhiteSpace(defaultFolder)
            ? $"gallery/{collectionKey}"
            : $"{defaultFolder.Trim().TrimEnd('/')}/gallery/{collectionKey}";

    public static bool ShouldRetry(HttpStatusCode statusCode)
        => statusCode == HttpStatusCode.TooManyRequests || (int)statusCode >= 500;

    public static string GetContentType(string filePath) => Path.GetExtension(filePath).ToLowerInvariant() switch
    {
        ".png" => "image/png",
        ".webp" => "image/webp",
        _ => "image/jpeg"
    };

    private static CollectionImportPlan CreateCollectionPlan(string relativePath, IReadOnlyList<string> files)
    {
        var normalizedPath = NormalizePath(relativePath);
        var segments = normalizedPath
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .ToArray();

        var category = InferCategory(normalizedPath, segments);
        var accentTone = AccentByCategory.GetValueOrDefault(category, "#d0a05a");
        var key = NormalizeKey(normalizedPath);
        var (title, subtitle) = BuildCollectionTitleAndSubtitle(segments, category);
        var description = $"Official Samantha gallery collection from {BuildDisplayLocation(title, subtitle)}, featuring {files.Count} image{(files.Count == 1 ? string.Empty : "s")}.";

        return new CollectionImportPlan(
            RelativePath: normalizedPath,
            Key: key,
            Title: title,
            Subtitle: subtitle,
            Description: description,
            Category: category,
            AccentTone: accentTone,
            SortOrder: 0,
            Files: files
                .OrderBy(file => Path.GetFileName(file), StringComparer.OrdinalIgnoreCase)
                .ToArray());
    }

    private static (string Title, string Subtitle) BuildCollectionTitleAndSubtitle(string[] segments, string category)
    {
        if (segments.Length == 0)
        {
            return ("Gallery Collection", GetCategoryLabel(category));
        }

        var humanizedSegments = segments.Select(HumanizeSegment).ToArray();
        var titleSegmentCount = 1;

        if (segments.Length > 1 && IsGenericCollectionName(segments[^1]))
        {
            titleSegmentCount = Math.Min(2, segments.Length);
            if (segments.Length > 2 && IsGenericCollectionName(segments[^2]))
            {
                titleSegmentCount = 3;
            }
        }

        var title = string.Join(" / ", humanizedSegments.Skip(humanizedSegments.Length - titleSegmentCount));
        var subtitleSegments = humanizedSegments.Take(humanizedSegments.Length - titleSegmentCount).ToArray();
        var subtitle = subtitleSegments.Length == 0 ? GetCategoryLabel(category) : string.Join(" / ", subtitleSegments);

        if (string.Equals(title, subtitle, StringComparison.OrdinalIgnoreCase))
        {
            subtitle = GetCategoryLabel(category);
        }

        return (title, subtitle);
    }

    private static bool IsGenericCollectionName(string value)
    {
        var normalized = HumanizeSegment(value);
        if (GenericCollectionNames.Contains(normalized))
        {
            return true;
        }

        return normalized.StartsWith("Set ", StringComparison.OrdinalIgnoreCase)
            || normalized.StartsWith("Event ", StringComparison.OrdinalIgnoreCase);
    }

    private static string InferCategory(string relativePath, string[] segments)
    {
        var upperPath = relativePath.ToUpperInvariant();
        var topLevel = segments.Length > 0 ? segments[0].ToUpperInvariant() : string.Empty;

        if (ContainsAny(upperPath, "BTS", "BEHIND", "BACKSTAGE"))
        {
            return "bts";
        }

        if (ContainsAny(upperPath, "PHOTOSHOOT", "ELLE", "COSMOPOLITAN", "GQ", "BAZAAR", "CDP", "DESIGNS", "UNSEEN", "INSTAGRAM", "RANDOM INSTA"))
        {
            return "photoshoots";
        }

        if (ContainsAny(upperPath, "BURBERRY", "TOMMY HILFIGER", "LOUIS VUITTON", "MYNTRA", "KRESHA", "NISHKA", "KIARA", "JEWELLERS", "JEWELLERY", "SHOPPING MALL", "SHOPPING MALL OPENINGS", "AD SHOOT", "BLENDERS PRIDE", "MAMAEARTH", "AVT GOLD CUP", "SECRET ALCHEMIST", "PEACOCK", "SAAKI"))
        {
            return "fashion";
        }

        if (ContainsAny(upperPath, "AWARD", "EVENT", "SUMMIT", "PREMIERE", "LAUNCH", "FESTIVAL", "FAN MEET", "SOIL", "SYDNEY", "CRICKET", "PROMOTIONAL EVENT", "UNDER 25"))
        {
            return "events";
        }

        return topLevel switch
        {
            "AWARDS" => "events",
            "EVENTS" => "events",
            "PHOTOSHOOT" => "photoshoots",
            _ => "films"
        };
    }

    private static string BuildDisplayLocation(string title, string subtitle)
    {
        if (string.IsNullOrWhiteSpace(subtitle) || subtitle == GetCategoryLabel("films") || subtitle == GetCategoryLabel("events") || subtitle == GetCategoryLabel("fashion") || subtitle == GetCategoryLabel("photoshoots") || subtitle == GetCategoryLabel("bts"))
        {
            return title;
        }

        return $"{subtitle} / {title}";
    }

    private static string GetCategoryLabel(string category) => category.ToLowerInvariant() switch
    {
        "films" => "Film Frames",
        "events" => "Event Highlights",
        "fashion" => "Fashion Editorials",
        "photoshoots" => "Cover Shoots",
        "bts" => "Behind The Scenes",
        _ => HumanizeSegment(category)
    };

    private static string NormalizeKey(string value)
    {
        var slug = new string(value
            .Trim()
            .ToLowerInvariant()
            .Select(ch => char.IsLetterOrDigit(ch) ? ch : '-')
            .ToArray());

        while (slug.Contains("--", StringComparison.Ordinal))
        {
            slug = slug.Replace("--", "-", StringComparison.Ordinal);
        }

        slug = slug.Trim('-');
        if (slug.Length <= 96)
        {
            return slug;
        }

        var hash = Convert.ToHexString(SHA1.HashData(Encoding.UTF8.GetBytes(value))).ToLowerInvariant()[..8];
        var trimmed = slug[..80].TrimEnd('-');
        return $"{trimmed}-{hash}";
    }

    private static string HumanizeSegment(string value)
    {
        var normalized = value
            .Replace("_", " ", StringComparison.Ordinal)
            .Replace("-", " ", StringComparison.Ordinal)
            .Replace("~", " ", StringComparison.Ordinal)
            .Replace("+", " ", StringComparison.Ordinal)
            .Replace("(", " ", StringComparison.Ordinal)
            .Replace(")", " ", StringComparison.Ordinal);

        var tokens = normalized
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(HumanizeToken);

        return string.Join(" ", tokens);
    }

    private static string HumanizeToken(string token)
    {
        if (token.Length == 0 || token.All(char.IsDigit))
        {
            return token;
        }

        return token.ToUpperInvariant() switch
        {
            "BTS" => "BTS",
            "GQ" => "GQ",
            "TV9" => "TV9",
            "CDP" => "CDP",
            "YMC" => "YMC",
            "YVM" => "YVM",
            "SVSC" => "SVSC",
            "AVT" => "AVT",
            "UHD" => "UHD",
            "KRK" => "KRK",
            "ICICI" => "ICICI",
            "SET" => "Set",
            "EVENT" => "Event",
            "EVENTS" => "Events",
            "PROMOTIONS" => "Promotions",
            "PROMOTION" => "Promotion",
            "PHOTOSHOOT" => "Photoshoot",
            "LAUNCH" => "Launch",
            _ when token.Length <= 3 && token.All(char.IsUpper) => token,
            _ => char.ToUpperInvariant(token[0]) + token[1..].ToLowerInvariant()
        };
    }

    private static bool ContainsAny(string source, params string[] tokens)
        => tokens.Any(token => source.Contains(token, StringComparison.OrdinalIgnoreCase));

    private static string NormalizePath(string value) => value.Replace('\\', '/');
}
