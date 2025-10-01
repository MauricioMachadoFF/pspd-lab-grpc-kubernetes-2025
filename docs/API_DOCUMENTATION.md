# API Documentation

## Overview

This document provides comprehensive API documentation for the PSPD Lab microservices architecture. The project implements 4 REST services designed for academic comparison with gRPC implementations and extended production functionality.

## Service Architecture

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  QR Generator   │  │ URL Shortener   │  │ User Management │  │    Analytics    │
│    REST API     │  │    REST API     │  │    REST API     │  │    REST API     │
│   Port 8082     │  │   Port 8083     │  │   Port 8080     │  │   Port 8081     │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
       │                      │                      │                      │
       └──────────────────────┼──────────────────────┼──────────────────────┘
                              │                      │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   Docker        │    │   Kubernetes    │
                    │ Orchestration   │    │  Deployment     │
                    └─────────────────┘    └─────────────────┘
```

## Services Documentation

### 1. QR Generator Service (Port 8082)

**Purpose**: Academic comparison with gRPC QR service
**Status**: ✅ Fully implemented with comprehensive functionality
**Documentation**: [Swagger UI](http://localhost:8082/api-docs)

#### Key Features
- Single QR code generation with multiple formats (PNG, SVG, PDF, JPEG)
- Batch QR code processing
- File upload processing for bulk operations
- Live QR code editor simulation via WebSocket
- Comprehensive error correction levels

#### Main Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/qr/generate` | Generate a single QR code |
| POST | `/api/v1/qr/batch` | Generate multiple QR codes in batch |
| POST | `/api/v1/qr/upload` | Upload file for QR processing |
| GET | `/api/v1/qr/:id` | Get QR code by ID |
| DELETE | `/api/v1/qr/:id` | Delete QR code |
| GET | `/api/v1/qr` | List QR codes with pagination |
| WS | `/api/v1/qr/live-editor` | Live QR editor WebSocket |

#### Academic Comparison Features
- Equivalent functionality to gRPC service
- Performance testing endpoints
- Detailed metrics and timing data
- Academic-focused examples and documentation

#### Health Check
```bash
curl http://localhost:8082/health
```

---

### 2. URL Shortener Service (Port 8083)

**Purpose**: Academic comparison with gRPC URL service
**Status**: ✅ Fully implemented with analytics capabilities
**Documentation**: [Swagger UI](http://localhost:8083/api-docs)

#### Key Features
- URL shortening with customizable short codes
- Click tracking and comprehensive analytics
- Geographic and device analytics
- Bulk URL processing
- Real-time analytics via WebSocket

#### Main Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/url/shorten` | Shorten a single URL |
| GET | `/api/v1/url/:shortCode` | Resolve short URL (redirect) |
| GET | `/api/v1/url/:shortCode/stats` | Get URL click statistics |
| POST | `/api/v1/url/bulk` | Shorten multiple URLs |
| GET | `/api/v1/url/:shortCode/analytics` | Get detailed analytics |
| GET | `/api/v1/url` | List URLs with pagination |
| PUT | `/api/v1/url/:shortCode` | Update URL properties |
| DELETE | `/api/v1/url/:shortCode` | Delete shortened URL |
| WS | `/api/v1/url/:shortCode/live-analytics` | Live analytics WebSocket |

#### Analytics Features
- Geographic click tracking
- Device and browser analytics
- Time-based usage patterns
- Custom metadata support
- Export capabilities

#### Health Check
```bash
curl http://localhost:8083/health
```

---

### 3. User Management Service (Port 8080)

**Purpose**: Extended production functionality for user management
**Status**: 🚧 Placeholder implementation with full API specification
**Documentation**: [Swagger UI](http://localhost:8080/api-docs)

#### Planned Features
- User registration and authentication
- JWT-based session management
- Role-based access control (student, instructor, admin)
- User profile management
- Password management and security
- User preferences and settings

#### API Specification (Planned)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | User registration | 🚧 Placeholder |
| POST | `/api/v1/auth/login` | User login | 🚧 Placeholder |
| POST | `/api/v1/auth/logout` | User logout | 🚧 Placeholder |
| GET | `/api/v1/users/profile` | Get user profile | 🚧 Placeholder |
| PUT | `/api/v1/users/profile` | Update user profile | 🚧 Placeholder |
| PUT | `/api/v1/users/password` | Change password | 🚧 Placeholder |
| GET | `/api/v1/users` | List users (admin) | 🚧 Placeholder |

#### Implementation Notes
- Currently returns 501 (Not Implemented) for all endpoints
- Full OpenAPI specification available
- Security schemes defined for JWT authentication
- Ready for production implementation

#### Health Check
```bash
curl http://localhost:8080/health
```

---

### 4. Analytics Service (Port 8081)

**Purpose**: Extended production functionality for cross-service analytics
**Status**: 🚧 Placeholder implementation with full API specification
**Documentation**: [Swagger UI](http://localhost:8081/api-docs)

#### Planned Features
- Cross-service metrics aggregation
- Real-time dashboard data
- Performance analytics and monitoring
- Usage statistics and insights
- Custom report generation
- Data export in multiple formats

#### API Specification (Planned)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/v1/dashboard` | Get dashboard data | 🚧 Placeholder |
| GET | `/api/v1/metrics` | Get system metrics | 🚧 Placeholder |
| POST | `/api/v1/reports` | Generate custom report | 🚧 Placeholder |
| GET | `/api/v1/reports/:id` | Get report status/download | 🚧 Placeholder |
| GET | `/api/v1/usage` | Get usage analytics | 🚧 Placeholder |
| POST | `/api/v1/export` | Export data | 🚧 Placeholder |

#### Analytics Capabilities (Planned)
- Service performance monitoring
- Usage pattern analysis
- Error tracking and alerting
- Business intelligence dashboards
- Custom query support

#### Health Check
```bash
curl http://localhost:8081/health
```

---

## Quick Start Guide

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Make (for automation)

### Starting All Services

```bash
# Install dependencies
make install-deps

# Build all services
make build

# Start all services
make up

# Check service health
make health

# View API documentation
make show-endpoints
```

### Individual Service Access

Once services are running, access their documentation:

- **QR Generator**: http://localhost:8082/api-docs
- **URL Shortener**: http://localhost:8083/api-docs
- **User Management**: http://localhost:8080/api-docs
- **Analytics**: http://localhost:8081/api-docs

### Service Status Overview

```bash
# Check all services status
make status

# View logs from all services
make logs

# Individual service logs
make logs-qr
make logs-url
make logs-user
make logs-analytics
```

## Development Workflow

### Local Development

```bash
# Start development mode (with hot reload)
make dev-up

# Run tests
make test

# Code quality checks
make lint

# Stop development
make dev-down
```

### Testing API Endpoints

#### QR Generator Examples
```bash
# Generate QR code
curl -X POST http://localhost:8082/api/v1/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"data": "https://pspd-lab.example.com", "format": "PNG", "size": 256}'

# Batch generate
curl -X POST http://localhost:8082/api/v1/qr/batch \
  -H "Content-Type: application/json" \
  -d '{"dataItems": ["https://example1.com", "https://example2.com"]}'
```

#### URL Shortener Examples
```bash
# Shorten URL
curl -X POST http://localhost:8083/api/v1/url/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://very-long-url.example.com", "customCode": "pspd2024"}'

# Access shortened URL (redirects)
curl -L http://localhost:8083/api/v1/url/pspd2024

# Get analytics
curl http://localhost:8083/api/v1/url/pspd2024/analytics
```

## Academic Comparison Features

### gRPC vs REST Performance Testing

Both QR Generator and URL Shortener services are designed to mirror gRPC functionality:

1. **Equivalent Operations**: Every REST endpoint has a corresponding gRPC method
2. **Performance Metrics**: Built-in timing and performance data collection
3. **Load Testing Support**: Endpoints optimized for comparative load testing
4. **Academic Examples**: Documentation includes academic use cases

### Comparison Testing Commands

```bash
# Setup for academic comparison
make compare-setup

# Load testing (requires Artillery)
make load-test

# Performance benchmarks
make benchmark
```

## Production Deployment

### Docker Deployment

```bash
# Production build
make build

# Push to registry
DOCKER_REGISTRY=your-registry.com make push

# Deploy with docker-compose
make up
```

### Kubernetes Deployment

Each service includes Kubernetes manifests in their respective directories.

```bash
# Deploy individual services
kubectl apply -f services/rest/qr-generator/k8s/
kubectl apply -f services/rest/url-shortener/k8s/
kubectl apply -f services/rest/user-management/k8s/
kubectl apply -f services/rest/analytics/k8s/
```

## API Standards and Conventions

### Response Format
All APIs follow consistent response patterns:

```json
{
  "success": true,
  "data": {
    // Actual response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Format
```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": "Additional error details",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Authentication
- User Management service will implement JWT-based authentication
- Other services can integrate with User Management for authentication
- Bearer token format: `Authorization: Bearer <token>`

### Rate Limiting
All services implement rate limiting:
- Default: 100 requests per minute per IP
- Configurable per service
- Rate limit headers included in responses

## Monitoring and Observability

### Health Checks
All services provide comprehensive health endpoints:
- Service status and uptime
- Memory and resource usage
- Service-specific metrics
- Dependency health checks

### Logging
- Structured logging with Morgan middleware
- Request/response logging
- Error tracking and stack traces
- Configurable log levels

### Metrics
- Request/response times
- Error rates and types
- Resource utilization
- Business metrics (QR codes generated, URLs shortened, etc.)

## Error Handling

### Standard HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
- `501`: Not Implemented (for placeholder endpoints)

### Validation
- Request validation using Joi schemas
- Comprehensive error messages
- Field-level validation details

## Security

### Security Measures
- Helmet.js for security headers
- CORS configuration
- Request size limits
- Rate limiting
- Input validation and sanitization

### Production Security Checklist
- [ ] Environment variable configuration
- [ ] HTTPS enforcement
- [ ] Database security
- [ ] API key management
- [ ] Logging security (no sensitive data)
- [ ] Error message sanitization

## Future Roadmap

### Phase 1: Academic Comparison (✅ Complete)
- QR Generator REST service
- URL Shortener REST service
- Full gRPC equivalency
- Performance testing capabilities

### Phase 2: Extended Services (🚧 In Progress)
- User Management implementation
- Analytics implementation
- Service integration
- Authentication and authorization

### Phase 3: Production Enhancements
- Kubernetes deployment
- Service mesh integration
- Advanced monitoring
- Automated scaling

### Phase 4: Advanced Features
- GraphQL gateway
- Event-driven architecture
- Caching strategies
- Advanced analytics

## Support and Documentation

### Getting Help
- Check service health endpoints for status
- Review Swagger documentation for API details
- Consult Makefile documentation for commands
- Check logs for debugging information

### Documentation Links
- [Makefile Documentation](./MAKEFILE.md)
- [Project Plan](../PROJECT_PLAN.md)
- [Architecture Documentation](../architecture/)
- [Claude AI Instructions](../CLAUDE.md)

### Feedback and Issues
Report issues or provide feedback through the project repository issue tracker.

---

*This documentation is generated for the PSPD Lab gRPC vs REST comparison project. Last updated: 2024-01-15*