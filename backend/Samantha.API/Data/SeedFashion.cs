using Samantha.API.Models;

namespace Samantha.API.Data;

public static class SeedFashion
{
    public static void Initialize(AppDbContext context)
    {
        if (context.FashionItems.Any())
        {
            return;
        }

        var styles = new List<FashionItem>
        {
            new FashionItem
            {
                Title = "Style Evolution",
                Date = "July 20, 2024",
                Description = "Exploring the journey through various fashion milestones and iconic looks.",
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748271544/WD01RESIZED_phdvfr.webp",
                Link = "https://saaki.co/"
            }
        };

        context.FashionItems.AddRange(styles);
        context.SaveChanges();
    }
}
