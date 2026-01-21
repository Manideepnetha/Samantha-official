using Microsoft.EntityFrameworkCore;
using Samantha.API.Models;

namespace Samantha.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Testimonial> Testimonials { get; set; }
    public DbSet<ContactMessage> ContactMessages { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<Award> Awards { get; set; }
    public DbSet<Philanthropy> Philanthropies { get; set; }
    public DbSet<NewsArticle> NewsArticles { get; set; }
    public DbSet<MediaGallery> MediaGalleries { get; set; }
    public DbSet<FashionItem> FashionItems { get; set; }
    public DbSet<SiteSetting> SiteSettings { get; set; }
}
