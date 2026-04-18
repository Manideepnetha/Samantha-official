using System.Globalization;
using System.Text;
using System.Text.Json;
using ImageMagick;

var exitCode = GalleryImportProcessor.Run(args);
return exitCode;

internal static class GalleryImportProcessor
{
    private static readonly HashSet<string> SupportedRasterExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    };

    private static readonly HashSet<string> RawExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".arw",
        ".cr2",
        ".cr3",
        ".dng",
        ".nef",
        ".orf",
        ".rw2",
    };

    private static readonly int[] QualitySteps = [92, 88, 84, 80, 76, 72, 68, 64, 60];

    public static int Run(string[] args)
    {
        CliOptions options;

        try
        {
            options = CliOptions.Parse(args);
        }
        catch (ArgumentException ex)
        {
            Console.Error.WriteLine(ex.Message);
            CliOptions.PrintUsage();
            return 1;
        }

        Directory.CreateDirectory(options.OutputDirectory);
        Directory.CreateDirectory(options.ManifestDirectory);

        var sourceFiles = Directory
            .EnumerateFiles(options.InputDirectory, "*", SearchOption.AllDirectories)
            .OrderBy(path => path, StringComparer.OrdinalIgnoreCase)
            .ToArray();

        var reservedOutputPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var records = new List<AssetRecord>(sourceFiles.Length);

        foreach (var sourcePath in sourceFiles)
        {
            var sourceRelativePath = ToPortablePath(Path.GetRelativePath(options.InputDirectory, sourcePath));

            try
            {
                var record = ProcessFile(sourcePath, sourceRelativePath, options, reservedOutputPaths);
                records.Add(record);
                Console.WriteLine($"{record.Action,-14} {record.SourceRelativePath}");
            }
        catch (Exception ex)
        {
            var info = new FileInfo(sourcePath);
            var record = AssetRecord.CreateFailure(
                sourceRelativePath,
                info.Length,
                ReadImageMetadata(sourcePath),
                ex.Message);

                records.Add(record);
                Console.Error.WriteLine($"failed         {sourceRelativePath} :: {ex.Message}");
            }
        }

        var summary = BuildSummary(options, records);
        WriteManifests(options, records, summary);

        Console.WriteLine();
        Console.WriteLine($"Processed {summary.TotalFiles} files.");
        Console.WriteLine($"Ready outputs: {summary.ReadyCount}");
        Console.WriteLine($"Failures: {summary.FailedCount}");
        Console.WriteLine($"Outputs over limit: {summary.OutputOverLimitCount}");

        return summary.FailedCount == 0 && summary.OutputOverLimitCount == 0 ? 0 : 2;
    }

    private static AssetRecord ProcessFile(
        string sourcePath,
        string sourceRelativePath,
        CliOptions options,
        HashSet<string> reservedOutputPaths)
    {
        var extension = Path.GetExtension(sourcePath);
        var info = new FileInfo(sourcePath);
        var sourceMetadata = ReadImageMetadata(sourcePath);

        if (!SupportedRasterExtensions.Contains(extension) && !RawExtensions.Contains(extension))
        {
            return AssetRecord.CreateSkipped(sourceRelativePath, info.Length, sourceMetadata, $"Unsupported extension: {extension}");
        }

        if (!RawExtensions.Contains(extension) && IsAlreadyWithinLimits(info.Length, sourceMetadata, options))
        {
            var outputRelativePath = ReserveDestinationPath(sourceRelativePath, extension, reservedOutputPaths);
            var outputPath = Path.Combine(options.OutputDirectory, outputRelativePath);

            Directory.CreateDirectory(Path.GetDirectoryName(outputPath)!);
            File.Copy(sourcePath, outputPath, overwrite: true);

            var outputInfo = new FileInfo(outputPath);
            var outputMetadata = ReadImageMetadata(outputPath);

            return AssetRecord.CreateSuccess(
                action: "copied",
                sourceRelativePath: sourceRelativePath,
                outputRelativePath: outputRelativePath,
                sourceBytes: info.Length,
                outputBytes: outputInfo.Length,
                sourceMetadata: sourceMetadata,
                outputMetadata: outputMetadata,
                notes: string.Empty);
        }

        using var image = new MagickImage(sourcePath);
        image.AutoOrient();
        image.ColorSpace = ColorSpace.sRGB;
        image.Depth = 8;
        image.Strip();

        ResizeToMegapixelBudget(image, options.MaxMegapixels);

        var outputRelativeForNormalized = ReserveDestinationPath(sourceRelativePath, ".jpg", reservedOutputPaths);
        var outputPathForNormalized = Path.Combine(options.OutputDirectory, outputRelativeForNormalized);
        Directory.CreateDirectory(Path.GetDirectoryName(outputPathForNormalized)!);

        var encoded = EncodeJpegWithinLimit(image, options.MaxFileBytes);
        File.WriteAllBytes(outputPathForNormalized, encoded.Bytes);

        var outputInfoForNormalized = new FileInfo(outputPathForNormalized);
        var outputMetadataForNormalized = ReadImageMetadata(outputPathForNormalized);
        var action = RawExtensions.Contains(extension) ? "converted_raw" : "normalized";
        var notes = encoded.WasResizedDuringEncode
            ? $"quality={encoded.Quality}; resized-during-encode={encoded.ResizePasses}"
            : $"quality={encoded.Quality}";

        return AssetRecord.CreateSuccess(
            action: action,
            sourceRelativePath: sourceRelativePath,
            outputRelativePath: outputRelativeForNormalized,
            sourceBytes: info.Length,
            outputBytes: outputInfoForNormalized.Length,
            sourceMetadata: sourceMetadata,
            outputMetadata: outputMetadataForNormalized,
            notes: notes);
    }

    private static bool IsAlreadyWithinLimits(long sourceBytes, ImageMetadata metadata, CliOptions options)
    {
        if (sourceBytes > options.MaxFileBytes)
        {
            return false;
        }

        if (!metadata.HasDimensions)
        {
            return false;
        }

        return metadata.Megapixels <= options.MaxMegapixels;
    }

    private static ImageMetadata ReadImageMetadata(string path)
    {
        try
        {
            var info = new MagickImageInfo(path);
            return new ImageMetadata((int)info.Width, (int)info.Height, info.Format.ToString());
        }
        catch
        {
            return ImageMetadata.Empty;
        }
    }

    private static void ResizeToMegapixelBudget(MagickImage image, double maxMegapixels)
    {
        var megapixels = GetMegapixels(image.Width, image.Height);
        if (megapixels <= maxMegapixels)
        {
            return;
        }

        var scale = Math.Sqrt(maxMegapixels / megapixels) * 0.985d;
        var width = Math.Max(1u, (uint)Math.Floor(image.Width * scale));
        var height = Math.Max(1u, (uint)Math.Floor(image.Height * scale));
        image.Resize(width, height);
    }

    private static EncodedResult EncodeJpegWithinLimit(MagickImage sourceImage, long maxFileBytes)
    {
        byte[]? bestBytes = null;
        int bestQuality = QualitySteps[^1];
        int resizePassesForBest = 0;
        long bestLength = long.MaxValue;

        using var working = sourceImage.Clone();

        for (var resizePass = 0; resizePass < 12; resizePass++)
        {
            foreach (var quality in QualitySteps)
            {
                using var candidate = working.Clone();
                candidate.Format = MagickFormat.Jpeg;
                candidate.Quality = (uint)quality;

                using var stream = new MemoryStream();
                candidate.Write(stream);
                var bytes = stream.ToArray();

                if (bytes.LongLength < bestLength)
                {
                    bestBytes = bytes;
                    bestLength = bytes.LongLength;
                    bestQuality = quality;
                    resizePassesForBest = resizePass;
                }

                if (bytes.LongLength <= maxFileBytes)
                {
                    return new EncodedResult(bytes, quality, resizePass);
                }
            }

            var nextWidth = Math.Max(1u, (uint)Math.Floor(working.Width * 0.88d));
            var nextHeight = Math.Max(1u, (uint)Math.Floor(working.Height * 0.88d));

            if (nextWidth == working.Width && nextHeight == working.Height)
            {
                break;
            }

            working.Resize(nextWidth, nextHeight);
        }

        if (bestBytes is null)
        {
            throw new InvalidOperationException("Could not encode image.");
        }

        return new EncodedResult(bestBytes, bestQuality, resizePassesForBest);
    }

    private static BatchSummary BuildSummary(CliOptions options, IReadOnlyCollection<AssetRecord> records)
    {
        var readyCount = records.Count(record =>
            record.Status == "ready"
            && record.OutputBytes is not null
            && record.OutputBytes <= options.MaxFileBytes
            && (record.OutputMegapixels is null || record.OutputMegapixels <= options.MaxMegapixels));

        var outputOverLimitCount = records.Count(record =>
            record.Status == "ready"
            && ((record.OutputBytes is not null && record.OutputBytes > options.MaxFileBytes)
                || (record.OutputMegapixels is not null && record.OutputMegapixels > options.MaxMegapixels)));

        return new BatchSummary
        {
            CreatedAt = DateTimeOffset.Now,
            InputDirectory = options.InputDirectory,
            OutputDirectory = options.OutputDirectory,
            ManifestDirectory = options.ManifestDirectory,
            TotalFiles = records.Count,
            CopiedCount = records.Count(record => record.Action == "copied"),
            NormalizedCount = records.Count(record => record.Action == "normalized"),
            ConvertedRawCount = records.Count(record => record.Action == "converted_raw"),
            FailedCount = records.Count(record => record.Action == "failed"),
            SkippedCount = records.Count(record => record.Action == "skipped"),
            ReadyCount = readyCount,
            OutputOverLimitCount = outputOverLimitCount,
            SourceTotalSizeMb = Math.Round(records.Sum(record => record.SourceBytes) / 1024d / 1024d, 2),
            OutputTotalSizeMb = Math.Round(records.Sum(record => record.OutputBytes ?? 0) / 1024d / 1024d, 2),
        };
    }

    private static void WriteManifests(CliOptions options, IReadOnlyCollection<AssetRecord> records, BatchSummary summary)
    {
        Directory.CreateDirectory(options.ManifestDirectory);

        var jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
        };

        File.WriteAllText(
            Path.Combine(options.ManifestDirectory, "summary.json"),
            JsonSerializer.Serialize(summary, jsonOptions));

        File.WriteAllText(
            Path.Combine(options.ManifestDirectory, "records.json"),
            JsonSerializer.Serialize(records, jsonOptions));

        var folderSummaries = records
            .GroupBy(record => GetFolderPath(record.SourceRelativePath), StringComparer.OrdinalIgnoreCase)
            .OrderBy(group => group.Key, StringComparer.OrdinalIgnoreCase)
            .Select(group => new FolderSummary
            {
                Folder = group.Key,
                TotalFiles = group.Count(),
                ReadyCount = group.Count(item => item.Status == "ready"),
                FailedCount = group.Count(item => item.Action == "failed"),
                SourceSizeMb = Math.Round(group.Sum(item => item.SourceBytes) / 1024d / 1024d, 2),
                OutputSizeMb = Math.Round(group.Sum(item => item.OutputBytes ?? 0) / 1024d / 1024d, 2),
            })
            .ToArray();

        File.WriteAllText(
            Path.Combine(options.ManifestDirectory, "folders.json"),
            JsonSerializer.Serialize(folderSummaries, jsonOptions));

        var csvBuilder = new StringBuilder();
        csvBuilder.AppendLine("source_relative_path,output_relative_path,action,status,source_bytes,output_bytes,source_width,source_height,output_width,output_height,source_megapixels,output_megapixels,error,notes");

        foreach (var record in records)
        {
            csvBuilder.AppendLine(string.Join(",",
                EscapeCsv(record.SourceRelativePath),
                EscapeCsv(record.OutputRelativePath ?? string.Empty),
                EscapeCsv(record.Action),
                EscapeCsv(record.Status),
                record.SourceBytes.ToString(CultureInfo.InvariantCulture),
                (record.OutputBytes ?? 0).ToString(CultureInfo.InvariantCulture),
                (record.SourceWidth ?? 0).ToString(CultureInfo.InvariantCulture),
                (record.SourceHeight ?? 0).ToString(CultureInfo.InvariantCulture),
                (record.OutputWidth ?? 0).ToString(CultureInfo.InvariantCulture),
                (record.OutputHeight ?? 0).ToString(CultureInfo.InvariantCulture),
                (record.SourceMegapixels ?? 0).ToString("0.###", CultureInfo.InvariantCulture),
                (record.OutputMegapixels ?? 0).ToString("0.###", CultureInfo.InvariantCulture),
                EscapeCsv(record.Error ?? string.Empty),
                EscapeCsv(record.Notes ?? string.Empty)));
        }

        File.WriteAllText(Path.Combine(options.ManifestDirectory, "records.csv"), csvBuilder.ToString());
    }

    private static string ReserveDestinationPath(string sourceRelativePath, string targetExtension, HashSet<string> reservedOutputPaths)
    {
        var normalizedTargetExtension = targetExtension.StartsWith('.') ? targetExtension : $".{targetExtension}";
        var directory = Path.GetDirectoryName(sourceRelativePath);
        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(sourceRelativePath);
        var sourceExtensionLabel = Path.GetExtension(sourceRelativePath).TrimStart('.').ToLowerInvariant();

        var candidate = ToPortablePath(Path.ChangeExtension(sourceRelativePath, normalizedTargetExtension));
        if (reservedOutputPaths.Add(candidate))
        {
            return candidate;
        }

        var attempt = 1;
        while (true)
        {
            var suffixedFileName = $"{fileNameWithoutExtension}-from-{sourceExtensionLabel}";
            if (attempt > 1)
            {
                suffixedFileName = $"{suffixedFileName}-{attempt}";
            }

            var combined = directory is null
                ? $"{suffixedFileName}{normalizedTargetExtension}"
                : Path.Combine(directory, $"{suffixedFileName}{normalizedTargetExtension}");

            candidate = ToPortablePath(combined);
            if (reservedOutputPaths.Add(candidate))
            {
                return candidate;
            }

            attempt++;
        }
    }

    private static string GetFolderPath(string relativePath)
    {
        var directory = Path.GetDirectoryName(relativePath);
        return string.IsNullOrWhiteSpace(directory) ? "." : ToPortablePath(directory);
    }

    private static string EscapeCsv(string value)
    {
        if (!value.Contains(',') && !value.Contains('"') && !value.Contains('\n') && !value.Contains('\r'))
        {
            return value;
        }

        return $"\"{value.Replace("\"", "\"\"", StringComparison.Ordinal)}\"";
    }

    private static string ToPortablePath(string value) => value.Replace('\\', '/');

    private static double GetMegapixels(uint width, uint height) => (width * height) / 1_000_000d;
}

internal sealed class CliOptions
{
    public required string InputDirectory { get; init; }
    public required string OutputDirectory { get; init; }
    public required string ManifestDirectory { get; init; }
    public long MaxFileBytes { get; init; } = 9_500_000;
    public double MaxMegapixels { get; init; } = 24d;

    public static CliOptions Parse(string[] args)
    {
        if (args.Length == 0 || args.Contains("--help", StringComparer.OrdinalIgnoreCase) || args.Contains("-h", StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Missing required arguments.");
        }

        string? input = null;
        string? output = null;
        string? manifest = null;
        double? maxFileMb = null;
        double? maxMegapixels = null;

        for (var index = 0; index < args.Length; index++)
        {
            var current = args[index];
            if (!current.StartsWith("--", StringComparison.Ordinal))
            {
                throw new ArgumentException($"Unexpected argument: {current}");
            }

            if (index == args.Length - 1)
            {
                throw new ArgumentException($"Missing value for argument: {current}");
            }

            var value = args[++index];
            switch (current)
            {
                case "--input":
                    input = value;
                    break;
                case "--output":
                    output = value;
                    break;
                case "--manifest":
                    manifest = value;
                    break;
                case "--max-file-mb":
                    maxFileMb = double.Parse(value, CultureInfo.InvariantCulture);
                    break;
                case "--max-megapixels":
                    maxMegapixels = double.Parse(value, CultureInfo.InvariantCulture);
                    break;
                default:
                    throw new ArgumentException($"Unknown argument: {current}");
            }
        }

        if (string.IsNullOrWhiteSpace(input) || !Directory.Exists(input))
        {
            throw new ArgumentException("The --input directory is required and must exist.");
        }

        if (string.IsNullOrWhiteSpace(output))
        {
            throw new ArgumentException("The --output directory is required.");
        }

        if (string.IsNullOrWhiteSpace(manifest))
        {
            throw new ArgumentException("The --manifest directory is required.");
        }

        return new CliOptions
        {
            InputDirectory = Path.GetFullPath(input),
            OutputDirectory = Path.GetFullPath(output),
            ManifestDirectory = Path.GetFullPath(manifest),
            MaxFileBytes = (long)Math.Round((maxFileMb ?? 9.5d) * 1024d * 1024d),
            MaxMegapixels = maxMegapixels ?? 24d,
        };
    }

    public static void PrintUsage()
    {
        Console.WriteLine("Usage:");
        Console.WriteLine("  dotnet run --project tools/gallery-import-processor -- --input <dir> --output <dir> --manifest <dir> [--max-file-mb 9.5] [--max-megapixels 24]");
    }
}

internal sealed class AssetRecord
{
    public required string SourceRelativePath { get; init; }
    public string? OutputRelativePath { get; init; }
    public required string Action { get; init; }
    public required string Status { get; init; }
    public required long SourceBytes { get; init; }
    public long? OutputBytes { get; init; }
    public int? SourceWidth { get; init; }
    public int? SourceHeight { get; init; }
    public int? OutputWidth { get; init; }
    public int? OutputHeight { get; init; }
    public double? SourceMegapixels { get; init; }
    public double? OutputMegapixels { get; init; }
    public string? SourceFormat { get; init; }
    public string? OutputFormat { get; init; }
    public string? Error { get; init; }
    public string? Notes { get; init; }

    public static AssetRecord CreateSuccess(
        string action,
        string sourceRelativePath,
        string outputRelativePath,
        long sourceBytes,
        long outputBytes,
        ImageMetadata sourceMetadata,
        ImageMetadata outputMetadata,
        string notes)
    {
        return new AssetRecord
        {
            SourceRelativePath = sourceRelativePath,
            OutputRelativePath = outputRelativePath,
            Action = action,
            Status = "ready",
            SourceBytes = sourceBytes,
            OutputBytes = outputBytes,
            SourceWidth = sourceMetadata.Width,
            SourceHeight = sourceMetadata.Height,
            OutputWidth = outputMetadata.Width,
            OutputHeight = outputMetadata.Height,
            SourceMegapixels = sourceMetadata.Megapixels,
            OutputMegapixels = outputMetadata.Megapixels,
            SourceFormat = sourceMetadata.Format,
            OutputFormat = outputMetadata.Format,
            Notes = notes,
        };
    }

    public static AssetRecord CreateFailure(
        string sourceRelativePath,
        long sourceBytes,
        ImageMetadata sourceMetadata,
        string error)
    {
        return new AssetRecord
        {
            SourceRelativePath = sourceRelativePath,
            Action = "failed",
            Status = "error",
            SourceBytes = sourceBytes,
            SourceWidth = sourceMetadata.Width,
            SourceHeight = sourceMetadata.Height,
            SourceMegapixels = sourceMetadata.Megapixels,
            SourceFormat = sourceMetadata.Format,
            Error = error,
        };
    }

    public static AssetRecord CreateSkipped(
        string sourceRelativePath,
        long sourceBytes,
        ImageMetadata sourceMetadata,
        string notes)
    {
        return new AssetRecord
        {
            SourceRelativePath = sourceRelativePath,
            Action = "skipped",
            Status = "skipped",
            SourceBytes = sourceBytes,
            SourceWidth = sourceMetadata.Width,
            SourceHeight = sourceMetadata.Height,
            SourceMegapixels = sourceMetadata.Megapixels,
            SourceFormat = sourceMetadata.Format,
            Notes = notes,
        };
    }
}

internal sealed class ImageMetadata
{
    public static ImageMetadata Empty { get; } = new(null, null, null);

    public ImageMetadata(int? width, int? height, string? format)
    {
        Width = width;
        Height = height;
        Format = format;
    }

    public int? Width { get; }
    public int? Height { get; }
    public string? Format { get; }
    public bool HasDimensions => Width.HasValue && Height.HasValue;
    public double? Megapixels => HasDimensions ? (Width!.Value * Height!.Value) / 1_000_000d : null;
}

internal sealed class EncodedResult
{
    public EncodedResult(byte[] bytes, int quality, int resizePasses)
    {
        Bytes = bytes;
        Quality = quality;
        ResizePasses = resizePasses;
    }

    public byte[] Bytes { get; }
    public int Quality { get; }
    public int ResizePasses { get; }
    public bool WasResizedDuringEncode => ResizePasses > 0;
}

internal sealed class BatchSummary
{
    public required DateTimeOffset CreatedAt { get; init; }
    public required string InputDirectory { get; init; }
    public required string OutputDirectory { get; init; }
    public required string ManifestDirectory { get; init; }
    public required int TotalFiles { get; init; }
    public required int CopiedCount { get; init; }
    public required int NormalizedCount { get; init; }
    public required int ConvertedRawCount { get; init; }
    public required int FailedCount { get; init; }
    public required int SkippedCount { get; init; }
    public required int ReadyCount { get; init; }
    public required int OutputOverLimitCount { get; init; }
    public required double SourceTotalSizeMb { get; init; }
    public required double OutputTotalSizeMb { get; init; }
}

internal sealed class FolderSummary
{
    public required string Folder { get; init; }
    public required int TotalFiles { get; init; }
    public required int ReadyCount { get; init; }
    public required int FailedCount { get; init; }
    public required double SourceSizeMb { get; init; }
    public required double OutputSizeMb { get; init; }
}
