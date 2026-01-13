using Samantha.API.Models;

namespace Samantha.API.Data;

public static class SeedGallery
{
    public static void Initialize(AppDbContext context)
    {
        var galleryItems = new List<MediaGallery>
        {
            new MediaGallery { Caption = "Samantha x Burberry Collaboration", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296933/Samantha_x_burberry_ml1yed.jpg", AltText = "Samantha x Burberry", Type = "fashion", Date = "March 2024" },
            new MediaGallery { Caption = "Latest Fashion Editorial", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748298223/d5wj1d4ydqe61_fr3adf.jpg", AltText = "Fashion Editorial", Type = "fashion", Date = "March 2024" },
            new MediaGallery { Caption = "Latest Fashion Editorial - Blue Saree", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297784/behance_download_1705218613069_toqclh.jpg", AltText = "Fashion Editorial - Blue Saree", Type = "fashion", Date = "March 2024" },
            new MediaGallery { Caption = "Latest Fashion Editorial", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297382/Samantha17_zxr8ah.jpg", AltText = "Fashion Editorial", Type = "fashion", Date = "March 2024" },
            new MediaGallery { Caption = "Latest Fashion Editorial", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296644/ee0bed145412067.629e2c026e891_1_wgw0tk.jpg", AltText = "Fashion Editorial", Type = "fashion", Date = "March 2024" },
            new MediaGallery { Caption = "Latest Film Project", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg", AltText = "Film Still", Type = "films", Date = "2024" },
            new MediaGallery { Caption = "Behind the Scenes", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296881/53885681037_6a705301cf_o_ztjyeg.jpg", AltText = "Behind the Scenes", Type = "bts", Date = "March 2024" },
            new MediaGallery { Caption = "Fashion Event Appearance", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295435/5_6185746542628962569_bgalhv.jpg", AltText = "Fashion Event", Type = "events", Date = "March 2024" },
            new MediaGallery { Caption = "Magazine Cover Shoot", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg", AltText = "Magazine Cover", Type = "photoshoots", Date = "March 2024" },
            new MediaGallery { Caption = "Fashion Event Appearance", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297381/IMG_20231010_193941_idl7at.jpg", AltText = "Fashion Event", Type = "events", Date = "October 2023" },
            new MediaGallery { Caption = "Fashion Event Appearance", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297890/RDT_20230925_1145373619426103841407709_l5sply.png", AltText = "Fashion Event", Type = "events", Date = "September 2023" }
        };

        try 
        {
            foreach (var item in galleryItems)
            {
                if (!context.MediaGalleries.Any(g => g.Caption == item.Caption && g.Type == item.Type))
                {
                    context.MediaGalleries.Add(item);
                }
            }
            
            context.SaveChanges();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error seeding gallery: " + ex.Message);
            if (ex.InnerException != null)
                Console.WriteLine("Inner Error: " + ex.InnerException.Message);
            throw;
        }
    }
}
