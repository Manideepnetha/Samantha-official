using Samantha.API.Models;

namespace Samantha.API.Data;

public static class SeedAwards
{
    public static void Initialize(AppDbContext context)
    {
        if (context.Awards.Any())
        {
            return;
        }

        var awards = new List<Award>
        {
            // Timeline Awards
            new Award { Title = "Vogue Power List - Power Performer of the Year", Year = 2025, Description = "Featured in Vogue's elite list celebrating influential women in entertainment.", Quote = "\"An unstoppable force in cinema and beyond.\"", Type = "Timeline" },
            new Award { Title = "IIFA Utsavam - Woman of the Year in Indian Cinema", Year = 2024, Description = "Recognized for her contributions to Indian cinema.", Quote = "\"A testament to her enduring impact on the industry.\"", Type = "Timeline" },
            new Award { Title = "Indian Film Festival Melbourne - Excellence in Cinema", Year = 2023, Description = "Recognized for outstanding contribution to Indian cinema and breaking stereotypes.", Quote = "\"Cinema has the power to transform lives and challenge perspectives.\"", Type = "Timeline" },
            new Award { Title = "Critics' Choice Award - Best Actress", Year = 2022, Description = "For the powerful portrayal in \"Yashoda\" that showcased unprecedented versatility.", Quote = "\"Every role is an opportunity to push boundaries and discover new dimensions.\"", Type = "Timeline" },
            new Award { Title = "Best Performance in a Series - Filmfare OTT Awards", Year = 2021, Description = "For the groundbreaking role of Raji in \"The Family Man 2\" that redefined digital entertainment.", Quote = "\"Digital platforms have opened new avenues for storytelling and character exploration.\"", Type = "Timeline" },
            new Award { Title = "Zee Cine Awards (Telugu) - Best Actress", Year = 2020, Description = "Honored for her performance in Oh! Baby.", Quote = "\"A powerful blend of humor and emotion.\"", Type = "Timeline" },
            new Award { Title = "Zee Cine Awards (Telugu) - Best Actress", Year = 2020, Description = "Awarded for her role in Majili.", Quote = "\"An emotionally stirring performance.\"", Type = "Timeline" },
            new Award { Title = "SIIMA Awards - Critics Best Actress (Telugu)", Year = 2019, Description = "Awarded for her outstanding performance in Rangasthalam.", Quote = "\"An unforgettable role with immense depth.\"", Type = "Timeline" },
            new Award { Title = "TV9 Nava Nakshatra Sanmanam - Best Actor (Female)", Year = 2019, Description = "Honored for her roles in Rangasthalam, Mahanati, and Oh! Baby.", Quote = "\"A golden year of powerful performances.\"", Type = "Timeline" },
            new Award { Title = "Filmfare Awards South - Best Actress (Telugu)", Year = 2016, Description = "Awarded for her role in A Aa.", Quote = "\"A delightful performance that charmed audiences.\"", Type = "Timeline" },
            new Award { Title = "SIIMA Awards - Critics Best Actress (Telugu)", Year = 2014, Description = "Recognized for her performance in Manam.", Quote = "\"A nuanced role that showcased her acting prowess.\"", Type = "Timeline" },
            new Award { Title = "SIIMA Awards - Best Actress (Telugu)", Year = 2013, Description = "Honored for her role in Attarintiki Daredi.", Quote = "\"A performance that blended charm and depth.\"", Type = "Timeline" },
            new Award { Title = "Filmfare Awards South - Best Actress (Telugu)", Year = 2012, Description = "Awarded for her role in Eega.", Quote = "\"A transformative role showcasing her versatility.\"", Type = "Timeline" },
            new Award { Title = "Filmfare Awards South - Best Actress (Tamil)", Year = 2012, Description = "Recognized for her performance in Neethaane En Ponvasantham.", Quote = "\"A heartfelt portrayal that resonated with many.\"", Type = "Timeline" },
            new Award { Title = "Filmfare Awards South - Best Female Debut", Year = 2010, Description = "Recognized for her debut performance in Ye Maaya Chesave.", Quote = "\"A stellar debut that marked the rise of a new star.\"", Type = "Timeline" },
            new Award { Title = "Nandi Awards - Special Jury Award", Year = 2010, Description = "Honored for her performance in Ye Maaya Chesave.", Quote = "\"A performance that captivated audiences and critics alike.\"", Type = "Timeline" },

            // Gallery Awards
            new Award { Title = "Ritz Style Award", Year = 2014, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249628/samantha-ritz-style-awards-2014-hq-012_mznaor.jpg", Type = "Gallery" },
            new Award { Title = "Special Appearance", Year = 2025, Description = "Pink Saree Event", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249626/Samantha_in_Pink_Saree_Photo_Gallery_5_ww73qx.jpg", Type = "Gallery" },
            new Award { Title = "Award Ceremony", Year = 2016, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249626/IMG_20160704_171051_sgdwig.jpg", Type = "Gallery" },
            new Award { Title = "Instagram Special", Year = 2025, Description = "Fan Event", ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249625/insta630823-___B6W1hyBB_p8___-_xtgwdh.jpg", Type = "Gallery" },
            new Award { Title = "Press Event", Year = 2017, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249624/images_3_16_fujcje.jpg", Type = "Gallery" },
            new Award { Title = "Award Show", Year = 2018, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249621/images_3_13_szn72z.jpg", Type = "Gallery" },
            new Award { Title = "Special Recognition", Year = 2019, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249611/DCVZboIUQAE5KAE_msxjzx.jpg", Type = "Gallery" },
            new Award { Title = "Special Award", Year = 2020, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/BPpBBG8CYAAL16J_yrhmnj.jpg", Type = "Gallery" },
            new Award { Title = "Fashion Icon Award", Year = 2021, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/BLrxRoNCMAEKIY6_ywdro0.jpg", Type = "Gallery" },
            new Award { Title = "Behindwoods Gold Medal", Year = 2014, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/behindwoods-gold-medals-2014_1438582220200_nojatw.jpg", Type = "Gallery" },
            new Award { Title = "Recent Achievement", Year = 2023, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/20230206_182208_zftdrl.jpg", Type = "Gallery" },
            new Award { Title = "Award Ceremony", Year = 2022, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/21242093_fw7vkl.jpg", Type = "Gallery" },
            new Award { Title = "Special Honor", Year = 2023, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249609/20230206_173648_ewtlvj.jpg", Type = "Gallery" },
            new Award { Title = "Achievement Award", Year = 2023, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249609/20230206_173107_h3vlh8.jpg", Type = "Gallery" },
            new Award { Title = "Recognition Event", Year = 2023, ImageUrl = "https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249609/20230206_172356_lesaha.jpg", Type = "Gallery" }
        };

        context.Awards.AddRange(awards);
        context.SaveChanges();
    }
}
