# Services Integration Summary

## Complete Architecture (7 Services)

### gRPC Microservices (.NET C# with Protobuf)
1. **Microservice A - Link Shortener** (Port 5001)
   - Proto: `linkshortener.proto`
   - Endpoints:
     - `POST /v1/links` - CreateLink (Shorten URL)
     - `GET /{shortUrl}` - GetUrl (Resolve URL)
   - JSON Transcoding: ✅ Enabled
   - Swagger UI: ✅ http://localhost:5001/swagger
   - OpenAPI Spec: ✅ http://localhost:5001/swagger/v1/swagger.json
   - Health Check: ✅ http://localhost:5001/health

2. **Microservice B - QR Code Generator** (Port 5003)
   - Proto: `qrcode.proto`
   - Endpoints:
     - `POST /v1/qrcode/encode` - CreateQR (Generate QR Code)
     - `POST /v1/qrcode/decode` - DecodeQR (Decode QR Code)
   - JSON Transcoding: ✅ Enabled
   - Swagger UI: ✅ http://localhost:5003/swagger
   - OpenAPI Spec: ✅ http://localhost:5003/swagger/v1/swagger.json
   - Health Check: ✅ http://localhost:5003/health

### REST Microservices (Node.js)
3. **QR Generator REST** (Port 8082)
   - Full-featured QR code generation
   - Batch processing, multiple formats
   - Equivalent to Microservice B (for comparison)

4. **URL Shortener REST** (Port 8083)
   - Full-featured URL shortening
   - Analytics, custom codes, bulk operations
   - Equivalent to Microservice A (for comparison)

5. **User Management** (Port 8080)
   - Authentication and user profiles
   - Extended production service

6. **Analytics** (Port 8081)
   - Data aggregation and reporting
   - Extended production service

### Frontend (React)
7. **Web Client** (Port 3000)
   - Protocol comparison dashboard
   - Can switch between gRPC and REST
   - Performance metrics tracking

## Frontend Integration

### API Configuration
The frontend can communicate with both gRPC and REST services:

```javascript
// REST endpoints
REST: {
  urlShortener: 'http://localhost:8083',
  qrGenerator: 'http://localhost:8082',
  userManagement: 'http://localhost:8080',
  analytics: 'http://localhost:8081'
}

// gRPC endpoints (via JSON transcoding)
gRPC: {
  urlShortener: 'http://localhost:5001',  // Microservice A
  qrGenerator: 'http://localhost:5003',   // Microservice B
  userManagement: 'http://localhost:8080', // No gRPC equivalent
  analytics: 'http://localhost:8081'       // No gRPC equivalent
}
```

### Protocol Switching
Users can switch between protocols in real-time using the Protocol Switcher component. The API layer automatically:
- Routes requests to the correct service
- Transforms gRPC responses to match REST format
- Tracks performance metrics for comparison
- Handles protocol-specific limitations

### Supported Operations by Protocol

#### URL Shortener
| Operation | REST | gRPC |
|-----------|------|------|
| Shorten URL | ✅ | ✅ |
| Resolve URL | ✅ | ✅ |
| Custom codes | ✅ | ❌ |
| URL statistics | ✅ | ❌ |
| Bulk operations | ✅ | ❌ |
| List URLs | ✅ | ❌ |
| Delete URLs | ✅ | ❌ |

#### QR Generator
| Operation | REST | gRPC |
|-----------|------|------|
| Generate QR | ✅ | ✅ |
| Multiple formats | ✅ | ❌ |
| Batch generation | ✅ | ❌ |
| Retrieve QR | ✅ | ❌ |
| List QRs | ✅ | ❌ |
| Delete QRs | ✅ | ❌ |

## Port Summary (No Conflicts)
- **5001** - gRPC Link Shortener (HTTP/2)
- **5002** - gRPC Link Shortener Health
- **5003** - gRPC QR Generator (HTTP/2)
- **5004** - gRPC QR Generator Health
- **8080** - User Management REST
- **8081** - Analytics REST
- **8082** - QR Generator REST
- **8083** - URL Shortener REST
- **3000** - Frontend Web Client

## Starting All Services
```bash
# Start Docker Desktop first, then:
make up

# Or manually:
docker-compose up -d
```

## Accessing Services

### Frontend & Web Interface
- **Frontend Dashboard**: http://localhost:3000

### gRPC Services (with Swagger UI)
- **Microservice A - Link Shortener**:
  - API: http://localhost:5001
  - Swagger UI: http://localhost:5001/swagger
  - Health: http://localhost:5001/health

- **Microservice B - QR Generator**:
  - API: http://localhost:5003
  - Swagger UI: http://localhost:5003/swagger
  - Health: http://localhost:5003/health

### REST Services
- **QR Generator REST**: http://localhost:8082
- **URL Shortener REST**: http://localhost:8083
- **User Management**: http://localhost:8080
- **Analytics**: http://localhost:8081

## Health Checks
```bash
make health
```

## Key Features
✅ Both gRPC and REST implementations
✅ JSON Transcoding for gRPC services
✅ Frontend can switch protocols in real-time
✅ Performance metrics comparison
✅ No port conflicts
✅ All services containerized
✅ Health checks for all services
