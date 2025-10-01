using Grpc.Core;
using MicroserviceA_LinkShortener;

namespace MicroserviceA_LinkShortener.Services;

public class LinkSService : LinkShortener.LinkShortenerBase
{
    public override Task<CreateLinkReply> CreateLink(CreateLinkRequest request, ServerCallContext context)
    {
        var shortUrl = Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..6];

        Repository.Add(shortUrl, request.Url);

        return Task.FromResult(new CreateLinkReply
        {
            ShortUrl = shortUrl
        });
    }

    public override Task<GetUrlReply> GetUrl(GetUrlRequest request, ServerCallContext context)
    {
        var originalUrl = Repository.Get(request.ShortUrl);

        return Task.FromResult(new GetUrlReply
        {
            Url = originalUrl ?? string.Empty
        });
    }
}


public static class Repository
{
    private static readonly Dictionary<string, string> _store = [];
    public static void Add(string shortUrl, string originalUrl)
    {
        _store[shortUrl] = originalUrl;
    }
    public static string Get(string shortUrl)
        => _store.TryGetValue(shortUrl, out var originalUrl) ? originalUrl : string.Empty;
}