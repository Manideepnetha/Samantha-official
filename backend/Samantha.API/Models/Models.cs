namespace Samantha.API.Models;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string Role { get; set; } = "Admin";
}

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class LoginResponse
{

    public required string Token { get; set; }
    public required User User { get; set; }
}

public class Project
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Link { get; set; }
    public string? Technologies { get; set; } // Comma separated, or JSON array
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Blog
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public string? Summary { get; set; }
    public string? CoverImage { get; set; }
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public bool IsPublished { get; set; } = true;
}

public class Testimonial
{
    public int Id { get; set; }
    public required string ClientName { get; set; }
    public required string Feedback { get; set; }
    public string? Role { get; set; }
    public string? Company { get; set; }
    public string? AvatarUrl { get; set; }
    public int Rating { get; set; } = 5;
}

public class ContactMessage
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Subject { get; set; }
    public required string Message { get; set; }
    public string? Category { get; set; }
    public string? MetadataJson { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}

public class Movie
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public int Year { get; set; }
    public string? ReleaseDate { get; set; } // Kept as string to match simple frontend need, or could be DateTime
    public required string Language { get; set; }
    public required List<string> Genre { get; set; } = new();
    public required string Role { get; set; }
    public required string Director { get; set; }
    public required string Poster { get; set; }
    public required string Description { get; set; }
    public string? Trailer { get; set; }
}

public class Award
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public int Year { get; set; }
    public string? Description { get; set; } // For timeline
    public string? Quote { get; set; } // For timeline
    public string? ImageUrl { get; set; } // For gallery
    public required string Type { get; set; } // "Timeline" or "Gallery"
    public string? Month { get; set; } // Optional, for finer sorting if needed
}

public class Philanthropy
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string Type { get; set; } // "Initiative", "Story", "Stat"
    public int? Value { get; set; } // For stats (e.g., 754)
    public string? ImageUrl { get; set; }
    public string? Icon { get; set; } // For initiatives (emoji or class)
}

public class NewsArticle
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Excerpt { get; set; }
    public string? ImageUrl { get; set; }
    public string? Link { get; set; }
    public string? Date { get; set; } // "May 15, 2025"
}

public class GalleryCollection
{
    public int Id { get; set; }
    public required string Key { get; set; }
    public required string Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public required string Category { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? AccentTone { get; set; }
    public int SortOrder { get; set; }
}

public class MediaGallery
{
    public int Id { get; set; }
    public required string Caption { get; set; }
    public required string ImageUrl { get; set; }
    public string? AltText { get; set; }
    public string Type { get; set; } = "Home"; // "Home", "General", "Film", "Event", "Fashion", "BTS", "Photoshoot"
    public string? Date { get; set; } // "March 2024"
    public string? CollectionKey { get; set; }
    public int DisplayOrder { get; set; }
}

public class FashionItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Date { get; set; }
    public required string Description { get; set; }
    public required string ImageUrl { get; set; }
    public string? Link { get; set; }
}

public class SiteSetting
{
    public int Id { get; set; }
    public required string Key { get; set; }
    public required string Value { get; set; }
}

public class QuizEntry
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? City { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int TimeTakenSeconds { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}

public class FanCreation
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string CreatorName { get; set; }
    public required string Type { get; set; } // "Poster", "Video", "Illustration"
    public string? Description { get; set; }
    public required string ImageUrl { get; set; }
    public string? MediaUrl { get; set; }
    public string? DateLabel { get; set; }
    public string? Platform { get; set; }
    public bool IsFeatured { get; set; }
}

public class VisitorEntry
{
    public int Id { get; set; }
    public required string ClientVisitorId { get; set; }
    public required string Name { get; set; }
    public string? SocialMediaId { get; set; }
    public string? Source { get; set; }
    public string? UserAgent { get; set; }
    public string? IpAddress { get; set; }
    public DateTime FirstCompletedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastCompletedAt { get; set; } = DateTime.UtcNow;
}

public class RecordVisitorEntryRequest
{
    public required string ClientVisitorId { get; set; }
    public required string Name { get; set; }
    public string? SocialMediaId { get; set; }
    public string? Source { get; set; }
}

public class PageContent
{
    public int Id { get; set; }
    public required string Key { get; set; }
    public required string ContentJson { get; set; }
    public string? Description { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
