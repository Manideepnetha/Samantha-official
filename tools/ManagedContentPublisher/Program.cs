using System.Globalization;
using System.Text.Json;
using Npgsql;

internal static class Program
{
    private const string DefaultLocalDbConnection = "Host=localhost;Database=samantha_db;Username=postgres;Password=postgres";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true
    };

    private enum PublishMode
    {
        Verify,
        Publish
    }

    private sealed record ProjectRow(
        int? Id,
        string Title,
        string Description,
        string? ImageUrl,
        string? Link,
        string? Technologies,
        DateTime CreatedAt
    );

    private sealed record BlogRow(
        int? Id,
        string Title,
        string Content,
        string? Summary,
        string? CoverImage,
        DateTime PublishedAt,
        bool IsPublished
    );

    private sealed record TestimonialRow(
        int? Id,
        string ClientName,
        string Feedback,
        string? Role,
        string? Company,
        string? AvatarUrl,
        int Rating
    );

    private sealed record MovieRow(
        int? Id,
        string Title,
        int Year,
        string? ReleaseDate,
        string Language,
        List<string> Genre,
        string Role,
        string Director,
        string Poster,
        string Description,
        string? Trailer
    );

    private sealed record AwardRow(
        int? Id,
        string Title,
        int Year,
        string? Description,
        string? Quote,
        string? ImageUrl,
        string Type,
        string? Month
    );

    private sealed record PhilanthropyRow(
        int? Id,
        string Title,
        string? Description,
        string Type,
        int? Value,
        string? ImageUrl,
        string? Icon
    );

    private sealed record NewsArticleRow(
        int? Id,
        string Title,
        string Excerpt,
        string? ImageUrl,
        string? Link,
        string? Date
    );

    private sealed record GalleryCollectionRow(
        int? Id,
        string Key,
        string Title,
        string? Subtitle,
        string? Description,
        string Category,
        string? CoverImageUrl,
        string? AccentTone,
        int SortOrder
    );

    private sealed record MediaGalleryRow(
        int? Id,
        string Caption,
        string ImageUrl,
        string? AltText,
        string Type,
        string? Date,
        string? CollectionKey,
        int DisplayOrder
    );

    private sealed record FashionItemRow(
        int? Id,
        string Title,
        string Date,
        string Description,
        string ImageUrl,
        string? Link
    );

    private sealed record SiteSettingRow(
        int? Id,
        string Key,
        string Value
    );

    private sealed record PageContentRow(
        int? Id,
        string Key,
        string ContentJson,
        string? Description,
        DateTime UpdatedAt
    );

    private sealed record FanCreationRow(
        int? Id,
        string Title,
        string CreatorName,
        string Type,
        string? Description,
        string ImageUrl,
        string? MediaUrl,
        string? DateLabel,
        string? Platform,
        bool IsFeatured
    );

    private sealed record Snapshot(
        List<ProjectRow> Projects,
        List<BlogRow> Blogs,
        List<TestimonialRow> Testimonials,
        List<MovieRow> Movies,
        List<AwardRow> Awards,
        List<PhilanthropyRow> Philanthropies,
        List<NewsArticleRow> NewsArticles,
        List<GalleryCollectionRow> GalleryCollections,
        List<MediaGalleryRow> MediaGalleries,
        List<FashionItemRow> FashionItems,
        List<SiteSettingRow> SiteSettings,
        List<PageContentRow> PageContents,
        List<FanCreationRow> FanCreations
    );

    private delegate Task<List<T>> Loader<T>(NpgsqlConnection connection, NpgsqlTransaction? transaction);
    private delegate Task InsertRow<T>(NpgsqlConnection connection, NpgsqlTransaction transaction, T row);
    private delegate Task UpdateRow<T>(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, T row);

    private static string Normalize(string? value) => (value ?? string.Empty).Trim().ToLowerInvariant();

    private static string ProjectKey(ProjectRow item) => Normalize(item.Title);
    private static string BlogKey(BlogRow item) => Normalize(item.Title);
    private static string TestimonialKey(TestimonialRow item) => $"{Normalize(item.ClientName)}::{Normalize(item.Company)}::{Normalize(item.Feedback)}";
    private static string MovieKey(MovieRow item) => Normalize(item.Title);
    private static string AwardKey(AwardRow item) => $"{Normalize(item.Title)}::{item.Year.ToString(CultureInfo.InvariantCulture)}::{Normalize(item.Type)}";
    private static string PhilanthropyKey(PhilanthropyRow item) => $"{Normalize(item.Title)}::{Normalize(item.Type)}";
    private static string NewsArticleKey(NewsArticleRow item) => Normalize(item.Title);
    private static string GalleryCollectionKey(GalleryCollectionRow item) => Normalize(item.Key);
    private static string MediaKey(MediaGalleryRow item) => $"{Normalize(item.Type)}::{Normalize(item.Caption)}::{Normalize(item.ImageUrl)}::{Normalize(item.CollectionKey)}::{item.DisplayOrder.ToString(CultureInfo.InvariantCulture)}";
    private static string FashionItemKey(FashionItemRow item) => $"{Normalize(item.Title)}::{Normalize(item.Date)}";
    private static string SiteSettingKey(SiteSettingRow item) => Normalize(item.Key);
    private static string PageContentKey(PageContentRow item) => Normalize(item.Key);
    private static string FanCreationKey(FanCreationRow item) => $"{Normalize(item.Type)}::{Normalize(item.Title)}";

    public static async Task<int> Main(string[] args)
    {
        var mode = ParseMode(args);
        var localConnectionString = Environment.GetEnvironmentVariable("LOCAL_DB_CONNECTION") ?? DefaultLocalDbConnection;
        var productionConnectionString = Environment.GetEnvironmentVariable("PROD_DB_CONNECTION") ?? string.Empty;
        var backupRoot = Environment.GetEnvironmentVariable("PROD_BACKUP_DIR")
            ?? Path.Combine(AppContext.BaseDirectory, "prod-backups", DateTime.UtcNow.ToString("yyyyMMdd-HHmmss"));

        if (string.IsNullOrWhiteSpace(productionConnectionString))
        {
            Console.Error.WriteLine("PROD_DB_CONNECTION is required.");
            return 1;
        }

        try
        {
            await using var local = new NpgsqlConnection(localConnectionString);
            await using var production = new NpgsqlConnection(productionConnectionString);
            await local.OpenAsync();
            await production.OpenAsync();

            Console.WriteLine($"Managed content publish mode: {mode}");
            Console.WriteLine("Included tables: Projects, Blogs, Testimonials, Movies, Awards, Philanthropies, NewsArticles, GalleryCollections, MediaGalleries, FashionItems, SiteSettings, PageContents, FanCreations.");
            Console.WriteLine("Excluded tables: Users, ContactMessages, QuizEntries, VisitorEntries, FanWallMessages, FanPollVotes.");
            Console.WriteLine();

            Console.WriteLine("Before sync:");
            await PrintStatsAsync("local", local);
            await PrintStatsAsync("production", production);

            if (mode == PublishMode.Verify)
            {
                Console.WriteLine();
                Console.WriteLine("Verification only. No production rows were changed.");
                return 0;
            }

            var localSnapshot = await LoadSnapshotAsync(local, transaction: null);
            var productionSnapshot = await LoadSnapshotAsync(production, transaction: null);

            Directory.CreateDirectory(backupRoot);
            await BackupProductionAsync(productionSnapshot, backupRoot);
            Console.WriteLine();
            Console.WriteLine($"Production backup saved to: {backupRoot}");

            await using var transaction = await production.BeginTransactionAsync();

            await SyncByKeyAsync(
                "Projects",
                localSnapshot.Projects,
                LoadProjectsAsync,
                ProjectKey,
                item => item.Id,
                InsertProjectAsync,
                UpdateProjectAsync,
                DeleteByIdAsync("Projects"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "Blogs",
                localSnapshot.Blogs,
                LoadBlogsAsync,
                BlogKey,
                item => item.Id,
                InsertBlogAsync,
                UpdateBlogAsync,
                DeleteByIdAsync("Blogs"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "Testimonials",
                localSnapshot.Testimonials,
                LoadTestimonialsAsync,
                TestimonialKey,
                item => item.Id,
                InsertTestimonialAsync,
                UpdateTestimonialAsync,
                DeleteByIdAsync("Testimonials"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "Movies",
                localSnapshot.Movies,
                LoadMoviesAsync,
                MovieKey,
                item => item.Id,
                InsertMovieAsync,
                UpdateMovieAsync,
                DeleteByIdAsync("Movies"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "Awards",
                localSnapshot.Awards,
                LoadAwardsAsync,
                AwardKey,
                item => item.Id,
                InsertAwardAsync,
                UpdateAwardAsync,
                DeleteByIdAsync("Awards"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "Philanthropies",
                localSnapshot.Philanthropies,
                LoadPhilanthropiesAsync,
                PhilanthropyKey,
                item => item.Id,
                InsertPhilanthropyAsync,
                UpdatePhilanthropyAsync,
                DeleteByIdAsync("Philanthropies"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "NewsArticles",
                localSnapshot.NewsArticles,
                LoadNewsArticlesAsync,
                NewsArticleKey,
                item => item.Id,
                InsertNewsArticleAsync,
                UpdateNewsArticleAsync,
                DeleteByIdAsync("NewsArticles"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "GalleryCollections",
                localSnapshot.GalleryCollections,
                LoadGalleryCollectionsAsync,
                GalleryCollectionKey,
                item => item.Id,
                InsertGalleryCollectionAsync,
                UpdateGalleryCollectionAsync,
                DeleteByIdAsync("GalleryCollections"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "MediaGalleries",
                localSnapshot.MediaGalleries,
                LoadMediaGalleriesAsync,
                MediaKey,
                item => item.Id,
                InsertMediaGalleryAsync,
                UpdateMediaGalleryAsync,
                DeleteByIdAsync("MediaGalleries"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "FashionItems",
                localSnapshot.FashionItems,
                LoadFashionItemsAsync,
                FashionItemKey,
                item => item.Id,
                InsertFashionItemAsync,
                UpdateFashionItemAsync,
                DeleteByIdAsync("FashionItems"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "SiteSettings",
                localSnapshot.SiteSettings,
                LoadSiteSettingsAsync,
                SiteSettingKey,
                item => item.Id,
                InsertSiteSettingAsync,
                UpdateSiteSettingAsync,
                DeleteByIdAsync("SiteSettings"),
                production,
                transaction,
                deleteMissing: false
            );

            await SyncByKeyAsync(
                "PageContents",
                localSnapshot.PageContents,
                LoadPageContentsAsync,
                PageContentKey,
                item => item.Id,
                InsertPageContentAsync,
                UpdatePageContentAsync,
                DeleteByIdAsync("PageContents"),
                production,
                transaction
            );

            await SyncByKeyAsync(
                "FanCreations",
                localSnapshot.FanCreations,
                LoadFanCreationsAsync,
                FanCreationKey,
                item => item.Id,
                InsertFanCreationAsync,
                UpdateFanCreationAsync,
                DeleteByIdAsync("FanCreations"),
                production,
                transaction
            );

            await transaction.CommitAsync();

            Console.WriteLine();
            Console.WriteLine("After sync:");
            await PrintStatsAsync("production", production);

            return 0;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex);
            return 1;
        }
    }

    private static PublishMode ParseMode(string[] args)
    {
        if (args.Length == 0)
        {
            return PublishMode.Verify;
        }

        return args[0].Trim().ToLowerInvariant() switch
        {
            "verify" => PublishMode.Verify,
            "publish" => PublishMode.Publish,
            _ => throw new ArgumentException("Supported modes: verify, publish")
        };
    }

    private static async Task<Snapshot> LoadSnapshotAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        return new Snapshot(
            await LoadProjectsAsync(connection, transaction),
            await LoadBlogsAsync(connection, transaction),
            await LoadTestimonialsAsync(connection, transaction),
            await LoadMoviesAsync(connection, transaction),
            await LoadAwardsAsync(connection, transaction),
            await LoadPhilanthropiesAsync(connection, transaction),
            await LoadNewsArticlesAsync(connection, transaction),
            await LoadGalleryCollectionsAsync(connection, transaction),
            await LoadMediaGalleriesAsync(connection, transaction),
            await LoadFashionItemsAsync(connection, transaction),
            await LoadSiteSettingsAsync(connection, transaction),
            await LoadPageContentsAsync(connection, transaction),
            await LoadFanCreationsAsync(connection, transaction)
        );
    }

    private static async Task BackupProductionAsync(Snapshot snapshot, string backupRoot)
    {
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "Projects.json"), JsonSerializer.Serialize(snapshot.Projects, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "Blogs.json"), JsonSerializer.Serialize(snapshot.Blogs, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "Testimonials.json"), JsonSerializer.Serialize(snapshot.Testimonials, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "Movies.json"), JsonSerializer.Serialize(snapshot.Movies, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "Awards.json"), JsonSerializer.Serialize(snapshot.Awards, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "Philanthropies.json"), JsonSerializer.Serialize(snapshot.Philanthropies, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "NewsArticles.json"), JsonSerializer.Serialize(snapshot.NewsArticles, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "GalleryCollections.json"), JsonSerializer.Serialize(snapshot.GalleryCollections, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "MediaGalleries.json"), JsonSerializer.Serialize(snapshot.MediaGalleries, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "FashionItems.json"), JsonSerializer.Serialize(snapshot.FashionItems, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "SiteSettings.json"), JsonSerializer.Serialize(snapshot.SiteSettings, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "PageContents.json"), JsonSerializer.Serialize(snapshot.PageContents, JsonOptions));
        await File.WriteAllTextAsync(Path.Combine(backupRoot, "FanCreations.json"), JsonSerializer.Serialize(snapshot.FanCreations, JsonOptions));
    }

    private static async Task PrintStatsAsync(string label, NpgsqlConnection connection)
    {
        var counts = new[]
        {
            ("Projects", await CountAsync(connection, "select count(*) from \"Projects\";")),
            ("Blogs", await CountAsync(connection, "select count(*) from \"Blogs\";")),
            ("Testimonials", await CountAsync(connection, "select count(*) from \"Testimonials\";")),
            ("Movies", await CountAsync(connection, "select count(*) from \"Movies\";")),
            ("Awards", await CountAsync(connection, "select count(*) from \"Awards\";")),
            ("Philanthropies", await CountAsync(connection, "select count(*) from \"Philanthropies\";")),
            ("NewsArticles", await CountAsync(connection, "select count(*) from \"NewsArticles\";")),
            ("GalleryCollections", await CountAsync(connection, "select count(*) from \"GalleryCollections\";")),
            ("MediaGalleries", await CountAsync(connection, "select count(*) from \"MediaGalleries\";")),
            ("FashionItems", await CountAsync(connection, "select count(*) from \"FashionItems\";")),
            ("SiteSettings", await CountAsync(connection, "select count(*) from \"SiteSettings\";")),
            ("PageContents", await CountAsync(connection, "select count(*) from \"PageContents\";")),
            ("FanCreations", await CountAsync(connection, "select count(*) from \"FanCreations\";"))
        };

        Console.WriteLine($"{label}: {string.Join(", ", counts.Select(item => $"{item.Item1}={item.Item2}"))}");
    }

    private static async Task<int> CountAsync(NpgsqlConnection connection, string sql)
    {
        await using var command = new NpgsqlCommand(sql, connection);
        return Convert.ToInt32(await command.ExecuteScalarAsync());
    }

    private static async Task SyncByKeyAsync<T>(
        string label,
        IReadOnlyList<T> localItems,
        Loader<T> loadProduction,
        Func<T, string> keySelector,
        Func<T, int?> idSelector,
        InsertRow<T> insert,
        UpdateRow<T> update,
        Func<NpgsqlConnection, NpgsqlTransaction, int, Task> delete,
        NpgsqlConnection production,
        NpgsqlTransaction transaction,
        bool deleteMissing = true)
    {
        WarnForDuplicateKeys("local", label, localItems, keySelector);

        var productionItems = await loadProduction(production, transaction);
        WarnForDuplicateKeys("production", label, productionItems, keySelector);

        var localMap = BuildUniqueMap(localItems, keySelector);
        var productionGroups = productionItems
            .Where(item => !string.IsNullOrWhiteSpace(keySelector(item)))
            .GroupBy(keySelector)
            .ToDictionary(group => group.Key, group => group.ToList());

        var created = 0;
        var updated = 0;
        var deleted = 0;

        foreach (var (key, localItem) in localMap)
        {
            if (productionGroups.TryGetValue(key, out var matches) && matches.Count > 0)
            {
                var existing = matches[0];
                var existingId = idSelector(existing);
                if (existingId is null)
                {
                    throw new InvalidOperationException($"{label} row did not contain an id for key '{key}'.");
                }

                await update(production, transaction, existingId.Value, localItem);
                updated += 1;

                foreach (var duplicate in matches.Skip(1))
                {
                    var duplicateId = idSelector(duplicate);
                    if (duplicateId is null)
                    {
                        continue;
                    }

                    await delete(production, transaction, duplicateId.Value);
                    deleted += 1;
                }

                continue;
            }

            await insert(production, transaction, localItem);
            created += 1;
        }

        if (deleteMissing)
        {
            foreach (var (key, matches) in productionGroups)
            {
                if (localMap.ContainsKey(key))
                {
                    continue;
                }

                foreach (var item in matches)
                {
                    var existingId = idSelector(item);
                    if (existingId is null)
                    {
                        continue;
                    }

                    await delete(production, transaction, existingId.Value);
                    deleted += 1;
                }
            }
        }

        Console.WriteLine($"[{label}] local={localItems.Count} created={created} updated={updated} deleted={deleted}");
    }

    private static Dictionary<string, T> BuildUniqueMap<T>(IEnumerable<T> items, Func<T, string> keySelector)
    {
        var map = new Dictionary<string, T>();

        foreach (var item in items)
        {
            var key = keySelector(item);
            if (string.IsNullOrWhiteSpace(key) || map.ContainsKey(key))
            {
                continue;
            }

            map.Add(key, item);
        }

        return map;
    }

    private static void WarnForDuplicateKeys<T>(string source, string label, IEnumerable<T> items, Func<T, string> keySelector)
    {
        var duplicates = items
            .Select(item => keySelector(item))
            .Where(key => !string.IsNullOrWhiteSpace(key))
            .GroupBy(key => key)
            .Where(group => group.Count() > 1)
            .Select(group => new { group.Key, Count = group.Count() })
            .Take(5)
            .ToList();

        if (duplicates.Count == 0)
        {
            return;
        }

        Console.WriteLine($"Warning: {source} {label} contains duplicate natural keys. The sync keeps one row per key.");
        foreach (var duplicate in duplicates)
        {
            Console.WriteLine($"  {duplicate.Key} -> {duplicate.Count}");
        }
    }

    private static Func<NpgsqlConnection, NpgsqlTransaction, int, Task> DeleteByIdAsync(string tableName)
    {
        return async (connection, transaction, id) =>
        {
            await ExecuteNonQueryAsync(
                connection,
                transaction,
                $"delete from \"{tableName}\" where \"Id\" = @id;",
                ("id", id)
            );
        };
    }

    private static async Task ExecuteNonQueryAsync(
        NpgsqlConnection connection,
        NpgsqlTransaction? transaction,
        string sql,
        params (string Name, object? Value)[] parameters)
    {
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        foreach (var (name, value) in parameters)
        {
            command.Parameters.AddWithValue(name, value ?? DBNull.Value);
        }

        await command.ExecuteNonQueryAsync();
    }

    private static async Task<List<ProjectRow>> LoadProjectsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "Description", "ImageUrl", "Link", "Technologies", "CreatedAt"
            from "Projects"
            order by "CreatedAt", "Id";
            """;
        var items = new List<ProjectRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new ProjectRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                ReadNullableString(reader, 3),
                ReadNullableString(reader, 4),
                ReadNullableString(reader, 5),
                reader.GetFieldValue<DateTime>(6)
            ));
        }
        return items;
    }

    private static async Task InsertProjectAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, ProjectRow item)
    {
        const string sql = """
            insert into "Projects" ("Title", "Description", "ImageUrl", "Link", "Technologies", "CreatedAt")
            values (@title, @description, @imageUrl, @link, @technologies, @createdAt);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("description", item.Description),
            ("imageUrl", item.ImageUrl),
            ("link", item.Link),
            ("technologies", item.Technologies),
            ("createdAt", item.CreatedAt));
    }

    private static async Task UpdateProjectAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, ProjectRow item)
    {
        const string sql = """
            update "Projects"
            set "Title" = @title,
                "Description" = @description,
                "ImageUrl" = @imageUrl,
                "Link" = @link,
                "Technologies" = @technologies,
                "CreatedAt" = @createdAt
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("description", item.Description),
            ("imageUrl", item.ImageUrl),
            ("link", item.Link),
            ("technologies", item.Technologies),
            ("createdAt", item.CreatedAt));
    }

    private static async Task<List<BlogRow>> LoadBlogsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "Content", "Summary", "CoverImage", "PublishedAt", "IsPublished"
            from "Blogs"
            order by "PublishedAt", "Id";
            """;
        var items = new List<BlogRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new BlogRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                ReadNullableString(reader, 3),
                ReadNullableString(reader, 4),
                reader.GetFieldValue<DateTime>(5),
                reader.GetBoolean(6)
            ));
        }
        return items;
    }

    private static async Task InsertBlogAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, BlogRow item)
    {
        const string sql = """
            insert into "Blogs" ("Title", "Content", "Summary", "CoverImage", "PublishedAt", "IsPublished")
            values (@title, @content, @summary, @coverImage, @publishedAt, @isPublished);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("content", item.Content),
            ("summary", item.Summary),
            ("coverImage", item.CoverImage),
            ("publishedAt", item.PublishedAt),
            ("isPublished", item.IsPublished));
    }

    private static async Task UpdateBlogAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, BlogRow item)
    {
        const string sql = """
            update "Blogs"
            set "Title" = @title,
                "Content" = @content,
                "Summary" = @summary,
                "CoverImage" = @coverImage,
                "PublishedAt" = @publishedAt,
                "IsPublished" = @isPublished
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("content", item.Content),
            ("summary", item.Summary),
            ("coverImage", item.CoverImage),
            ("publishedAt", item.PublishedAt),
            ("isPublished", item.IsPublished));
    }

    private static async Task<List<TestimonialRow>> LoadTestimonialsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "ClientName", "Feedback", "Role", "Company", "AvatarUrl", "Rating"
            from "Testimonials"
            order by "Id";
            """;
        var items = new List<TestimonialRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new TestimonialRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                ReadNullableString(reader, 3),
                ReadNullableString(reader, 4),
                ReadNullableString(reader, 5),
                reader.GetInt32(6)
            ));
        }
        return items;
    }

    private static async Task InsertTestimonialAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, TestimonialRow item)
    {
        const string sql = """
            insert into "Testimonials" ("ClientName", "Feedback", "Role", "Company", "AvatarUrl", "Rating")
            values (@clientName, @feedback, @role, @company, @avatarUrl, @rating);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("clientName", item.ClientName),
            ("feedback", item.Feedback),
            ("role", item.Role),
            ("company", item.Company),
            ("avatarUrl", item.AvatarUrl),
            ("rating", item.Rating));
    }

    private static async Task UpdateTestimonialAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, TestimonialRow item)
    {
        const string sql = """
            update "Testimonials"
            set "ClientName" = @clientName,
                "Feedback" = @feedback,
                "Role" = @role,
                "Company" = @company,
                "AvatarUrl" = @avatarUrl,
                "Rating" = @rating
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("clientName", item.ClientName),
            ("feedback", item.Feedback),
            ("role", item.Role),
            ("company", item.Company),
            ("avatarUrl", item.AvatarUrl),
            ("rating", item.Rating));
    }

    private static async Task<List<MovieRow>> LoadMoviesAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "Year", "ReleaseDate", "Language", "Genre", "Role", "Director", "Poster", "Description", "Trailer"
            from "Movies"
            order by "Year", "Id";
            """;
        var items = new List<MovieRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new MovieRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetInt32(2),
                ReadNullableString(reader, 3),
                reader.GetString(4),
                ReadStringCollection(reader, 5),
                reader.GetString(6),
                reader.GetString(7),
                reader.GetString(8),
                reader.GetString(9),
                ReadNullableString(reader, 10)
            ));
        }
        return items;
    }

    private static async Task InsertMovieAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, MovieRow item)
    {
        const string sql = """
            insert into "Movies" ("Title", "Year", "ReleaseDate", "Language", "Genre", "Role", "Director", "Poster", "Description", "Trailer")
            values (@title, @year, @releaseDate, @language, @genre, @role, @director, @poster, @description, @trailer);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("year", item.Year),
            ("releaseDate", item.ReleaseDate),
            ("language", item.Language),
            ("genre", item.Genre.ToArray()),
            ("role", item.Role),
            ("director", item.Director),
            ("poster", item.Poster),
            ("description", item.Description),
            ("trailer", item.Trailer));
    }

    private static async Task UpdateMovieAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, MovieRow item)
    {
        const string sql = """
            update "Movies"
            set "Title" = @title,
                "Year" = @year,
                "ReleaseDate" = @releaseDate,
                "Language" = @language,
                "Genre" = @genre,
                "Role" = @role,
                "Director" = @director,
                "Poster" = @poster,
                "Description" = @description,
                "Trailer" = @trailer
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("year", item.Year),
            ("releaseDate", item.ReleaseDate),
            ("language", item.Language),
            ("genre", item.Genre.ToArray()),
            ("role", item.Role),
            ("director", item.Director),
            ("poster", item.Poster),
            ("description", item.Description),
            ("trailer", item.Trailer));
    }

    private static async Task<List<AwardRow>> LoadAwardsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "Year", "Description", "Quote", "ImageUrl", "Type", "Month"
            from "Awards"
            order by "Year", "Id";
            """;
        var items = new List<AwardRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new AwardRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetInt32(2),
                ReadNullableString(reader, 3),
                ReadNullableString(reader, 4),
                ReadNullableString(reader, 5),
                reader.GetString(6),
                ReadNullableString(reader, 7)
            ));
        }
        return items;
    }

    private static async Task InsertAwardAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, AwardRow item)
    {
        const string sql = """
            insert into "Awards" ("Title", "Year", "Description", "Quote", "ImageUrl", "Type", "Month")
            values (@title, @year, @description, @quote, @imageUrl, @type, @month);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("year", item.Year),
            ("description", item.Description),
            ("quote", item.Quote),
            ("imageUrl", item.ImageUrl),
            ("type", item.Type),
            ("month", item.Month));
    }

    private static async Task UpdateAwardAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, AwardRow item)
    {
        const string sql = """
            update "Awards"
            set "Title" = @title,
                "Year" = @year,
                "Description" = @description,
                "Quote" = @quote,
                "ImageUrl" = @imageUrl,
                "Type" = @type,
                "Month" = @month
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("year", item.Year),
            ("description", item.Description),
            ("quote", item.Quote),
            ("imageUrl", item.ImageUrl),
            ("type", item.Type),
            ("month", item.Month));
    }

    private static async Task<List<PhilanthropyRow>> LoadPhilanthropiesAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "Description", "Type", "Value", "ImageUrl", "Icon"
            from "Philanthropies"
            order by "Id";
            """;
        var items = new List<PhilanthropyRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new PhilanthropyRow(
                reader.GetInt32(0),
                reader.GetString(1),
                ReadNullableString(reader, 2),
                reader.GetString(3),
                reader.IsDBNull(4) ? null : reader.GetInt32(4),
                ReadNullableString(reader, 5),
                ReadNullableString(reader, 6)
            ));
        }
        return items;
    }

    private static async Task InsertPhilanthropyAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, PhilanthropyRow item)
    {
        const string sql = """
            insert into "Philanthropies" ("Title", "Description", "Type", "Value", "ImageUrl", "Icon")
            values (@title, @description, @type, @value, @imageUrl, @icon);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("description", item.Description),
            ("type", item.Type),
            ("value", item.Value),
            ("imageUrl", item.ImageUrl),
            ("icon", item.Icon));
    }

    private static async Task UpdatePhilanthropyAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, PhilanthropyRow item)
    {
        const string sql = """
            update "Philanthropies"
            set "Title" = @title,
                "Description" = @description,
                "Type" = @type,
                "Value" = @value,
                "ImageUrl" = @imageUrl,
                "Icon" = @icon
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("description", item.Description),
            ("type", item.Type),
            ("value", item.Value),
            ("imageUrl", item.ImageUrl),
            ("icon", item.Icon));
    }

    private static async Task<List<NewsArticleRow>> LoadNewsArticlesAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "Excerpt", "ImageUrl", "Link", "Date"
            from "NewsArticles"
            order by "Id";
            """;
        var items = new List<NewsArticleRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new NewsArticleRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                ReadNullableString(reader, 3),
                ReadNullableString(reader, 4),
                ReadNullableString(reader, 5)
            ));
        }
        return items;
    }

    private static async Task InsertNewsArticleAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, NewsArticleRow item)
    {
        const string sql = """
            insert into "NewsArticles" ("Title", "Excerpt", "ImageUrl", "Link", "Date")
            values (@title, @excerpt, @imageUrl, @link, @date);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("excerpt", item.Excerpt),
            ("imageUrl", item.ImageUrl),
            ("link", item.Link),
            ("date", item.Date));
    }

    private static async Task UpdateNewsArticleAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, NewsArticleRow item)
    {
        const string sql = """
            update "NewsArticles"
            set "Title" = @title,
                "Excerpt" = @excerpt,
                "ImageUrl" = @imageUrl,
                "Link" = @link,
                "Date" = @date
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("excerpt", item.Excerpt),
            ("imageUrl", item.ImageUrl),
            ("link", item.Link),
            ("date", item.Date));
    }

    private static async Task<List<GalleryCollectionRow>> LoadGalleryCollectionsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Key", "Title", "Subtitle", "Description", "Category", "CoverImageUrl", "AccentTone", "SortOrder"
            from "GalleryCollections"
            order by "SortOrder", "Id";
            """;
        var items = new List<GalleryCollectionRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new GalleryCollectionRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                ReadNullableString(reader, 3),
                ReadNullableString(reader, 4),
                reader.GetString(5),
                ReadNullableString(reader, 6),
                ReadNullableString(reader, 7),
                reader.GetInt32(8)
            ));
        }
        return items;
    }

    private static async Task InsertGalleryCollectionAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, GalleryCollectionRow item)
    {
        const string sql = """
            insert into "GalleryCollections" ("Key", "Title", "Subtitle", "Description", "Category", "CoverImageUrl", "AccentTone", "SortOrder")
            values (@key, @title, @subtitle, @description, @category, @coverImageUrl, @accentTone, @sortOrder);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("key", item.Key),
            ("title", item.Title),
            ("subtitle", item.Subtitle),
            ("description", item.Description),
            ("category", item.Category),
            ("coverImageUrl", item.CoverImageUrl),
            ("accentTone", item.AccentTone),
            ("sortOrder", item.SortOrder));
    }

    private static async Task UpdateGalleryCollectionAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, GalleryCollectionRow item)
    {
        const string sql = """
            update "GalleryCollections"
            set "Key" = @key,
                "Title" = @title,
                "Subtitle" = @subtitle,
                "Description" = @description,
                "Category" = @category,
                "CoverImageUrl" = @coverImageUrl,
                "AccentTone" = @accentTone,
                "SortOrder" = @sortOrder
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("key", item.Key),
            ("title", item.Title),
            ("subtitle", item.Subtitle),
            ("description", item.Description),
            ("category", item.Category),
            ("coverImageUrl", item.CoverImageUrl),
            ("accentTone", item.AccentTone),
            ("sortOrder", item.SortOrder));
    }

    private static async Task<List<MediaGalleryRow>> LoadMediaGalleriesAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Caption", "ImageUrl", "AltText", "Type", "Date", "CollectionKey", "DisplayOrder"
            from "MediaGalleries"
            order by "CollectionKey", "DisplayOrder", "Id";
            """;
        var items = new List<MediaGalleryRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new MediaGalleryRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                ReadNullableString(reader, 3),
                reader.GetString(4),
                ReadNullableString(reader, 5),
                ReadNullableString(reader, 6),
                reader.GetInt32(7)
            ));
        }
        return items;
    }

    private static async Task InsertMediaGalleryAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, MediaGalleryRow item)
    {
        const string sql = """
            insert into "MediaGalleries" ("Caption", "ImageUrl", "AltText", "Type", "Date", "CollectionKey", "DisplayOrder")
            values (@caption, @imageUrl, @altText, @type, @date, @collectionKey, @displayOrder);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("caption", item.Caption),
            ("imageUrl", item.ImageUrl),
            ("altText", item.AltText),
            ("type", item.Type),
            ("date", item.Date),
            ("collectionKey", item.CollectionKey),
            ("displayOrder", item.DisplayOrder));
    }

    private static async Task UpdateMediaGalleryAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, MediaGalleryRow item)
    {
        const string sql = """
            update "MediaGalleries"
            set "Caption" = @caption,
                "ImageUrl" = @imageUrl,
                "AltText" = @altText,
                "Type" = @type,
                "Date" = @date,
                "CollectionKey" = @collectionKey,
                "DisplayOrder" = @displayOrder
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("caption", item.Caption),
            ("imageUrl", item.ImageUrl),
            ("altText", item.AltText),
            ("type", item.Type),
            ("date", item.Date),
            ("collectionKey", item.CollectionKey),
            ("displayOrder", item.DisplayOrder));
    }

    private static async Task<List<FashionItemRow>> LoadFashionItemsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "Date", "Description", "ImageUrl", "Link"
            from "FashionItems"
            order by "Id";
            """;
        var items = new List<FashionItemRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new FashionItemRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetString(3),
                reader.GetString(4),
                ReadNullableString(reader, 5)
            ));
        }
        return items;
    }

    private static async Task InsertFashionItemAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, FashionItemRow item)
    {
        const string sql = """
            insert into "FashionItems" ("Title", "Date", "Description", "ImageUrl", "Link")
            values (@title, @date, @description, @imageUrl, @link);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("date", item.Date),
            ("description", item.Description),
            ("imageUrl", item.ImageUrl),
            ("link", item.Link));
    }

    private static async Task UpdateFashionItemAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, FashionItemRow item)
    {
        const string sql = """
            update "FashionItems"
            set "Title" = @title,
                "Date" = @date,
                "Description" = @description,
                "ImageUrl" = @imageUrl,
                "Link" = @link
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("date", item.Date),
            ("description", item.Description),
            ("imageUrl", item.ImageUrl),
            ("link", item.Link));
    }

    private static async Task<List<SiteSettingRow>> LoadSiteSettingsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Key", "Value"
            from "SiteSettings"
            order by "Key";
            """;
        var items = new List<SiteSettingRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new SiteSettingRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2)
            ));
        }
        return items;
    }

    private static async Task InsertSiteSettingAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, SiteSettingRow item)
    {
        const string sql = """
            insert into "SiteSettings" ("Key", "Value")
            values (@key, @value);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("key", item.Key),
            ("value", item.Value));
    }

    private static async Task UpdateSiteSettingAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, SiteSettingRow item)
    {
        const string sql = """
            update "SiteSettings"
            set "Key" = @key,
                "Value" = @value
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("key", item.Key),
            ("value", item.Value));
    }

    private static async Task<List<PageContentRow>> LoadPageContentsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Key", "ContentJson", "Description", "UpdatedAt"
            from "PageContents"
            order by "Key";
            """;
        var items = new List<PageContentRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new PageContentRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                ReadNullableString(reader, 3),
                reader.GetFieldValue<DateTime>(4)
            ));
        }
        return items;
    }

    private static async Task InsertPageContentAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, PageContentRow item)
    {
        const string sql = """
            insert into "PageContents" ("Key", "ContentJson", "Description", "UpdatedAt")
            values (@key, @contentJson, @description, @updatedAt);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("key", item.Key),
            ("contentJson", item.ContentJson),
            ("description", item.Description),
            ("updatedAt", item.UpdatedAt));
    }

    private static async Task UpdatePageContentAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, PageContentRow item)
    {
        const string sql = """
            update "PageContents"
            set "Key" = @key,
                "ContentJson" = @contentJson,
                "Description" = @description,
                "UpdatedAt" = @updatedAt
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("key", item.Key),
            ("contentJson", item.ContentJson),
            ("description", item.Description),
            ("updatedAt", item.UpdatedAt));
    }

    private static async Task<List<FanCreationRow>> LoadFanCreationsAsync(NpgsqlConnection connection, NpgsqlTransaction? transaction)
    {
        const string sql = """
            select "Id", "Title", "CreatorName", "Type", "Description", "ImageUrl", "MediaUrl", "DateLabel", "Platform", "IsFeatured"
            from "FanCreations"
            order by "Id";
            """;
        var items = new List<FanCreationRow>();
        await using var command = new NpgsqlCommand(sql, connection, transaction);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            items.Add(new FanCreationRow(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetString(3),
                ReadNullableString(reader, 4),
                reader.GetString(5),
                ReadNullableString(reader, 6),
                ReadNullableString(reader, 7),
                ReadNullableString(reader, 8),
                reader.GetBoolean(9)
            ));
        }
        return items;
    }

    private static async Task InsertFanCreationAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, FanCreationRow item)
    {
        const string sql = """
            insert into "FanCreations" ("Title", "CreatorName", "Type", "Description", "ImageUrl", "MediaUrl", "DateLabel", "Platform", "IsFeatured")
            values (@title, @creatorName, @type, @description, @imageUrl, @mediaUrl, @dateLabel, @platform, @isFeatured);
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("title", item.Title),
            ("creatorName", item.CreatorName),
            ("type", item.Type),
            ("description", item.Description),
            ("imageUrl", item.ImageUrl),
            ("mediaUrl", item.MediaUrl),
            ("dateLabel", item.DateLabel),
            ("platform", item.Platform),
            ("isFeatured", item.IsFeatured));
    }

    private static async Task UpdateFanCreationAsync(NpgsqlConnection connection, NpgsqlTransaction transaction, int id, FanCreationRow item)
    {
        const string sql = """
            update "FanCreations"
            set "Title" = @title,
                "CreatorName" = @creatorName,
                "Type" = @type,
                "Description" = @description,
                "ImageUrl" = @imageUrl,
                "MediaUrl" = @mediaUrl,
                "DateLabel" = @dateLabel,
                "Platform" = @platform,
                "IsFeatured" = @isFeatured
            where "Id" = @id;
            """;
        await ExecuteNonQueryAsync(connection, transaction, sql,
            ("id", id),
            ("title", item.Title),
            ("creatorName", item.CreatorName),
            ("type", item.Type),
            ("description", item.Description),
            ("imageUrl", item.ImageUrl),
            ("mediaUrl", item.MediaUrl),
            ("dateLabel", item.DateLabel),
            ("platform", item.Platform),
            ("isFeatured", item.IsFeatured));
    }

    private static string? ReadNullableString(NpgsqlDataReader reader, int ordinal)
    {
        return reader.IsDBNull(ordinal) ? null : reader.GetString(ordinal);
    }

    private static List<string> ReadStringCollection(NpgsqlDataReader reader, int ordinal)
    {
        if (reader.IsDBNull(ordinal))
        {
            return new List<string>();
        }

        var value = reader.GetValue(ordinal);
        return value switch
        {
            string[] values => values.ToList(),
            List<string> values => values.ToList(),
            string json when json.TrimStart().StartsWith("[", StringComparison.Ordinal) =>
                JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>(),
            string csv => csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),
            _ => throw new InvalidOperationException($"Unsupported string collection type: {value.GetType().FullName}")
        };
    }
}
