using Samantha.API.Models;

namespace Samantha.API.Data;

public static class SeedHome
{
    public static void Initialize(AppDbContext context)
    {
        // 1. News Articles
        if (!context.NewsArticles.Any())
        {
            var news = new List<NewsArticle>
            {
                new NewsArticle 
                { 
                    Title = "Galatta Interview", 
                    Date = "May 15, 2025", 
                    Excerpt = "In this interview, Baradwaj Rangan has a candid conversation with Samantha for Shubham. They ate a lot, talked a lot, and had lots of fun.", 
                    ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748181752/1KBvNGVxuMg-HD_gvqzhe.jpg",
                    Link = "https://youtu.be/1KBvNGVxuMg?si=6c4pq5wmmkIocelt"
                },
                new NewsArticle 
                { 
                    Title = "Celebrating 15 Years Of Samantha Promo", 
                    Date = "April 28, 2025", 
                    Excerpt = "Celebrating 15 Years Of Samantha Promo | Apsara Awards 2025 | This Saturday at 5:30PM | Zee Telugu", 
                    ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748181934/5SK0jFVolHU-HD_za0gfe.jpg",
                    Link = "https://youtu.be/5SK0jFVolHU?si=IHIkUwZ-McsgR9Bb"
                },
                new NewsArticle 
                { 
                    Title = "Samantha on health, stopping junk food ads...", 
                    Date = "April 10, 2025", 
                    Excerpt = "Samantha was one of the first people who supported me when I started Label Padhega India...", 
                    ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748182251/oeK3C-9cbVc-HD_qzprbm.jpg",
                    Link = "https://youtu.be/oeK3C-9cbVc?si=dKNuBerq_MvuxsF_"
                }
            };
            context.NewsArticles.AddRange(news);
        }

        // 2. Featured Gallery
        if (!context.MediaGalleries.Any())
        {
            var gallery = new List<MediaGallery>
            {
                new MediaGallery { Caption = "Elegant Portrait", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045091/7fb8df223537765.67fa812e2e11a_y4wnfj.jpg", AltText = "Samantha Ruth Prabhu portrait" },
                new MediaGallery { Caption = "Traditional Look", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045106/behance_download_1696836520640_z70bkf.jpg", AltText = "Samantha Ruth Prabhu in traditional attire" },
                new MediaGallery { Caption = "Candid Moment", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045105/RDT_20230918_1518324927662270333256076_x6bzvb.png", AltText = "Samantha Ruth Prabhu candid moment" },
                new MediaGallery { Caption = "Majili Movie", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045289/Majili_aqbpbd.jpg", AltText = "Samantha Ruth Prabhu in Majili" },
                new MediaGallery { Caption = "Glamorous Style", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg", AltText = "Samantha Ruth Prabhu glamorous look" }
            };
            context.MediaGalleries.AddRange(gallery);
        }

        // 3. Upcoming Movies
        // Check if "Rakt Brahmand" exists, if not add it
        if (!context.Movies.Any(m => m.Title == "Rakt Brahmand"))
        {
            context.Movies.Add(new Movie
            {
                Title = "Rakt Brahmand",
                Year = 2026, // Future year
                ReleaseDate = "To be announced",
                Language = "Hindi/Telugu",
                Genre = new List<string> { "Thriller", "Action" },
                Role = "Lead",
                Director = "Rahi Anil Barve",
                Poster = "", // No poster yet or placeholder
                Description = "A thrilling new project."
            });
        }

        if (!context.Movies.Any(m => m.Title == "Maa Inti Bangaram"))
        {
            context.Movies.Add(new Movie
            {
                Title = "Maa Inti Bangaram",
                Year = 2026,
                ReleaseDate = "To be announced",
                Language = "Telugu",
                Genre = new List<string> { "Drama" },
                Role = "Lead",
                Director = "To be announced",
                Poster = "",
                Description = "A heartwarming family drama."
            });
        }

        context.SaveChanges();
    }
}
