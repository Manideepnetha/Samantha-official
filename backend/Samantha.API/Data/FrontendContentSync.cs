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

    private static object Synchronize(AppDbContext context, bool overwritePageContent, bool overwritePhilanthropyDefaults)
    {
        SeedMovies.Initialize(context);
        SeedAwards.Initialize(context);
        SeedPhilanthropy.Initialize(context);
        SeedHome.Initialize(context);
        SeedFashion.Initialize(context);
        SeedGallery.Initialize(context);
        var galleryCollectionsSynced = UpsertGalleryCollectionDefaults(context, overwritePageContent);
        var galleryImagesBackfilled = BackfillGalleryCollectionData(context);

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

        context.SaveChanges();

        return new
        {
            syncedAtUtc = DateTime.UtcNow,
            pageContentBlocksSynced,
            philanthropyRecordsSynced,
            fanCreationsSynced,
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
            new() { Title = "Lives Touched", Value = 10000, Icon = "Heart", Type = "Stat" },
            new() { Title = "Surgeries Funded", Value = 150, Icon = "Care", Type = "Stat" },
            new() { Title = "Health Camps", Value = 50, Icon = "Aid", Type = "Stat" },
            new()
            {
                Title = "Healthcare Support",
                Description = "Providing financial aid for critical medical treatments and surgeries for underprivileged children and women.",
                Icon = "Care",
                Type = "Initiative"
            },
            new()
            {
                Title = "Child Welfare",
                Description = "Ensuring proper nutrition, vaccination, and healthcare for infants and children.",
                Icon = "Kids",
                Type = "Initiative"
            },
            new()
            {
                Title = "Women Empowerment",
                Description = "Supporting skill development and vocational training to help women become financially independent.",
                Icon = "Rise",
                Type = "Initiative"
            },
            new()
            {
                Title = "Community Outreach",
                Description = "Organizing health camps and awareness drives in rural and underserved communities.",
                Icon = "Reach",
                Type = "Initiative"
            },
            new()
            {
                Title = "A New Lease on Life",
                Description = "Little Ananya was diagnosed with a congenital heart defect. Through the foundation, she received the life-saving surgery she needed and is now a healthy, active child.",
                ImageUrl = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                Type = "Story"
            },
            new()
            {
                Title = "Empowering Lakshmi",
                Description = "Lakshmi, a single mother, joined our tailoring vocational program. Today, she runs her own boutique and supports her family with dignity.",
                ImageUrl = "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                Type = "Story"
            }
        };

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
            heroTitle = "The Journey of Samantha",
            heroSubtitle = "An inspiring tale of passion, perseverance, and purpose.",
            portraitImage = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg",
            portraitAlt = "Samantha Ruth Prabhu",
            glanceTitle = "At a Glance",
            glanceItems = new[]
            {
                new { label = "Full Name", value = "Samantha Ruth Prabhu" },
                new { label = "Born", value = "April 28, 1987" },
                new { label = "Nationality", value = "Indian" },
                new { label = "Languages", value = "Tamil, Telugu, English, Hindi" },
                new { label = "Debut Film", value = "Ye Maaya Chesave (2010)" },
                new { label = "Notable Awards", value = "4 Filmfare Awards South" }
            },
            sections = new[]
            {
                new
                {
                    title = "Overview",
                    paragraphs = new[]
                    {
                        "Samantha Ruth Prabhu stands as one of Indian cinema's most versatile and acclaimed actresses, with a career spanning over a decade across Tamil and Telugu film industries. Born in Chennai to a Telugu father and a Malayali mother, Samantha's journey to stardom is a testament to her unwavering determination and exceptional talent."
                    }
                },
                new
                {
                    title = "Early Life & Education",
                    paragraphs = new[]
                    {
                        "Raised in Chennai, Samantha completed her schooling at Holy Angels Anglo Indian Higher Secondary School and pursued a degree in Commerce at Stella Maris College. Her entry into the entertainment industry began through modeling during her college days, where her natural presence in front of the camera caught the attention of filmmakers."
                    }
                },
                new
                {
                    title = "Rise to Prominence",
                    paragraphs = new[]
                    {
                        "Samantha's cinematic journey began with Gautham Menon's Telugu romantic drama \"Ye Maaya Chesave\" (2010), where her portrayal of Jessie, a complex character torn between love and family obligations, immediately established her as a performer of remarkable depth. This debut earned her the Filmfare Award for Best Female Debut - South, marking the beginning of an illustrious career.",
                        "What followed was a series of powerful performances across diverse genres - from the heartwrenching \"Eega\" (2012) to the socially conscious \"Mahanati\" (2018). Her versatility shone through in commercial blockbusters like \"Theri\" (2016) and critically acclaimed films such as \"Super Deluxe\" (2019). With each role, Samantha pushed boundaries and challenged herself, refusing to be typecast."
                    }
                },
                new
                {
                    title = "Breaking New Ground",
                    paragraphs = new[]
                    {
                        "Samantha's career took a revolutionary turn with her digital debut in \"The Family Man 2\" (2021), where she portrayed Raji, a Sri Lankan Tamil liberation fighter. This performance showcased her incredible range and commitment to her craft, earning unprecedented acclaim across India and internationally."
                    }
                },
                new
                {
                    title = "Beyond Cinema",
                    paragraphs = new[]
                    {
                        "While her on-screen presence continues to captivate audiences, Samantha's influence extends far beyond cinema. In 2012, she established the Pratyusha Foundation, focusing on providing medical support, education, and other essential services to underprivileged women and children.",
                        "As an entrepreneur, she launched her own fashion label, Saaki, which reflects her personal style philosophy of blending tradition with contemporary aesthetics. The brand embodies her commitment to sustainable fashion and ethical business practices."
                    }
                },
                new
                {
                    title = "Personal Journey & Resilience",
                    paragraphs = new[]
                    {
                        "In 2022, Samantha revealed her diagnosis with Myositis, an autoimmune condition. With characteristic courage, she has shared her health journey openly, becoming an inspiration for millions facing similar challenges. Her candor about personal struggles has redefined celebrity vulnerability in the Indian context.",
                        "Throughout personal and professional challenges, Samantha has maintained an unwavering commitment to her craft and her causes, emerging stronger with each chapter of her life."
                    }
                },
                new
                {
                    title = "Legacy in the Making",
                    paragraphs = new[]
                    {
                        "As she continues to evolve as an artist, activist, and entrepreneur, Samantha Ruth Prabhu's legacy is characterized by her refusal to conform to industry norms and her determination to use her platform for meaningful change. Her journey represents the changing face of Indian cinema - one that embraces authenticity, diversity, and social responsibility.",
                        "With upcoming international projects and growing global recognition, Samantha stands at the threshold of a new chapter that promises to further cement her position as one of India's most significant cultural ambassadors."
                    }
                }
            },
            quote = new
            {
                text = "I believe in constantly reinventing myself and never settling for what's comfortable. Growth happens outside your comfort zone.",
                author = "Samantha Ruth Prabhu"
            },
            milestonesHeading = new
            {
                kicker = "Career Highlights",
                title = "Milestones Through the Years",
                description = "Key turning points across Samantha's artistic, philanthropic, and entrepreneurial journey."
            },
            milestones = new[]
            {
                new { year = "2010", title = "Early Career & Breakthrough", description = "Made her film debut with Ye Maaya Chesave (Telugu) and Vinnaithaandi Varuvaayaa (Tamil). Her performance won her the Filmfare Award for Best Female Debut - South and a Nandi Award.", wide = false },
                new { year = "2012", title = "Rise to Prominence", description = "Starred in the critically acclaimed Eega (Best Actress - Telugu) and Neethaane En Ponvasantham (Best Actress - Tamil), winning top honors in both languages in the same year.", wide = false },
                new { year = "2014", title = "Philanthropy", description = "Founded the Pratyusha Support Foundation, providing medical support to underprivileged women and children.", wide = false },
                new { year = "2013-2019", title = "Leading Actress & Critical Acclaim", description = "Delivered commercial hits like Attarintiki Daredi, Mersal, and Rangasthalam. Won Filmfare for A Aa (2016) and earned acclaim for roles in Mahanati, Oh! Baby, and Majili.", wide = false },
                new { year = "2021", title = "Pan-India Recognition", description = "Made her digital debut as Raji in The Family Man 2, winning the Filmfare OTT Award for Best Actress. Performed the chart-topping Oo Antava in Pushpa: The Rise.", wide = false },
                new { year = "2023-2024", title = "Producer & Global Ventures", description = "Launched Tralala Moving Pictures with its first production Subham. Starred in Citadel: Honey Bunny (2024) and launched the Take 20 podcast advocating for health after her myositis diagnosis.", wide = false },
                new { year = "2025-2026", title = "Legacy & New Beginnings", description = "Celebrated 15 years in cinema and entered a new phase focused on projects with deeper personal meaning, balancing work with well-being and long-term impact.", wide = true }
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
                url = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg",
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
                    image = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg",
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
                    image = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg",
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
                    image = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg",
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
                    image = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg",
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
                    image = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg",
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
                    image = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg",
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
            heroImage = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748288170/96372bg8_1_lm3v2w.jpg",
            heroAlt = "Philanthropy",
            heroTitle = "Making a Difference",
            heroSubtitle = "Empowering communities and creating positive change through the Pratyusha Foundation.",
            missionKicker = "Our Mission",
            missionTitle = "Creating Sustainable Change",
            missionDescription = "The Pratyusha Foundation is committed to creating sustainable change in the lives of underprivileged women and children through education, healthcare, and skill development programs.",
            donateTitle = "Donate",
            donateDescription = "Support our initiatives through monetary contributions. Every donation helps us reach more lives.",
            donateLink = "https://pratyushasupport.org/hdfc/pay.php",
            donateCtaLabel = "Make a Donation",
            volunteerTitle = "Volunteer",
            volunteerDescription = "Join our volunteer program and contribute your time and skills to make a difference.",
            volunteerLink = "https://pratyushasupport.org/",
            volunteerCtaLabel = "Join as Volunteer"
        };
    }
}
