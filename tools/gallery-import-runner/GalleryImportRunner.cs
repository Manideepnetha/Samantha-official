using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

internal static class GalleryImportRunner
{
    public static async Task<int> RunAsync(string[] args)
    {
        ImportOptions options;

        try
        {
            options = ImportOptions.Parse(args);
        }
        catch (ArgumentException ex)
        {
            Console.Error.WriteLine(ex.Message);
            ImportOptions.PrintUsage();
            return 1;
        }

        Directory.CreateDirectory(options.BackupDirectory);

        var plans = GalleryImportHelpers.BuildCollectionPlans(options.BatchDirectories);
        if (plans.Count == 0)
        {
            Console.Error.WriteLine("No collections were discovered in the provided batch directories.");
            return 2;
        }

        Console.WriteLine($"Discovered {plans.Count} collections across {options.BatchDirectories.Count} processed batch folder(s).");

        using var httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromMinutes(10)
        };

        var apiClient = new LocalApiClient(httpClient, options.ApiBase);
        await apiClient.LoginAsync(options.Email, options.Password);

        var existingCollections = await apiClient.GetGalleryCollectionsAsync();
        var existingMedia = await apiClient.GetMediaAsync();
        var existingNonHomeMedia = existingMedia.Where(item => !string.Equals(item.Type, "Home", StringComparison.OrdinalIgnoreCase)).ToArray();

        await WriteBackupAsync(options.BackupDirectory, existingCollections, existingNonHomeMedia, plans);

        var uploadedAssets = new Dictionary<string, List<UploadedAsset>>(StringComparer.OrdinalIgnoreCase);

        for (var index = 0; index < plans.Count; index++)
        {
            var plan = plans[index];
            Console.WriteLine($"Uploading [{index + 1}/{plans.Count}] {plan.RelativePath} ({plan.Files.Count} files)");

            var assets = new List<UploadedAsset>(plan.Files.Count);
            foreach (var filePath in plan.Files)
            {
                var asset = await apiClient.UploadImageAsync(
                    filePath,
                    GalleryImportHelpers.BuildCloudinaryFolder(options.DefaultFolder, plan.Key));
                assets.Add(asset);
                Console.WriteLine($"  uploaded {Path.GetFileName(filePath)}");
            }

            uploadedAssets[plan.Key] = assets;
        }

        var protectedExistingCollectionIds = new HashSet<int>();
        var deletedExistingMediaIds = new HashSet<int>();
        var existingCollectionsByKey = existingCollections
            .Where(item => !string.IsNullOrWhiteSpace(item.Key) && item.Id.HasValue)
            .ToDictionary(item => item.Key, item => item, StringComparer.OrdinalIgnoreCase);

        for (var index = 0; index < plans.Count; index++)
        {
            var plan = plans[index];
            var assets = uploadedAssets[plan.Key];

            Console.WriteLine($"Saving API records [{index + 1}/{plans.Count}] {plan.Title}");

            GalleryCollectionDto collectionRecord;
            if (existingCollectionsByKey.TryGetValue(plan.Key, out var existingCollection))
            {
                protectedExistingCollectionIds.Add(existingCollection.Id!.Value);

                foreach (var media in existingNonHomeMedia.Where(item => string.Equals(item.CollectionKey, plan.Key, StringComparison.OrdinalIgnoreCase) && item.Id.HasValue))
                {
                    await apiClient.DeleteMediaAsync(media.Id!.Value);
                    deletedExistingMediaIds.Add(media.Id.Value);
                }

                collectionRecord = await apiClient.UpdateGalleryCollectionAsync(existingCollection.Id!.Value, new GalleryCollectionDto
                {
                    Id = existingCollection.Id,
                    Key = plan.Key,
                    Title = plan.Title,
                    Subtitle = plan.Subtitle,
                    Description = plan.Description,
                    Category = plan.Category,
                    CoverImageUrl = assets[0].Url,
                    AccentTone = plan.AccentTone,
                    SortOrder = plan.SortOrder
                });
            }
            else
            {
                collectionRecord = await apiClient.CreateGalleryCollectionAsync(new GalleryCollectionDto
                {
                    Key = plan.Key,
                    Title = plan.Title,
                    Subtitle = plan.Subtitle,
                    Description = plan.Description,
                    Category = plan.Category,
                    CoverImageUrl = assets[0].Url,
                    AccentTone = plan.AccentTone,
                    SortOrder = plan.SortOrder
                });
            }

            for (var assetIndex = 0; assetIndex < assets.Count; assetIndex++)
            {
                var caption = GalleryImportHelpers.BuildImageCaption(plan.Title, assetIndex, assets.Count);
                await apiClient.CreateMediaAsync(new MediaGalleryDto
                {
                    Caption = caption,
                    ImageUrl = assets[assetIndex].Url,
                    AltText = caption,
                    Type = plan.Category,
                    Date = string.Empty,
                    CollectionKey = collectionRecord.Key,
                    DisplayOrder = assetIndex + 1
                });
            }
        }

        if (options.ReplaceExisting)
        {
            Console.WriteLine("Removing the previous placeholder gallery records.");

            foreach (var media in existingNonHomeMedia)
            {
                if (!media.Id.HasValue || deletedExistingMediaIds.Contains(media.Id.Value))
                {
                    continue;
                }

                await apiClient.DeleteMediaAsync(media.Id.Value, ignoreNotFound: true);
            }

            foreach (var collection in existingCollections)
            {
                if (!collection.Id.HasValue || protectedExistingCollectionIds.Contains(collection.Id.Value))
                {
                    continue;
                }

                await apiClient.DeleteGalleryCollectionAsync(collection.Id.Value, ignoreNotFound: true);
            }
        }

        var finalCollections = await apiClient.GetGalleryCollectionsAsync();
        var finalMedia = await apiClient.GetMediaAsync();
        var finalNonHomeMedia = finalMedia.Where(item => !string.Equals(item.Type, "Home", StringComparison.OrdinalIgnoreCase)).ToArray();

        var report = new ImportReport
        {
            ImportedAt = DateTimeOffset.Now,
            CollectionCount = plans.Count,
            ImageCount = plans.Sum(item => item.Files.Count),
            FinalCollectionCount = finalCollections.Count,
            FinalImageCount = finalNonHomeMedia.Length,
            ImportedCollectionKeys = plans.Select(item => item.Key).ToArray()
        };

        await File.WriteAllTextAsync(
            Path.Combine(options.BackupDirectory, "import-report.json"),
            JsonSerializer.Serialize(report, GalleryImportRunnerJson.Options));

        Console.WriteLine();
        Console.WriteLine($"Imported {report.CollectionCount} collections and {report.ImageCount} images.");
        Console.WriteLine($"API now returns {report.FinalCollectionCount} collections and {report.FinalImageCount} non-home gallery images.");

        return 0;
    }
    private static async Task WriteBackupAsync(
        string backupDirectory,
        IReadOnlyList<GalleryCollectionDto> collections,
        IReadOnlyList<MediaGalleryDto> media,
        IReadOnlyList<CollectionImportPlan> plans)
    {
        var backup = new
        {
            createdAt = DateTimeOffset.Now,
            existingCollections = collections,
            existingMedia = media,
            importPlan = plans.Select(plan => new
            {
                plan.RelativePath,
                plan.Key,
                plan.Title,
                plan.Subtitle,
                plan.Category,
                plan.SortOrder,
                fileCount = plan.Files.Count
            })
        };

        await File.WriteAllTextAsync(
            Path.Combine(backupDirectory, "pre-import-backup.json"),
            JsonSerializer.Serialize(backup, GalleryImportRunnerJson.Options));
    }
}
