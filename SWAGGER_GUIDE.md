# Swagger/OpenAPI Documentation Guide

## Overview
Both gRPC microservices (A & B) have **full Swagger/OpenAPI documentation** enabled via **gRPC JSON Transcoding**.

This means you can:
- View interactive API documentation in your browser
- Test API endpoints directly from Swagger UI
- Export OpenAPI specifications
- Call gRPC services using regular HTTP/REST requests

## Accessing Swagger UI

### Microservice A - Link Shortener (Port 5001)
**Swagger UI**: http://localhost:5001/swagger

Available endpoints:
1. **POST /v1/links** - Shorten a URL
   ```json
   {
     "url": "https://example.com/very/long/url"
   }
   ```
   Response:
   ```json
   {
     "shortUrl": "abc123"
   }
   ```

2. **GET /{shortUrl}** - Resolve shortened URL
   ```bash
   GET http://localhost:5001/abc123
   ```
   Response:
   ```json
   {
     "url": "https://example.com/very/long/url"
   }
   ```

### Microservice B - QR Code Generator (Port 5003)
**Swagger UI**: http://localhost:5003/swagger

Available endpoints:
1. **POST /v1/qrcode/encode** - Generate QR Code
   ```json
   {
     "url": "https://example.com"
   }
   ```
   Response:
   ```json
   {
     "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA..."
   }
   ```

2. **POST /v1/qrcode/decode** - Decode QR Code
   ```json
   {
     "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA..."
   }
   ```
   Response:
   ```json
   {
     "url": "https://example.com"
   }
   ```

## Testing with Swagger UI

### Using the Interactive Interface
1. Open Swagger UI in your browser
2. Click on any endpoint to expand it
3. Click "Try it out" button
4. Fill in the request body (JSON)
5. Click "Execute"
6. View the response below

### Example: Shorten a URL via Swagger
1. Go to http://localhost:5001/swagger
2. Expand `POST /v1/links`
3. Click "Try it out"
4. Enter request body:
   ```json
   {
     "url": "https://github.com/pspd-lab"
   }
   ```
5. Click "Execute"
6. See the shortened URL in the response

## Testing with cURL

### Link Shortener Examples
```bash
# Shorten a URL
curl -X POST http://localhost:5001/v1/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url"}'

# Resolve a short URL
curl http://localhost:5001/abc123
```

### QR Code Generator Examples
```bash
# Generate QR Code
curl -X POST http://localhost:5003/v1/qrcode/encode \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Decode QR Code
curl -X POST http://localhost:5003/v1/qrcode/decode \
  -H "Content-Type: application/json" \
  -d '{"qrCodeBase64": "iVBORw0KGgo..."}'
```

## Testing with Postman

1. **Import OpenAPI Spec**:
   - Microservice A: http://localhost:5001/swagger/v1/swagger.json
   - Microservice B: http://localhost:5003/swagger/v1/swagger.json

2. Postman will automatically generate a collection with all endpoints

3. Test directly from Postman with auto-completion

## Health Checks

Both services expose health check endpoints:

```bash
# Check Link Shortener health
curl http://localhost:5001/health

# Check QR Generator health
curl http://localhost:5003/health
```

Response:
```json
{
  "status": "healthy",
  "service": "link-shortener-grpc",
  "timestamp": "2025-10-01T18:30:00Z"
}
```

## How It Works

### gRPC JSON Transcoding
The services use ASP.NET Core gRPC JSON Transcoding, which:
1. Reads Protocol Buffer definitions (`.proto` files)
2. Automatically creates HTTP/REST endpoints
3. Handles conversion between JSON and Protobuf
4. Generates OpenAPI/Swagger documentation

### Architecture
```
Client Request (HTTP/JSON)
    ↓
JSON Transcoding Layer
    ↓
gRPC Service (Protobuf)
    ↓
JSON Transcoding Layer
    ↓
Client Response (HTTP/JSON)
```

This allows the same service to be called via:
- **Pure gRPC** (binary Protobuf over HTTP/2)
- **HTTP/REST** (JSON over HTTP/1.1 or HTTP/2)

## Comparison with REST Services

| Feature | gRPC (Port 5001/5003) | REST (Port 8082/8083) |
|---------|----------------------|---------------------|
| Protocol | gRPC + HTTP | HTTP only |
| Format | Protobuf + JSON | JSON only |
| Swagger | ✅ Auto-generated | ✅ Manual |
| Performance | Faster (binary) | Slower (text) |
| Features | Basic (2 ops) | Full (7+ ops) |

## Troubleshooting

### Swagger UI not loading?
1. Make sure the service is running: `docker ps`
2. Check health endpoint: `curl http://localhost:5001/health`
3. View logs: `make logs-grpc-link` or `make logs-grpc-qr`

### "Cannot connect" error?
1. Start Docker Desktop
2. Build and run services: `make up`
3. Wait for services to be healthy (30-40 seconds)

### Want to see raw OpenAPI spec?
- Link Shortener: http://localhost:5001/swagger/v1/swagger.json
- QR Generator: http://localhost:5003/swagger/v1/swagger.json

## Summary

✅ **Both gRPC microservices have full Swagger documentation**  
✅ **Access via browser at /swagger endpoint**  
✅ **Test APIs interactively without writing code**  
✅ **Export OpenAPI specs for Postman/other tools**  
✅ **gRPC services callable via HTTP/REST thanks to JSON transcoding**
