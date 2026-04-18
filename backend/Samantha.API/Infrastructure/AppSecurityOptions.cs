namespace Samantha.API.Infrastructure;

public static class AppSecurityOptions
{
    private const int MinimumJwtSecretLength = 32;

    public static string GetRequiredJwtSecret(IConfiguration configuration)
    {
        var secret = configuration["JwtSettings:SecretKey"]?.Trim();

        if (!string.IsNullOrWhiteSpace(secret) && secret.Length >= MinimumJwtSecretLength)
        {
            return secret;
        }

        throw new InvalidOperationException(
            $"JwtSettings:SecretKey must be configured with at least {MinimumJwtSecretLength} characters.");
    }

    public static BootstrapAdminCredentials? GetBootstrapAdminCredentials(IConfiguration configuration)
    {
        var email = configuration["BootstrapAdmin:Email"]?.Trim();
        var password = configuration["BootstrapAdmin:Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return null;
        }

        return new BootstrapAdminCredentials(email, password);
    }
}

public sealed record BootstrapAdminCredentials(string Email, string Password);
