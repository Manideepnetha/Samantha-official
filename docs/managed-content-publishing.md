# Managed Content Publishing

`git push` deploys code. It does not copy your local PostgreSQL content to production.

Use the local publish tool when you want your admin-managed content to move from local to production.

## Required environment variables

- `PROD_DB_CONNECTION`
  - production PostgreSQL connection string

## Optional environment variables

- `LOCAL_DB_CONNECTION`
  - defaults to `Host=localhost;Database=samantha_db;Username=postgres;Password=postgres`
- `PROD_BACKUP_DIR`
  - folder for the automatic production backup created before publish

## Commands

Verify local vs production counts without changing production:

```powershell
npm run managed-content:verify
```

Publish local managed content to production:

```powershell
npm run sync:managed-content:prod
```

## What gets synced

- Projects
- Blogs
- Testimonials
- Movies
- Awards
- Philanthropies
- NewsArticles
- GalleryCollections
- MediaGalleries
- FashionItems
- SiteSettings
- PageContents
- FanCreations

## What does not get synced

- Users
- ContactMessages
- QuizEntries
- VisitorEntries
- FanWallMessages
- FanPollVotes

## Safety behavior

- `managed-content:verify` is read-only
- `sync:managed-content:prod` creates a production JSON backup before writing
- duplicate natural keys are reported so you can spot bad local data early
- `PageContents` are protected from stale overwrites: if production has a newer `UpdatedAt` than local, the publish tools skip that page-content update instead of rolling production back
- the old GitHub workflow is now validation-only because GitHub runners cannot access your actual local database
