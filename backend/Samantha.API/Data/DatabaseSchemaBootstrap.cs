using Microsoft.EntityFrameworkCore;

namespace Samantha.API.Data;

public static class DatabaseSchemaBootstrap
{
    public static void EnsureCompatibleSchema(AppDbContext context, ILogger logger)
    {
        Execute(context, logger, "core content schema", @"
            CREATE TABLE IF NOT EXISTS ""SiteSettings"" (
                ""Id"" serial NOT NULL,
                ""Key"" text NOT NULL,
                ""Value"" text NOT NULL,
                CONSTRAINT ""PK_SiteSettings"" PRIMARY KEY (""Id"")
            );

            CREATE TABLE IF NOT EXISTS ""PageContents"" (
                ""Id"" serial NOT NULL,
                ""Key"" text NOT NULL,
                ""ContentJson"" text NOT NULL,
                ""Description"" text NULL,
                ""UpdatedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT ""PK_PageContents"" PRIMARY KEY (""Id"")
            );

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_PageContents_Key"" ON ""PageContents"" (""Key"");

            ALTER TABLE IF EXISTS ""Users"" ADD COLUMN IF NOT EXISTS ""Role"" text NOT NULL DEFAULT 'Admin';
            ALTER TABLE IF EXISTS ""ContactMessages"" ADD COLUMN IF NOT EXISTS ""Category"" text;
            ALTER TABLE IF EXISTS ""ContactMessages"" ADD COLUMN IF NOT EXISTS ""MetadataJson"" text;
            ALTER TABLE IF EXISTS ""ContactMessages"" ADD COLUMN IF NOT EXISTS ""SubmittedAt"" timestamp with time zone NOT NULL DEFAULT NOW();
        ");

        Execute(context, logger, "content model schema", @"
            ALTER TABLE IF EXISTS ""Movies"" ADD COLUMN IF NOT EXISTS ""ReleaseDate"" text;
            ALTER TABLE IF EXISTS ""Movies"" ADD COLUMN IF NOT EXISTS ""Trailer"" text;

            ALTER TABLE IF EXISTS ""Awards"" ADD COLUMN IF NOT EXISTS ""Description"" text;
            ALTER TABLE IF EXISTS ""Awards"" ADD COLUMN IF NOT EXISTS ""Quote"" text;
            ALTER TABLE IF EXISTS ""Awards"" ADD COLUMN IF NOT EXISTS ""ImageUrl"" text;
            ALTER TABLE IF EXISTS ""Awards"" ADD COLUMN IF NOT EXISTS ""Type"" text NOT NULL DEFAULT 'Timeline';
            ALTER TABLE IF EXISTS ""Awards"" ADD COLUMN IF NOT EXISTS ""Month"" text;

            ALTER TABLE IF EXISTS ""Philanthropies"" ADD COLUMN IF NOT EXISTS ""Description"" text;
            ALTER TABLE IF EXISTS ""Philanthropies"" ADD COLUMN IF NOT EXISTS ""Value"" integer;
            ALTER TABLE IF EXISTS ""Philanthropies"" ADD COLUMN IF NOT EXISTS ""ImageUrl"" text;
            ALTER TABLE IF EXISTS ""Philanthropies"" ADD COLUMN IF NOT EXISTS ""Icon"" text;

            ALTER TABLE IF EXISTS ""NewsArticles"" ADD COLUMN IF NOT EXISTS ""ImageUrl"" text;
            ALTER TABLE IF EXISTS ""NewsArticles"" ADD COLUMN IF NOT EXISTS ""Link"" text;
            ALTER TABLE IF EXISTS ""NewsArticles"" ADD COLUMN IF NOT EXISTS ""Date"" text;

            ALTER TABLE IF EXISTS ""FashionItems"" ADD COLUMN IF NOT EXISTS ""Link"" text;
        ");

        Execute(context, logger, "gallery schema", @"
            CREATE TABLE IF NOT EXISTS ""GalleryCollections"" (
                ""Id"" serial NOT NULL,
                ""Key"" text NOT NULL,
                ""Title"" text NOT NULL,
                ""Subtitle"" text NULL,
                ""Description"" text NULL,
                ""Category"" text NOT NULL,
                ""CoverImageUrl"" text NULL,
                ""AccentTone"" text NULL,
                ""SortOrder"" integer NOT NULL DEFAULT 0,
                CONSTRAINT ""PK_GalleryCollections"" PRIMARY KEY (""Id"")
            );

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_GalleryCollections_Key"" ON ""GalleryCollections"" (""Key"");

            ALTER TABLE IF EXISTS ""GalleryCollections"" ADD COLUMN IF NOT EXISTS ""Subtitle"" text;
            ALTER TABLE IF EXISTS ""GalleryCollections"" ADD COLUMN IF NOT EXISTS ""Description"" text;
            ALTER TABLE IF EXISTS ""GalleryCollections"" ADD COLUMN IF NOT EXISTS ""Category"" text NOT NULL DEFAULT 'general';
            ALTER TABLE IF EXISTS ""GalleryCollections"" ADD COLUMN IF NOT EXISTS ""CoverImageUrl"" text;
            ALTER TABLE IF EXISTS ""GalleryCollections"" ADD COLUMN IF NOT EXISTS ""AccentTone"" text;
            ALTER TABLE IF EXISTS ""GalleryCollections"" ADD COLUMN IF NOT EXISTS ""SortOrder"" integer NOT NULL DEFAULT 0;

            ALTER TABLE IF EXISTS ""MediaGalleries"" ADD COLUMN IF NOT EXISTS ""AltText"" text;
            ALTER TABLE IF EXISTS ""MediaGalleries"" ADD COLUMN IF NOT EXISTS ""Type"" text NOT NULL DEFAULT 'Home';
            ALTER TABLE IF EXISTS ""MediaGalleries"" ADD COLUMN IF NOT EXISTS ""Date"" text;
            ALTER TABLE IF EXISTS ""MediaGalleries"" ADD COLUMN IF NOT EXISTS ""CollectionKey"" text;
            ALTER TABLE IF EXISTS ""MediaGalleries"" ADD COLUMN IF NOT EXISTS ""DisplayOrder"" integer NOT NULL DEFAULT 0;

            CREATE INDEX IF NOT EXISTS ""IX_MediaGalleries_CollectionKey"" ON ""MediaGalleries"" (""CollectionKey"");
        ");

        Execute(context, logger, "quiz and fan schema", @"
            CREATE TABLE IF NOT EXISTS ""QuizEntries"" (
                ""Id"" serial NOT NULL,
                ""ClientSubmissionId"" text NULL,
                ""Name"" text NOT NULL,
                ""Email"" text NOT NULL,
                ""City"" text NULL,
                ""Score"" integer NOT NULL DEFAULT 0,
                ""TotalQuestions"" integer NOT NULL DEFAULT 0,
                ""TimeTakenSeconds"" integer NOT NULL DEFAULT 0,
                ""SubmittedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT ""PK_QuizEntries"" PRIMARY KEY (""Id"")
            );

            CREATE INDEX IF NOT EXISTS ""IX_QuizEntries_Email"" ON ""QuizEntries"" (""Email"");
            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_QuizEntries_ClientSubmissionId"" ON ""QuizEntries"" (""ClientSubmissionId"") WHERE ""ClientSubmissionId"" IS NOT NULL;

            ALTER TABLE IF EXISTS ""QuizEntries"" ADD COLUMN IF NOT EXISTS ""ClientSubmissionId"" text;
            ALTER TABLE IF EXISTS ""QuizEntries"" ADD COLUMN IF NOT EXISTS ""City"" text;
            ALTER TABLE IF EXISTS ""QuizEntries"" ADD COLUMN IF NOT EXISTS ""TotalQuestions"" integer NOT NULL DEFAULT 0;
            ALTER TABLE IF EXISTS ""QuizEntries"" ADD COLUMN IF NOT EXISTS ""TimeTakenSeconds"" integer NOT NULL DEFAULT 0;
            ALTER TABLE IF EXISTS ""QuizEntries"" ADD COLUMN IF NOT EXISTS ""SubmittedAt"" timestamp with time zone NOT NULL DEFAULT NOW();

            CREATE TABLE IF NOT EXISTS ""FanCreations"" (
                ""Id"" serial NOT NULL,
                ""Title"" text NOT NULL,
                ""CreatorName"" text NOT NULL DEFAULT '',
                ""Type"" text NOT NULL,
                ""Description"" text NULL,
                ""ImageUrl"" text NOT NULL,
                ""MediaUrl"" text NULL,
                ""DateLabel"" text NULL,
                ""Platform"" text NULL,
                ""IsFeatured"" boolean NOT NULL DEFAULT FALSE,
                CONSTRAINT ""PK_FanCreations"" PRIMARY KEY (""Id"")
            );

            CREATE INDEX IF NOT EXISTS ""IX_FanCreations_Type"" ON ""FanCreations"" (""Type"");

            ALTER TABLE IF EXISTS ""FanCreations"" ADD COLUMN IF NOT EXISTS ""CreatorName"" text NOT NULL DEFAULT '';
            ALTER TABLE IF EXISTS ""FanCreations"" ADD COLUMN IF NOT EXISTS ""Description"" text;
            ALTER TABLE IF EXISTS ""FanCreations"" ADD COLUMN IF NOT EXISTS ""MediaUrl"" text;
            ALTER TABLE IF EXISTS ""FanCreations"" ADD COLUMN IF NOT EXISTS ""DateLabel"" text;
            ALTER TABLE IF EXISTS ""FanCreations"" ADD COLUMN IF NOT EXISTS ""Platform"" text;
            ALTER TABLE IF EXISTS ""FanCreations"" ADD COLUMN IF NOT EXISTS ""IsFeatured"" boolean NOT NULL DEFAULT FALSE;
        ");

        Execute(context, logger, "visitor schema", @"
            CREATE TABLE IF NOT EXISTS ""VisitorEntries"" (
                ""Id"" serial NOT NULL,
                ""ClientVisitorId"" text NOT NULL,
                ""Name"" text NOT NULL,
                ""SocialMediaId"" text NULL,
                ""Source"" text NULL,
                ""UserAgent"" text NULL,
                ""IpAddress"" text NULL,
                ""FirstCompletedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                ""LastCompletedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT ""PK_VisitorEntries"" PRIMARY KEY (""Id"")
            );

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_VisitorEntries_ClientVisitorId"" ON ""VisitorEntries"" (""ClientVisitorId"");

            ALTER TABLE IF EXISTS ""VisitorEntries"" ADD COLUMN IF NOT EXISTS ""SocialMediaId"" text;
            ALTER TABLE IF EXISTS ""VisitorEntries"" ADD COLUMN IF NOT EXISTS ""Source"" text;
            ALTER TABLE IF EXISTS ""VisitorEntries"" ADD COLUMN IF NOT EXISTS ""UserAgent"" text;
            ALTER TABLE IF EXISTS ""VisitorEntries"" ADD COLUMN IF NOT EXISTS ""IpAddress"" text;
            ALTER TABLE IF EXISTS ""VisitorEntries"" ADD COLUMN IF NOT EXISTS ""FirstCompletedAt"" timestamp with time zone NOT NULL DEFAULT NOW();
            ALTER TABLE IF EXISTS ""VisitorEntries"" ADD COLUMN IF NOT EXISTS ""LastCompletedAt"" timestamp with time zone NOT NULL DEFAULT NOW();
        ");

        Execute(context, logger, "fan wall and poll schema", @"
            CREATE TABLE IF NOT EXISTS ""FanWallMessages"" (
                ""Id"" serial NOT NULL,
                ""ClientSubmissionId"" text NULL,
                ""Name"" text NOT NULL,
                ""City"" text NULL,
                ""Message"" text NOT NULL,
                ""Status"" text NOT NULL DEFAULT 'Pending',
                ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT ""PK_FanWallMessages"" PRIMARY KEY (""Id"")
            );

            CREATE INDEX IF NOT EXISTS ""IX_FanWallMessages_Status"" ON ""FanWallMessages"" (""Status"");
            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_FanWallMessages_ClientSubmissionId"" ON ""FanWallMessages"" (""ClientSubmissionId"") WHERE ""ClientSubmissionId"" IS NOT NULL;

            ALTER TABLE IF EXISTS ""FanWallMessages"" ADD COLUMN IF NOT EXISTS ""ClientSubmissionId"" text;
            ALTER TABLE IF EXISTS ""FanWallMessages"" ADD COLUMN IF NOT EXISTS ""City"" text;
            ALTER TABLE IF EXISTS ""FanWallMessages"" ADD COLUMN IF NOT EXISTS ""Status"" text NOT NULL DEFAULT 'Pending';
            ALTER TABLE IF EXISTS ""FanWallMessages"" ADD COLUMN IF NOT EXISTS ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT NOW();

            CREATE TABLE IF NOT EXISTS ""FanPollVotes"" (
                ""Id"" serial NOT NULL,
                ""PollKey"" text NOT NULL,
                ""OptionKey"" text NOT NULL,
                ""ClientId"" text NOT NULL,
                ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT ""PK_FanPollVotes"" PRIMARY KEY (""Id"")
            );

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_FanPollVotes_PollKey_ClientId"" ON ""FanPollVotes"" (""PollKey"", ""ClientId"");
            CREATE INDEX IF NOT EXISTS ""IX_FanPollVotes_PollKey"" ON ""FanPollVotes"" (""PollKey"");

            ALTER TABLE IF EXISTS ""FanPollVotes"" ADD COLUMN IF NOT EXISTS ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT NOW();
        ");
    }

    private static void Execute(AppDbContext context, ILogger logger, string operation, string sql)
    {
        try
        {
            context.Database.ExecuteSqlRaw(sql);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Database schema bootstrap failed while applying {Operation}.", operation);
            throw;
        }
    }
}
