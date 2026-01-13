using Samantha.API.Models;

namespace Samantha.API.Data;

public static class SeedPhilanthropy
{
    public static void Initialize(AppDbContext context)
    {
        if (context.Philanthropies.Any())
        {
            return;
        }

        var philanthropies = new List<Philanthropy>
        {
            // Success Story
            new Philanthropy { 
                Title = "Pratyusha Support: Founded by Samantha Ruth Prabhu", 
                Description = "Conceptualized by leading South Indian actress - Samantha Ruth Prabhu, Pratyusha Support has started its services in February 2014. Since then, we have been serving the underprivileged by delivering some unparalleled medical support to women and children, while fulfilling wishes of those children suffering from life-threatening medical conditions. We have been closely working with our partnered hospitals, Rainbow, Continental, Livlife, Ankura and Andhra Hospitals in Telangana and Andhra Pradesh states primarily. \"I wanted to create something that would outlive me—something that would continue to bring hope to people long after I'm gone. That's why I started Pratyusha Support.\"", 
                Type = "Story", 
                ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748291908/bg16_unojqa.jpg" 
            }
        };

        context.Philanthropies.AddRange(philanthropies);
        context.SaveChanges();
    }
}
