using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Samantha.API.Data;
using Samantha.API.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "super_secret_key_which_should_be_long_enough_for_security";

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Users.Any())
    {
        db.Users.Add(new User 
        { 
            Email = "admin@samantha.com", 
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "Admin"
        });
        db.SaveChanges();
    }

    // Auto-create SiteSettings table if missing (Production Safety)
    try 
    {
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ""SiteSettings"" (
                ""Id"" serial NOT NULL,
                ""Key"" text NOT NULL,
                ""Value"" text NOT NULL,
                CONSTRAINT ""PK_SiteSettings"" PRIMARY KEY (""Id"")
            );
        ");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error checking/creating SiteSettings table: " + ex.Message);
    }

    try
    {
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ""PageContents"" (
                ""Id"" serial NOT NULL,
                ""Key"" text NOT NULL,
                ""ContentJson"" text NOT NULL,
                ""Description"" text NULL,
                ""UpdatedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT ""PK_PageContents"" PRIMARY KEY (""Id"")
            );

            CREATE UNIQUE INDEX IF NOT EXISTS ""IX_PageContents_Key"" ON ""PageContents"" (""Key"");

            ALTER TABLE IF EXISTS ""ContactMessages"" ADD COLUMN IF NOT EXISTS ""Category"" text;
            ALTER TABLE IF EXISTS ""ContactMessages"" ADD COLUMN IF NOT EXISTS ""MetadataJson"" text;
        ");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error checking/creating content sync tables: " + ex.Message);
    }

    // Create QuizEntries table
    try
    {
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ""QuizEntries"" (
                ""Id"" serial NOT NULL,
                ""Name"" text NOT NULL,
                ""Email"" text NOT NULL,
                ""City"" text NULL,
                ""Score"" integer NOT NULL DEFAULT 0,
                ""TotalQuestions"" integer NOT NULL DEFAULT 0,
                ""TimeTakenSeconds"" integer NOT NULL DEFAULT 0,
                ""SubmittedAt"" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT ""PK_QuizEntries"" PRIMARY KEY (""Id"")
            );
            CREATE INDEX IF NOT EXISTS ""IX_QuizEntries_Email"" ON ""QuizEntries"" (""Email"");
        ");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error creating QuizEntries table: " + ex.Message);
    }

    FrontendContentSync.EnsureSeeded(db);
}

app.Run();
