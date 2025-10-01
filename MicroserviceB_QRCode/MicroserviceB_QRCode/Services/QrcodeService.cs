using Grpc.Core;
using MicroserviceA_LinkShortener;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.IO.Compression;
using ZXing;
using ZXing.Common;
using ZXing.QrCode.Internal;
using static QRCoder.PayloadGenerator;

namespace MicroserviceB_QRCode.Services;

public static class Repository
{
    private static readonly Dictionary<string, string> _store = new();

    public static void Add(string key, string value)
    {
        _store[key] = value;
    }

    public static string Get(string key)
        => _store.TryGetValue(key, out var value) ? value : string.Empty;
}

public class QrcodeService : QrcodeGenerator.QrcodeGeneratorBase
{
    public override Task<CreateQRReply> CreateQR(CreateQRRequest request, ServerCallContext context)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(request.Url, QRCodeGenerator.ECCLevel.Q);

        var qrCode = new BitmapByteQRCode(qrCodeData);
        byte[] qrCodeBytes = qrCode.GetGraphic(20); 

        string base64Qr = Convert.ToBase64String(qrCodeBytes);

        Repository.Add(request.Url, base64Qr);

        return Task.FromResult(new CreateQRReply
        {
            QrCodeBase64 = base64Qr
        });
    }

    public override Task<DecodeQRReply> DecodeQR(DecodeQRRequest request, ServerCallContext context)
    {
       return Task.FromResult(new DecodeQRReply
        {
            Url = Repository.Get(request.QrCodeBase64)
        });
    }
}
