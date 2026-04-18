using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Samantha.API.Data;
using Samantha.API.Infrastructure;
using Samantha.API.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var webRootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRootPath);
builder.Environment.WebRootPath = webRootPath;

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = AppSecurityOptions.GetRequiredJwtSecret(builder.Configuration);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "Result",
        ValidAudience = jwtSettings["Audience"] ?? "Result",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Samantha API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
var applicationUrls = builder.Configuration["ASPNETCORE_URLS"] ?? string.Empty;
var shouldUseHttpsRedirection = !app.Environment.IsDevelopment()
    || applicationUrls.Contains("https://", StringComparison.OrdinalIgnoreCase);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

if (shouldUseHttpsRedirection)
{
    app.UseHttpsRedirection();
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath)
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    DatabaseSchemaBootstrap.EnsureCompatibleSchema(db, app.Logger);

    if (!db.Users.Any())
    {
        var bootstrapAdmin = AppSecurityOptions.GetBootstrapAdminCredentials(app.Configuration);
        if (bootstrapAdmin is not null)
        {
            db.Users.Add(new User
            {
                Email = bootstrapAdmin.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(bootstrapAdmin.Password),
                Role = "Admin"
            });
            db.SaveChanges();
            app.Logger.LogInformation("Bootstrapped the initial admin account for {Email}.", bootstrapAdmin.Email);
        }
        else
        {
            app.Logger.LogWarning(
                "No users exist yet and no bootstrap admin credentials were configured. Set BootstrapAdmin:Email and BootstrapAdmin:Password to seed the first admin account.");
        }
    }

    try
    {
        FrontendContentSync.EnsureSeeded(db);
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Frontend content sync failed during startup. The API will keep running so admin sync can be retried after startup.");
    }
}

app.Run();
