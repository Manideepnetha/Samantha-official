using System.Text.Json;
using Samantha.API.Models;

namespace Samantha.API.Data;

public static class FrontendContentSync
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static object EnsureSeeded(AppDbContext context)
    {
        return Synchronize(context, overwritePageContent: false, overwritePhilanthropyDefaults: false);
    }

    public static object ForceRefresh(AppDbContext context)
    {
        return Synchronize(context, overwritePageContent: true, overwritePhilanthropyDefaults: true);
    }

    public static bool TryGetDefaultPageContent(string key, out string description, out string contentJson)
    {
        switch ((key ?? string.Empty).Trim().ToLowerInvariant())
        {
            case "about-page":
                description = "About page content synced from the frontend defaults.";
                contentJson = Serialize(GetAboutPageContent());
                return true;

            case "contact-page":
                description = "Contact page content synced from the frontend defaults.";
                contentJson = Serialize(GetContactPageContent());
                return true;

            case "home-page":
                description = "Home page editorial content synced from the frontend defaults.";
                contentJson = Serialize(GetHomePageContent());
                return true;

            case "philanthropy-page":
                description = "Philanthropy page hero and mission content synced from the frontend defaults.";
                contentJson = Serialize(GetPhilanthropyPageContent());
                return true;

            default:
                description = string.Empty;
                contentJson = string.Empty;
                return false;
        }
    }

    private static object Synchronize(AppDbContext context, bool overwritePageContent, bool overwritePhilanthropyDefaults)
    {
        SeedMovies.Initialize(context);
        SeedAwards.Initialize(context);
        SeedPhilanthropy.Initialize(context);
        SeedHome.Initialize(context);
        SeedFashion.Initialize(context);
        var shouldSyncDefaultGallery = ShouldSyncDefaultGallery(context);
        var galleryCollectionsSynced = 0;
        var galleryImagesBackfilled = 0;

        if (shouldSyncDefaultGallery)
        {
            SeedGallery.Initialize(context);
            galleryCollectionsSynced = UpsertGalleryCollectionDefaults(context, overwritePageContent);
            galleryImagesBackfilled = BackfillGalleryCollectionData(context);
        }

        var pageContentKeys = new List<string>();
        var pageContentBlocksSynced = 0;

        pageContentBlocksSynced += UpsertPageContent(
            context,
            "about-page",
            "About page content synced from the frontend defaults.",
            Serialize(GetAboutPageContent()),
            overwritePageContent,
            pageContentKeys
        );

        pageContentBlocksSynced += UpsertPageContent(
            context,
            "contact-page",
            "Contact page content synced from the frontend defaults.",
            Serialize(GetContactPageContent()),
            overwritePageContent,
            pageContentKeys
        );

        pageContentBlocksSynced += UpsertPageContent(
            context,
            "home-page",
            "Home page editorial content synced from the frontend defaults.",
            Serialize(GetHomePageContent()),
            overwritePageContent,
            pageContentKeys
        );

        pageContentBlocksSynced += UpsertPageContent(
            context,
            "philanthropy-page",
            "Philanthropy page hero and mission content synced from the frontend defaults.",
            Serialize(GetPhilanthropyPageContent()),
            overwritePageContent,
            pageContentKeys
        );

        var philanthropyRecordsSynced = UpsertPhilanthropyDefaults(context, overwritePhilanthropyDefaults);
        var fanCreationsSynced = UpsertFanCreationDefaults(context, overwritePageContent);
        var fanWallMessagesSynced = UpsertFanWallDefaults(context, overwritePageContent);

        context.SaveChanges();

        return new
        {
            syncedAtUtc = DateTime.UtcNow,
            pageContentBlocksSynced,
            philanthropyRecordsSynced,
            fanCreationsSynced,
            fanWallMessagesSynced,
            galleryCollectionsSynced,
            galleryImagesBackfilled,
            pageContentKeys
        };
    }

    private static int UpsertPageContent(
        AppDbContext context,
        string key,
        string description,
        string contentJson,
        bool overwrite,
        List<string> keys
    )
    {
        var existing = context.PageContents.FirstOrDefault(item => item.Key == key);
        if (existing == null)
        {
            context.PageContents.Add(new PageContent
            {
                Key = key,
                Description = description,
                ContentJson = contentJson,
                UpdatedAt = DateTime.UtcNow
            });
            keys.Add(key);
            return 1;
        }

        if (!overwrite)
        {
            return 0;
        }

        existing.Description = description;
        existing.ContentJson = contentJson;
        existing.UpdatedAt = DateTime.UtcNow;
        keys.Add(key);
        return 1;
    }

    private static int UpsertPhilanthropyDefaults(AppDbContext context, bool overwrite)
    {
        var defaults = new List<Philanthropy>
        {
            new() { Title = "Critical Surgeries Supported", Value = 150, Icon = "Care", Type = "Stat" },
            new() { Title = "Children Supported Through Shelter Partnership", Value = 28, Icon = "Kids", Type = "Stat" },
            new() { Title = "Foundation Established", Value = 2014, Icon = "Heart", Type = "Stat" },
            new()
            {
                Title = "Medical Aid",
                Description = "Fund critical surgeries, treatments, and ongoing care for underprivileged children and women.",
                Icon = "Care",
                Type = "Initiative"
            },
            new()
            {
                Title = "Menstrual Dignity",
                Description = "Promote menstrual health awareness and distribute sanitary kits through the End Period Poverty campaign.",
                Icon = "Rise",
                Type = "Initiative"
            },
            new()
            {
                Title = "Emergency Relief",
                Description = "Provide immediate support to families in crisis, including hospitalisation, medication, and rehabilitation.",
                Icon = "Reach",
                Type = "Initiative"
            },
            new()
            {
                Title = "Vaccination Drives",
                Description = "Organise seasonal and need-based vaccination camps for vulnerable communities.",
                Icon = "Aid",
                Type = "Initiative"
            },
            new()
            {
                Title = "Wish Come True",
                Description = "Fulfil heartfelt wishes for children in NGOs, shelters, and underserved communities.",
                Icon = "Heart",
                Type = "Initiative"
            },
            new()
            {
                Title = "Long-term Care Support",
                Description = "Assist orphanages, shelters, and survivor homes with essentials, education aid, and health support.",
                Icon = "Kids",
                Type = "Initiative"
            },
            new()
            {
                Title = "Health Equity Awareness",
                Description = "Raise awareness about the right to affordable, dignified healthcare for all, especially for women and children.",
                Icon = "Reach",
                Type = "Initiative"
            },
            new()
            {
                Title = "Historic patient-support record",
                Description = "Archived official Pratyusha Support pages publicly listed individual treatment cases across partner hospitals, reinforcing that the medical-aid mission has long been case-based and family-centred.",
                ImageUrl = "/assets/images/philanthropy/pratyusha-hero.png",
                Type = "Story"
            },
            new()
            {
                Title = "Wish Come True in public record",
                Description = "A public 2014 report documented Pratyusha Support arranging a Ram Charan meeting for a child from Desire Society, illustrating the foundation's wish-fulfilment work beyond direct treatment support.",
                ImageUrl = "/assets/images/philanthropy/samantha-pratyusha.png",
                Type = "Story"
            },
            new()
            {
                Title = "Preventive and community-health footprint",
                Description = "Legacy official records reference blood donation camps, cervical cancer vaccination activity, hemophilia-related outreach, and celebrations with child-care institutions such as Sphoorti Foundation.",
                ImageUrl = "/assets/images/philanthropy/seshanka-binesh.png",
                Type = "Story"
            }
        };

        if (overwrite)
        {
            var existing = context.Philanthropies.ToList();
            if (existing.Count > 0)
            {
                context.Philanthropies.RemoveRange(existing);
                context.SaveChanges();
            }

            foreach (var item in defaults)
            {
                context.Philanthropies.Add(new Philanthropy
                {
                    Title = item.Title,
                    Description = item.Description,
                    Type = item.Type,
                    Value = item.Value,
                    ImageUrl = item.ImageUrl,
                    Icon = item.Icon
                });
            }

            return defaults.Count;
        }

        var changes = 0;

        foreach (var item in defaults)
        {
            var existing = context.Philanthropies.FirstOrDefault(p => p.Title == item.Title && p.Type == item.Type);
            if (existing == null)
            {
                context.Philanthropies.Add(new Philanthropy
                {
                    Title = item.Title,
                    Description = item.Description,
                    Type = item.Type,
                    Value = item.Value,
                    ImageUrl = item.ImageUrl,
                    Icon = item.Icon
                });
                changes++;
                continue;
            }

            if (!overwrite)
            {
                continue;
            }

            existing.Description = item.Description;
            existing.Value = item.Value;
            existing.ImageUrl = item.ImageUrl;
            existing.Icon = item.Icon;
            changes++;
        }

        return changes;
    }

    private static int UpsertFanCreationDefaults(AppDbContext context, bool overwrite)
    {
        var defaults = new List<FanCreation>
        {
            new()
            {
                Title = "Celestial Bloom Poster",
                CreatorName = "Community Spotlight",
                Type = "Poster",
                Description = "A layered tribute poster built with warm metallic tones and a dramatic studio finish.",
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg",
                MediaUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg",
                DateLabel = "Featured Submission",
                Platform = "Poster Art",
                IsFeatured = true
            },
            new()
            {
                Title = "Stage Light Tribute",
                CreatorName = "Community Spotlight",
                Type = "Poster",
                Description = "A fan-made print concept imagined as a premium theatrical campaign key visual.",
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg",
                MediaUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg",
                DateLabel = "Poster Drop",
                Platform = "Poster Art",
                IsFeatured = false
            },
            new()
            {
                Title = "Honey Bunny Motion Tribute",
                CreatorName = "Community Spotlight",
                Type = "Video",
                Description = "A sharp-cut fan edit concept celebrating Samantha's streaming-era action presence.",
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg",
                MediaUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                DateLabel = "Video Edit",
                Platform = "YouTube",
                IsFeatured = true
            },
            new()
            {
                Title = "Retro Reel Remix",
                CreatorName = "Community Spotlight",
                Type = "Video",
                Description = "A mood-driven tribute reel designed for social-first fan communities.",
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg",
                MediaUrl = "https://www.instagram.com/",
                DateLabel = "Social Edit",
                Platform = "Instagram",
                IsFeatured = false
            },
            new()
            {
                Title = "Ink & Gold Illustration",
                CreatorName = "Community Spotlight",
                Type = "Illustration",
                Description = "A stylized portrait concept that treats Samantha like a magazine-cover icon in mixed media.",
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg",
                MediaUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg",
                DateLabel = "Illustration Art",
                Platform = "Digital Illustration",
                IsFeatured = true
            },
            new()
            {
                Title = "Midnight Frame Sketch",
                CreatorName = "Community Spotlight",
                Type = "Illustration",
                Description = "A monochrome fan illustration composed as a dramatic editorial portrait.",
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg",
                MediaUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg",
                DateLabel = "Illustration Art",
                Platform = "Digital Illustration",
                IsFeatured = false
            }
        };

        var changes = 0;

        foreach (var item in defaults)
        {
            var existing = context.FanCreations.FirstOrDefault(fanCreation =>
                fanCreation.Title == item.Title && fanCreation.Type == item.Type);

            if (existing == null)
            {
                context.FanCreations.Add(new FanCreation
                {
                    Title = item.Title,
                    CreatorName = item.CreatorName,
                    Type = item.Type,
                    Description = item.Description,
                    ImageUrl = item.ImageUrl,
                    MediaUrl = item.MediaUrl,
                    DateLabel = item.DateLabel,
                    Platform = item.Platform,
                    IsFeatured = item.IsFeatured
                });
                changes++;
                continue;
            }

            if (!overwrite)
            {
                continue;
            }

            existing.CreatorName = item.CreatorName;
            existing.Description = item.Description;
            existing.ImageUrl = item.ImageUrl;
            existing.MediaUrl = item.MediaUrl;
            existing.DateLabel = item.DateLabel;
            existing.Platform = item.Platform;
            existing.IsFeatured = item.IsFeatured;
            changes++;
        }

        return changes;
    }

    private static int UpsertFanWallDefaults(AppDbContext context, bool overwrite)
    {
        var defaults = new List<FanWallMessage>
        {
            new()
            {
                Name = "Nitya",
                City = "Hyderabad",
                Message = "You make strength look graceful. Wishing you more stories that feel fearless and personal.",
                Status = "Approved"
            },
            new()
            {
                Name = "Arjun",
                City = "Chennai",
                Message = "From screen presence to real-life resilience, your journey keeps inspiring fans like me every year.",
                Status = "Approved"
            },
            new()
            {
                Name = "Maya",
                City = "Bengaluru",
                Message = "Thank you for choosing honesty, growth, and performances that stay with us long after the credits roll.",
                Status = "Approved"
            }
        };

        var changes = 0;

        foreach (var item in defaults)
        {
            var existing = context.FanWallMessages.FirstOrDefault(message =>
                message.Name == item.Name && message.Message == item.Message);

            if (existing == null)
            {
                context.FanWallMessages.Add(new FanWallMessage
                {
                    Name = item.Name,
                    City = item.City,
                    Message = item.Message,
                    Status = item.Status,
                    CreatedAt = DateTime.UtcNow
                });
                changes++;
                continue;
            }

            if (!overwrite)
            {
                continue;
            }

            existing.City = item.City;
            existing.Status = item.Status;
            changes++;
        }

        return changes;
    }

    private static int UpsertGalleryCollectionDefaults(AppDbContext context, bool overwrite)
    {
        var defaults = new List<GalleryCollection>
        {
            new()
            {
                Key = "fashion-editorials",
                Title = "Fashion Editorials",
                Subtitle = "Minimal silhouettes and statement styling",
                Description = "A polished runway of Samantha's editorial looks, designed to feel deliberate, spacious, and cinematic.",
                Category = "fashion",
                CoverImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748298223/d5wj1d4ydqe61_fr3adf.jpg",
                AccentTone = "#d0a05a",
                SortOrder = 1
            },
            new()
            {
                Key = "event-highlights",
                Title = "Event Highlights",
                Subtitle = "Appearances, arrivals, and public moments",
                Description = "A brighter set of red-carpet and event photography arranged as a clean social reel.",
                Category = "events",
                CoverImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295435/5_6185746542628962569_bgalhv.jpg",
                AccentTone = "#b87050",
                SortOrder = 2
            },
            new()
            {
                Key = "cover-shoots",
                Title = "Cover Shoots",
                Subtitle = "Magazine-ready frames",
                Description = "A showcase of polished portrait and cover-shoot images where layout and pacing matter as much as the still itself.",
                Category = "photoshoots",
                CoverImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg",
                AccentTone = "#d3b598",
                SortOrder = 3
            },
            new()
            {
                Key = "film-frames",
                Title = "Film Frames",
                Subtitle = "Projects, production stills, and screen presence",
                Description = "A contained look at project imagery with a stronger editorial emphasis on composition and cinematic texture.",
                Category = "films",
                CoverImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg",
                AccentTone = "#69808f",
                SortOrder = 4
            },
            new()
            {
                Key = "behind-the-scenes",
                Title = "Behind The Scenes",
                Subtitle = "Candid process and atmosphere",
                Description = "Production energy, in-between moments, and process-driven stills collected as one softer, documentary-like layer.",
                Category = "bts",
                CoverImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296881/53885681037_6a705301cf_o_ztjyeg.jpg",
                AccentTone = "#7a7f68",
                SortOrder = 5
            }
        };

        var changes = 0;

        foreach (var item in defaults)
        {
            var existing = context.GalleryCollections.FirstOrDefault(collection => collection.Key == item.Key);
            if (existing == null)
            {
                context.GalleryCollections.Add(new GalleryCollection
                {
                    Key = item.Key,
                    Title = item.Title,
                    Subtitle = item.Subtitle,
                    Description = item.Description,
                    Category = item.Category,
                    CoverImageUrl = item.CoverImageUrl,
                    AccentTone = item.AccentTone,
                    SortOrder = item.SortOrder
                });
                changes++;
                continue;
            }

            if (!overwrite)
            {
                continue;
            }

            existing.Title = item.Title;
            existing.Subtitle = item.Subtitle;
            existing.Description = item.Description;
            existing.Category = item.Category;
            existing.CoverImageUrl = item.CoverImageUrl;
            existing.AccentTone = item.AccentTone;
            existing.SortOrder = item.SortOrder;
            changes++;
        }

        return changes;
    }

    private static int BackfillGalleryCollectionData(AppDbContext context)
    {
        var changes = 0;

        foreach (var item in context.MediaGalleries)
        {
            var (collectionKey, displayOrder) = item.Type switch
            {
                "fashion" => ("fashion-editorials", item.DisplayOrder == 0 ? 1 : item.DisplayOrder),
                "events" => ("event-highlights", item.DisplayOrder == 0 ? 1 : item.DisplayOrder),
                "photoshoots" => ("cover-shoots", item.DisplayOrder == 0 ? 1 : item.DisplayOrder),
                "films" => ("film-frames", item.DisplayOrder == 0 ? 1 : item.DisplayOrder),
                "bts" => ("behind-the-scenes", item.DisplayOrder == 0 ? 1 : item.DisplayOrder),
                _ => (string.Empty, item.DisplayOrder)
            };

            if (string.IsNullOrWhiteSpace(item.CollectionKey) && !string.IsNullOrWhiteSpace(collectionKey))
            {
                item.CollectionKey = collectionKey;
                changes++;
            }

            if (item.DisplayOrder != displayOrder)
            {
                item.DisplayOrder = displayOrder;
                changes++;
            }
        }

        return changes;
    }

    private static bool ShouldSyncDefaultGallery(AppDbContext context)
    {
        var defaultGalleryKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "fashion-editorials",
            "event-highlights",
            "cover-shoots",
            "film-frames",
            "behind-the-scenes"
        };

        var hasCustomCollections = context.GalleryCollections.Any(collection => !defaultGalleryKeys.Contains(collection.Key));
        if (hasCustomCollections)
        {
            return false;
        }

        var hasCustomMedia = context.MediaGalleries.Any(item =>
            item.Type != "Home"
            && !string.IsNullOrWhiteSpace(item.CollectionKey)
            && !defaultGalleryKeys.Contains(item.CollectionKey));

        return !hasCustomMedia;
    }

    private static string Serialize(object value)
    {
        return JsonSerializer.Serialize(value, JsonOptions);
    }

    private static object GetAboutPageContent()
    {
        return new
        {
            heroImage = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg",
            heroAlt = "Samantha Ruth Prabhu Portrait",
            heroTitle = "Samantha Ruth Prabhu",
            heroSubtitle = "Actor, producer, entrepreneur, and founder of Pratyusha Support.",
            portraitImage = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg",
            portraitAlt = "Samantha Ruth Prabhu",
            glanceTitle = "At a Glance",
            glanceItems = new[]
            {
                new { label = "Full Name", value = "Samantha Ruth Prabhu" },
                new { label = "Born", value = "28 April 1987" },
                new { label = "Birthplace", value = "Chennai, Tamil Nadu, India" },
                new { label = "Languages", value = "Tamil, Telugu, English" },
                new { label = "Acting Debut", value = "Ye Maaya Chesave (2010)" },
                new { label = "Major Honours", value = "4 Filmfare Awards South, 2 Nandi Awards" }
            },
            sections = new[]
            {
                new
                {
                    title = "Overview",
                    paragraphs = new[]
                    {
                        "Samantha Ruth Prabhu is an Indian actress who works predominantly in Telugu and Tamil films. Since her screen debut in 2010, she has built a career that spans theatrical films, streaming series, entrepreneurship, philanthropy, and film production."
                    }
                },
                new
                {
                    title = "Early Life & Education",
                    paragraphs = new[]
                    {
                        "Born to Joseph Prabhu and Ninette, Samantha grew up in the Pallavaram neighbourhood of Chennai. She studied at Holy Angels Anglo Indian Higher Secondary School and later completed a degree in commerce at Stella Maris College.",
                        "Near the end of college, she began taking up modelling assignments, including work for Naidu Hall. That phase opened the door to screen opportunities and led to her entry into films."
                    }
                },
                new
                {
                    title = "Rise to Prominence",
                    paragraphs = new[]
                    {
                        "Samantha began her acting career with Gautham Menon's Telugu romance \"Ye Maaya Chesave\" (2010), in which she played Jessie. The performance earned her the Filmfare Award for Best Female Debut - South and a Nandi Special Jury Award.",
                        "In 2012, she became only the second actress to win Filmfare's Best Actress awards in both Tamil and Telugu in the same year, for \"Neethaane En Ponvasantham\" and \"Eega\". Over the next decade, she balanced major commercial successes with acclaimed performances in films such as \"Attarintiki Daredi\", \"Theri\", \"Rangasthalam\", \"Mahanati\", \"Oh! Baby\", \"Super Deluxe\", and \"Majili\"."
                    }
                },
                new
                {
                    title = "Breaking New Ground",
                    paragraphs = new[]
                    {
                        "Samantha made her streaming debut in \"The Family Man 2\" (2021), where she played Raji, a skilled operative with a complex past tied to the Sri Lankan conflict. The role widened her audience beyond theatrical cinema and earned her a Filmfare OTT Award."
                    }
                },
                new
                {
                    title = "Beyond Cinema",
                    paragraphs = new[]
                    {
                        "Beyond acting, Samantha founded Pratyusha Support in 2014. According to the organisation's official website, it focuses on medical care, menstrual dignity, and crisis support for women and children in need.",
                        "She has also expanded into entrepreneurship through the fashion label Saaki, which she co-created as a separate venture outside her film work."
                    }
                },
                new
                {
                    title = "Personal Journey & Resilience",
                    paragraphs = new[]
                    {
                        "In 2022, Samantha publicly revealed that she had been diagnosed with myositis, an autoimmune condition. She later spoke about that period in interviews and on social media, making health and recovery a visible part of her public life.",
                        "In 2024, she launched \"Take 20\", a health-focused podcast, presenting it as a way to share accessible wellness conversations shaped by her own experience."
                    }
                },
                new
                {
                    title = "Legacy in the Making",
                    paragraphs = new[]
                    {
                        "By the mid-2020s, Samantha's career had expanded across film, streaming, fashion, philanthropy, and production. In 2024, she starred in \"Citadel: Honey Bunny\", and in 2025, she made her producer debut with \"Subham\" under her banner Tralala Moving Pictures.",
                        "That blend of mainstream success and self-directed work now defines the next phase of her career."
                    }
                }
            },
            quote = new
            {
                text = "Accepting this vulnerability is something I am still struggling with.",
                author = "Samantha Ruth Prabhu, Instagram (2022)"
            },
            milestonesHeading = new
            {
                kicker = "Career Highlights",
                title = "Milestones Through the Years",
                description = "Key turning points across Samantha's artistic, philanthropic, and entrepreneurial journey."
            },
            milestones = new[]
            {
                new { year = "2010", title = "Early Career & Breakthrough", description = "Made her acting debut in Ye Maaya Chesave and won the Filmfare Award for Best Female Debut - South along with a Nandi Special Jury Award.", wide = false },
                new { year = "2012", title = "Rise to Prominence", description = "Won Filmfare Best Actress - Telugu for Eega and Best Actress - Tamil for Neethaane En Ponvasantham in the same year.", wide = false },
                new { year = "2014", title = "Philanthropy", description = "Founded Pratyusha Support, a non-profit focused on medical care and crisis support for women and children.", wide = false },
                new { year = "2013-2019", title = "Leading Actress & Critical Acclaim", description = "Balanced commercial hits such as Attarintiki Daredi, Theri, and Rangasthalam with acclaimed roles in Mahanati, Oh! Baby, Super Deluxe, and Majili.", wide = false },
                new { year = "2021", title = "Pan-India Recognition", description = "Made her streaming debut in The Family Man 2, earned a Filmfare OTT Award, and expanded her reach beyond theatrical cinema.", wide = false },
                new { year = "2024-2025", title = "Producer, Podcaster & Streaming Lead", description = "Launched the health podcast Take 20, starred in Citadel: Honey Bunny, and made her producer debut with Subham under Tralala Moving Pictures.", wide = true }
            }
        };
    }

    private static object GetContactPageContent()
    {
        return new
        {
            heroImage = "https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            heroAlt = "Contact",
            heroTitle = "Get In Touch",
            heroSubtitle = "Reach out to Samantha's team for inquiries, collaborations, and more.",
            tabs = new[]
            {
                new { id = "fans", label = "Fan Inquiries" },
                new { id = "media", label = "Media Requests" },
                new { id = "business", label = "Business Inquiries" }
            },
            directContactsHeading = new
            {
                kicker = "Direct Contacts",
                title = "Reach the Right Team",
                description = "Management, media, and business channels remain available exactly as before, now presented in the same premium theme."
            },
            directContacts = new[]
            {
                new
                {
                    title = "Management",
                    description = "For official management inquiries only",
                    email = "management@samantharuthprabhu.com",
                    icon = "management"
                },
                new
                {
                    title = "Press & Media",
                    description = "For media requests and press information",
                    email = "press@samantharuthprabhu.com",
                    icon = "press"
                },
                new
                {
                    title = "Business Inquiries",
                    description = "For endorsements and business proposals",
                    email = "business@samantharuthprabhu.com",
                    icon = "business"
                }
            }
        };
    }

    private static object GetHomePageContent()
    {
        return new
        {
            performanceRange = "2010 - 2024",
            instagramSpotlight = new
            {
                title = "Follow Samantha on Instagram",
                description = "Official updates, backstage glimpses, wellness notes, and campaign highlights at @samantharuthprabhuoffl.",
                handle = "@samantharuthprabhuoffl",
                href = "https://instagram.com/samantharuthprabhuoffl",
                image = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg",
                imageAlt = "Samantha Ruth Prabhu Instagram spotlight portrait"
            },
            featureShowcaseImage = new
            {
                url = "https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/key-aspects/c3f30b347a3440389e017af2b6316a11.jpg",
                alt = "Samantha Ruth Prabhu editorial feature portrait",
                caption = "A cinematic portrait layer inspired by the reference design."
            },
            performanceLayers = new[]
            {
                new
                {
                    year = "2010",
                    title = "Ye Maaya Chesave",
                    meta = "Romantic Drama | Feature Film",
                    role = "Jessie",
                    description = "Samantha made her lead-screen debut as Jessie, a Malayali Christian woman in Hyderabad whose romance with Karthik drives the film.",
                    highlights = new[]
                    {
                        "Her 2010 debut role introduced her as a leading actor in Telugu cinema.",
                        "Wikipedia credits the performance with winning the Filmfare Award for Best Female Debut - South.",
                        "The same debut also earned her a Nandi Special Jury Award."
                    },
                    image = "https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/b37d3bada8f7461e85b3e81293dec89d.JPG",
                    imageAlt = "Samantha Ruth Prabhu portrait for Ye Maaya Chesave feature",
                    imagePosition = "center 14%"
                },
                new
                {
                    year = "2012",
                    title = "Eega",
                    meta = "Fantasy Action | Feature Film",
                    role = "Bindu",
                    description = "As Bindu, a micro artist who runs an NGO, she anchors the emotional core of a revenge fantasy built around a reincarnated fly.",
                    highlights = new[]
                    {
                        "Eega won National Film Awards for Best Feature Film in Telugu and Best Special Effects.",
                        "Samantha won the Filmfare Award for Best Actress - Telugu for this performance.",
                        "Wikipedia lists the film among the year's biggest Telugu box-office successes."
                    },
                    image = "https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/22104b3ab4264f048de0e15b5e0ed21d.jpg",
                    imageAlt = "Samantha Ruth Prabhu editorial image for Eega feature",
                    imagePosition = "center 18%"
                },
                new
                {
                    year = "2018",
                    title = "Mahanati",
                    meta = "Biographical Drama | Feature Film",
                    role = "Madhuravani",
                    description = "She plays journalist Madhuravani, the character whose reporting frames the rise, stardom, and tragedy of screen legend Savitri.",
                    highlights = new[]
                    {
                        "Wikipedia says the story is viewed through Madhuravani and photographer Vijay Anthony.",
                        "Mahanati won the National Film Award for Best Feature Film in Telugu.",
                        "The film was screened at festivals including IFFI, Shanghai, and Melbourne."
                    },
                    image = "https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/5abe0c872cc0487bbceec7ff840114d6.jpg",
                    imageAlt = "Samantha Ruth Prabhu portrait for Mahanati feature",
                    imagePosition = "center 10%"
                },
                new
                {
                    year = "2019",
                    title = "Oh! Baby",
                    meta = "Fantasy Comedy | Feature Film",
                    role = "Young Savithri / Swathi",
                    description = "In a playful yet emotional fantasy, Samantha appears as young Savithri alias Swathi after a woman in her seventies suddenly regains her 24-year-old body.",
                    highlights = new[]
                    {
                        "Wikipedia lists Samantha as the winner of Critics Choice Best Actor - Female for the film.",
                        "The page also records Best Actress wins for her at SIIMA and Zee Cine Awards Telugu.",
                        "The story follows a grandmother rediscovering youth, music, and family from a fresh perspective."
                    },
                    image = "https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/57f947a993f34f75883d6e828f6a83e1.jpg",
                    imageAlt = "Samantha Ruth Prabhu portrait for Oh Baby feature",
                    imagePosition = "center 22%"
                },
                new
                {
                    year = "2021",
                    title = "The Family Man 2",
                    meta = "Spy Thriller | Streaming Series",
                    role = "Raji",
                    description = "Her digital breakout cast her as Raji, a formidable figure in Raj & DK's espionage drama, bringing a harder action edge to her screen image.",
                    highlights = new[]
                    {
                        "Samantha's Wikipedia career page says the performance earned her a Filmfare OTT Award.",
                        "The role marked her digital debut on streaming.",
                        "Indian Express reported that the show also became her first major action turn, with Samantha performing her own stunts."
                    },
                    image = "https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/e39a3cc4cc1a4b9caf934ebe54eb5b57.png",
                    imageAlt = "Samantha Ruth Prabhu portrait for The Family Man 2 feature",
                    imagePosition = "center 18%"
                },
                new
                {
                    year = "2024",
                    title = "Citadel: Honey Bunny",
                    meta = "Action Drama | Streaming Series",
                    role = "Honey",
                    description = "In the Citadel universe, Samantha plays Honey, a struggling actress drawn into espionage whose past resurfaces while she fights to protect her daughter Nadia.",
                    highlights = new[]
                    {
                        "Prime Video describes Honey as being pulled into a world of action, espionage, and betrayal.",
                        "Samantha's Wikipedia page identifies Honey as Nadia Sinh's mother.",
                        "Wikipedia also notes that this was Samantha's only release of 2024."
                    },
                    image = "https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/b03898cf933341a29397bb9bb59ef499.jpg",
                    imageAlt = "Samantha Ruth Prabhu portrait for Citadel Honey Bunny feature",
                    imagePosition = "center 14%"
                }
            },
            keyFeatureCards = new[]
            {
                new
                {
                    title = "Award-Winning Range",
                    eyebrow = "Four Filmfare Awards South",
                    description = "Wikipedia lists four Filmfare Awards South, two Nandi Awards, and a Tamil Nadu State Film Award, including the rare feat of winning Best Actress in Tamil and Telugu in the same year.",
                    icon = "award"
                },
                new
                {
                    title = "Pan-South Screen Reach",
                    eyebrow = "Telugu, Tamil, and streaming audiences",
                    description = "Samantha works predominantly in Telugu and Tamil cinema and later expanded into streaming with The Family Man 2 and Citadel: Honey Bunny, broadening her audience across formats.",
                    icon = "screen"
                },
                new
                {
                    title = "Purpose Beyond Cinema",
                    eyebrow = "Pratyusha Support foundation",
                    description = "Wikipedia and the Pratyusha Support website describe her charitable work as a medical-support initiative focused on women and children, built to turn compassion into practical care.",
                    icon = "heart"
                },
                new
                {
                    title = "Creative Evolution",
                    eyebrow = "Digital lead to producer",
                    description = "Wikipedia notes that The Family Man 2 marked her digital debut and brought a Filmfare OTT Award, while Subham became her producer debut in 2025.",
                    icon = "spark"
                }
            }
        };
    }

    private static object GetPhilanthropyPageContent()
    {
        return new
        {
            heroImage = "/assets/images/philanthropy/pratyusha-hero.png",
            heroAlt = "Pratyusha Support official foundation artwork",
            heroTitle = "Pratyusha Support",
            heroSubtitle = "Verified public profile of Samantha Ruth Prabhu's social-impact work, centered on Pratyusha Support and separated clearly from her independent education ventures and older public outreach records.",
            missionKicker = "Official Scope",
            missionTitle = "Pratyusha Support remains the core verified foundation record",
            missionDescription = "Pratyusha Support publicly defines itself as a non-profit focused on restoring dignity, hope, and health to women and children in need, with emphasis on medical aid, menstrual dignity, emergency relief, vaccination drives, wish fulfilment, long-term care support, and health-equity awareness.",
            donateTitle = "Give With Love",
            donateDescription = "Support medical care for children in need through the foundation's official donation page.",
            donateLink = "https://pratyushasupport.org/donate/",
            donateCtaLabel = "Donate Now",
            volunteerTitle = "Join the Movement",
            volunteerDescription = "Volunteer your time to light the path toward better tomorrows through the foundation's official volunteer form.",
            volunteerLink = "https://pratyushasupport.org/volunteer/",
            volunteerCtaLabel = "Register as Volunteer"
        };
    }
}
