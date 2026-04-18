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
            new Philanthropy
            {
                Title = "Critical Surgeries Supported",
                Value = 150,
                Icon = "Care",
                Type = "Stat"
            },
            new Philanthropy
            {
                Title = "Children Supported Through Shelter Partnership",
                Value = 28,
                Icon = "Kids",
                Type = "Stat"
            },
            new Philanthropy
            {
                Title = "Foundation Established",
                Value = 2014,
                Icon = "Heart",
                Type = "Stat"
            },
            new Philanthropy
            {
                Title = "Medical Aid",
                Description = "Fund critical surgeries, treatments, and ongoing care for underprivileged children and women.",
                Icon = "Care",
                Type = "Initiative"
            },
            new Philanthropy
            {
                Title = "Menstrual Dignity",
                Description = "Promote menstrual health awareness and distribute sanitary kits through the End Period Poverty campaign.",
                Icon = "Rise",
                Type = "Initiative"
            },
            new Philanthropy
            {
                Title = "Emergency Relief",
                Description = "Provide immediate support to families in crisis, including hospitalisation, medication, and rehabilitation.",
                Icon = "Reach",
                Type = "Initiative"
            },
            new Philanthropy
            {
                Title = "Vaccination Drives",
                Description = "Organise seasonal and need-based vaccination camps for vulnerable communities.",
                Icon = "Aid",
                Type = "Initiative"
            },
            new Philanthropy
            {
                Title = "Wish Come True",
                Description = "Fulfil heartfelt wishes for children in NGOs, shelters, and underserved communities.",
                Icon = "Heart",
                Type = "Initiative"
            },
            new Philanthropy
            {
                Title = "Long-term Care Support",
                Description = "Assist orphanages, shelters, and survivor homes with essentials, education aid, and health support.",
                Icon = "Kids",
                Type = "Initiative"
            },
            new Philanthropy
            {
                Title = "Health Equity Awareness",
                Description = "Raise awareness about the right to affordable, dignified healthcare for all, especially for women and children.",
                Icon = "Reach",
                Type = "Initiative"
            },
            new Philanthropy
            {
                Title = "Historic patient-support record",
                Description = "Archived official Pratyusha Support pages publicly listed individual treatment cases across partner hospitals, reinforcing that the medical-aid mission has long been case-based and family-centred.",
                Type = "Story",
                ImageUrl = "/assets/images/philanthropy/pratyusha-hero.png"
            },
            new Philanthropy
            {
                Title = "Wish Come True in public record",
                Description = "A public 2014 report documented Pratyusha Support arranging a Ram Charan meeting for a child from Desire Society, illustrating the foundation's wish-fulfilment work beyond direct treatment support.",
                Type = "Story",
                ImageUrl = "/assets/images/philanthropy/samantha-pratyusha.png"
            },
            new Philanthropy
            {
                Title = "Preventive and community-health footprint",
                Description = "Legacy official records reference blood donation camps, cervical cancer vaccination activity, hemophilia-related outreach, and celebrations with child-care institutions such as Sphoorti Foundation.",
                Type = "Story",
                ImageUrl = "/assets/images/philanthropy/seshanka-binesh.png"
            }
        };

        context.Philanthropies.AddRange(philanthropies);
        context.SaveChanges();
    }
}
