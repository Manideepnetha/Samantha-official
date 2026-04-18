using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

internal sealed class LocalApiClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiBase;
    private string? _token;

    public LocalApiClient(HttpClient httpClient, string apiBase)
    {
        _httpClient = httpClient;
        _apiBase = apiBase.TrimEnd('/');
    }

    public async Task LoginAsync(string email, string password)
    {
        using var response = await _httpClient.PostAsync(
            $"{_apiBase}/auth/login",
            SerializeJson(new LoginRequest(email, password)));

        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Login failed with status {(int)response.StatusCode}: {body}");
        }

        var payload = JsonSerializer.Deserialize<LoginResponse>(body, GalleryImportRunnerJson.Options)
            ?? throw new InvalidOperationException("Login response was empty.");

        _token = payload.Token;
    }

    public async Task<List<GalleryCollectionDto>> GetGalleryCollectionsAsync()
        => await GetAsync<List<GalleryCollectionDto>>($"{_apiBase}/gallerycollections", authorized: false) ?? [];

    public async Task<List<MediaGalleryDto>> GetMediaAsync()
        => await GetAsync<List<MediaGalleryDto>>($"{_apiBase}/mediagallery", authorized: false) ?? [];

    public async Task<GalleryCollectionDto> CreateGalleryCollectionAsync(GalleryCollectionDto payload)
        => await SendJsonAsync<GalleryCollectionDto>(HttpMethod.Post, $"{_apiBase}/gallerycollections", payload);

    public async Task<GalleryCollectionDto> UpdateGalleryCollectionAsync(int id, GalleryCollectionDto payload)
    {
        await SendJsonAsync<object>(HttpMethod.Put, $"{_apiBase}/gallerycollections/{id}", payload);
        return (await GetAsync<GalleryCollectionDto>($"{_apiBase}/gallerycollections/{id}", authorized: false))
            ?? throw new InvalidOperationException($"Gallery collection {id} could not be reloaded after update.");
    }

    public async Task DeleteGalleryCollectionAsync(int id, bool ignoreNotFound = false)
        => await DeleteAsync($"{_apiBase}/gallerycollections/{id}", ignoreNotFound);

    public async Task<MediaGalleryDto> CreateMediaAsync(MediaGalleryDto payload)
        => await SendJsonAsync<MediaGalleryDto>(HttpMethod.Post, $"{_apiBase}/mediagallery", payload);

    public async Task DeleteMediaAsync(int id, bool ignoreNotFound = false)
        => await DeleteAsync($"{_apiBase}/mediagallery/{id}", ignoreNotFound);

    public async Task<UploadedAsset> UploadImageAsync(string filePath, string folder)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiBase}/uploads/images");
        EnsureAuthenticated(request);

        await using var fileStream = File.OpenRead(filePath);
        using var fileContent = new StreamContent(fileStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(GalleryImportHelpers.GetContentType(filePath));

        using var formData = new MultipartFormDataContent();
        formData.Add(fileContent, "files", Path.GetFileName(filePath));
        formData.Add(new StringContent(folder), "folder");

        request.Content = formData;

        using var response = await _httpClient.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"POST {_apiBase}/uploads/images failed with status {(int)response.StatusCode}: {body}");
        }

        var payload = JsonSerializer.Deserialize<List<UploadedMediaAssetDto>>(body, GalleryImportRunnerJson.Options)
            ?? throw new InvalidOperationException("Upload response was empty.");

        var asset = payload.FirstOrDefault()
            ?? throw new InvalidOperationException("Upload response did not contain a media asset.");

        return new UploadedAsset(asset.Url, asset.PublicId, filePath);
    }

    private async Task<T?> GetAsync<T>(string url, bool authorized)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        if (authorized)
        {
            EnsureAuthenticated(request);
        }

        using var response = await _httpClient.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"GET {url} failed with status {(int)response.StatusCode}: {body}");
        }

        return JsonSerializer.Deserialize<T>(body, GalleryImportRunnerJson.Options);
    }

    private async Task<T> SendJsonAsync<T>(HttpMethod method, string url, object payload)
    {
        using var request = new HttpRequestMessage(method, url)
        {
            Content = SerializeJson(payload)
        };

        EnsureAuthenticated(request);

        using var response = await _httpClient.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"{method} {url} failed with status {(int)response.StatusCode}: {body}");
        }

        if (typeof(T) == typeof(object) || string.IsNullOrWhiteSpace(body))
        {
            return (T)(object)new object();
        }

        return JsonSerializer.Deserialize<T>(body, GalleryImportRunnerJson.Options)
            ?? throw new InvalidOperationException($"{method} {url} returned an empty response.");
    }

    private async Task DeleteAsync(string url, bool ignoreNotFound)
    {
        using var request = new HttpRequestMessage(HttpMethod.Delete, url);
        EnsureAuthenticated(request);

        using var response = await _httpClient.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        if (ignoreNotFound && response.StatusCode == HttpStatusCode.NotFound)
        {
            return;
        }

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"DELETE {url} failed with status {(int)response.StatusCode}: {body}");
        }
    }

    private void EnsureAuthenticated(HttpRequestMessage request)
    {
        if (string.IsNullOrWhiteSpace(_token))
        {
            throw new InvalidOperationException("The API client is not authenticated.");
        }

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);
        request.Headers.TryAddWithoutValidation("Bypass-Tunnel-Reminder", "true");
    }

    private static StringContent SerializeJson(object payload)
        => new(JsonSerializer.Serialize(payload, GalleryImportRunnerJson.Options), Encoding.UTF8, "application/json");
}
