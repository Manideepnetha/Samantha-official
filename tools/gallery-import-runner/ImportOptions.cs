using System.Globalization;

internal sealed class ImportOptions
{
    public required string ApiBase { get; init; }
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string CloudName { get; init; }
    public required string UploadPreset { get; init; }
    public required string DefaultFolder { get; init; }
    public required string BackupDirectory { get; init; }
    public required bool ReplaceExisting { get; init; }
    public required IReadOnlyList<string> BatchDirectories { get; init; }

    public static ImportOptions Parse(string[] args)
    {
        string? apiBase = null;
        string? email = null;
        string? password = null;
        string cloudName = "dpnd6ve1e";
        string uploadPreset = "ml_default";
        string defaultFolder = "samantha-official-website";
        string? backupDirectory = null;
        var replaceExisting = false;
        var batches = new List<string>();

        for (var index = 0; index < args.Length; index++)
        {
            var current = args[index];
            if (string.Equals(current, "--replace-existing", StringComparison.OrdinalIgnoreCase))
            {
                replaceExisting = true;
                continue;
            }

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
                case "--api-base":
                    apiBase = value;
                    break;
                case "--email":
                    email = value;
                    break;
                case "--password":
                    password = value;
                    break;
                case "--cloud-name":
                    cloudName = value;
                    break;
                case "--upload-preset":
                    uploadPreset = value;
                    break;
                case "--default-folder":
                    defaultFolder = value;
                    break;
                case "--backup-dir":
                    backupDirectory = value;
                    break;
                case "--batch":
                    batches.Add(Path.GetFullPath(value));
                    break;
                default:
                    throw new ArgumentException($"Unknown argument: {current}");
            }
        }

        if (string.IsNullOrWhiteSpace(apiBase))
        {
            throw new ArgumentException("The --api-base option is required.");
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("The --email option is required.");
        }

        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("The --password option is required.");
        }

        if (batches.Count == 0)
        {
            throw new ArgumentException("At least one --batch directory is required.");
        }

        foreach (var batch in batches)
        {
            if (!Directory.Exists(batch))
            {
                throw new ArgumentException($"The batch directory does not exist: {batch}");
            }
        }

        if (string.IsNullOrWhiteSpace(backupDirectory))
        {
            backupDirectory = Path.Combine(
                Directory.GetCurrentDirectory(),
                "tmp",
                "gallery-import-backups",
                DateTime.Now.ToString("yyyyMMdd-HHmmss", CultureInfo.InvariantCulture));
        }

        return new ImportOptions
        {
            ApiBase = apiBase.TrimEnd('/'),
            Email = email,
            Password = password,
            CloudName = cloudName,
            UploadPreset = uploadPreset,
            DefaultFolder = defaultFolder,
            BackupDirectory = Path.GetFullPath(backupDirectory),
            ReplaceExisting = replaceExisting,
            BatchDirectories = batches
        };
    }

    public static void PrintUsage()
    {
        Console.WriteLine("Usage:");
        Console.WriteLine("  dotnet run --project tools/gallery-import-runner -- --api-base http://localhost:5035/api --email <email> --password <password> --batch <normalized-dir> [--batch <normalized-dir>] [--backup-dir <dir>] [--cloud-name dpnd6ve1e] [--upload-preset ml_default] [--default-folder samantha-official-website] [--replace-existing]");
    }
}
