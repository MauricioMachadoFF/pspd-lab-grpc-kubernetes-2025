# Makefile Documentation

## Overview

This Makefile provides comprehensive management commands for the PSPD Lab gRPC vs REST microservices comparison project. It manages 4 REST services designed for academic comparison with gRPC implementations and production-ready extended services.

## Architecture Overview

```
Project Structure:
├── services/rest/
│   ├── qr-generator/     (Port 8082) - Academic comparison with gRPC
│   ├── url-shortener/    (Port 8083) - Academic comparison with gRPC
│   ├── user-management/  (Port 8080) - Extended production service
│   └── analytics/        (Port 8081) - Extended production service
├── Makefile             - Service management automation
└── docker-compose.rest.yml - Multi-service orchestration
```

## Quick Start

```bash
# 1. Install dependencies
make install-deps

# 2. Build all services
make build

# 3. Start all services
make up

# 4. Check service health
make health

# 5. View available endpoints
make show-endpoints

# 6. Stop services when done
make down
```

## Command Categories

### 🏁 Getting Started Commands

| Command | Description | Example |
|---------|-------------|---------|
| `make help` | Display all available commands with descriptions | `make help` |
| `make install-deps` | Install Node.js dependencies for all services | `make install-deps` |
| `make show-services` | Display service configuration and ports | `make show-services` |
| `make show-endpoints` | List all API endpoints for each service | `make show-endpoints` |

### 🔨 Development Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `make test` | Run unit tests for all services | Development validation |
| `make test-coverage` | Generate coverage reports | Quality assurance |
| `make lint` | Run ESLint on all services | Code quality check |
| `make dev-up` | Start services in development mode with hot reload | Active development |
| `make dev-down` | Stop development servers | End development session |

**Development Mode Details:**
- Uses `nodemon` for auto-restart on file changes
- Runs services directly with Node.js (no Docker)
- Enables detailed logging and debugging
- Faster iteration cycles for development

### 🐳 Docker Build Commands

| Command | Description | Output |
|---------|-------------|---------|
| `make build` | Build all service images | 4 Docker images created |
| `make build-qr-rest` | Build QR Generator service only | `qr-generator-rest:latest` |
| `make build-url-rest` | Build URL Shortener service only | `url-shortener-rest:latest` |
| `make build-user-mgmt` | Build User Management service only | `user-management-rest:latest` |
| `make build-analytics` | Build Analytics service only | `analytics-rest:latest` |
| `make push` | Push all images to registry | Images available for deployment |

**Build Process:**
1. Multi-stage Docker builds for optimized images
2. Security-hardened containers (non-root users)
3. Health check integration
4. Production-ready configuration

### 🚀 Service Orchestration Commands

| Command | Description | Services Started |
|---------|-------------|------------------|
| `make up` | Start all services with docker-compose | All 4 REST services |
| `make down` | Stop all services and remove containers | Clean shutdown |
| `make restart` | Restart all services (down + up) | Full restart cycle |
| `make logs` | View logs from all services | Aggregated log stream |
| `make status` | Show container status and ports | Service health overview |

**Service Endpoints After `make up`:**
- QR Generator: http://localhost:8082
- URL Shortener: http://localhost:8083
- User Management: http://localhost:8080
- Analytics: http://localhost:8081

### 🔍 Individual Service Commands

#### Standalone Docker Runs
```bash
make run-qr-rest      # Run only QR Generator service
make run-url-rest     # Run only URL Shortener service
make run-user-mgmt    # Run only User Management service
make run-analytics    # Run only Analytics service
make stop-all         # Stop all standalone containers
```

#### Individual Service Logs
```bash
make logs-qr          # QR Generator logs only
make logs-url         # URL Shortener logs only
make logs-user        # User Management logs only
make logs-analytics   # Analytics logs only
```

### 🏥 Health Check & Monitoring Commands

| Command | Description | Information Provided |
|---------|-------------|---------------------|
| `make health` | Check health of all services | HTTP status, response time, service info |
| `make status` | Show Docker container status | Container state, ports, uptime |

**Health Check Details:**
- Calls `/health` endpoint on each service
- Validates HTTP 200 response
- Displays service metadata (version, protocol, status)
- Identifies non-responsive services

### ⚡ Performance Testing Commands

| Command | Description | Requirements |
|---------|-------------|--------------|
| `make load-test` | Display load testing instructions | Artillery CLI tool |
| `make benchmark` | Run basic performance benchmarks | Apache Bench (ab) |

**Performance Testing Setup:**
```bash
# Install required tools
npm install -g artillery
sudo apt-get install apache2-utils  # for 'ab' command

# Run load tests
artillery quick --count 100 --num 10 http://localhost:8082/api/v1/qr/generate
artillery quick --count 100 --num 10 http://localhost:8083/api/v1/url/shorten
```

### 🧹 Cleanup Commands

| Command | Description | What Gets Removed |
|---------|-------------|-------------------|
| `make clean` | Clean Docker resources | Containers, networks, unused images |
| `make clean-all` | Complete cleanup | Above + node_modules + images |
| `make reset` | Reset entire environment | Complete cleanup + reinstall + rebuild |

**Cleanup Levels:**
1. **clean**: Docker containers and networks
2. **clean-all**: Everything including Node.js dependencies
3. **reset**: Complete environment reset to fresh state

### 🎓 Academic Comparison Commands

| Command | Description | Purpose |
|---------|-------------|---------|
| `make compare-setup` | Prepare for gRPC vs REST comparison | Academic study setup |

**Academic Comparison Workflow:**
1. `make compare-setup` - Start REST services
2. Start equivalent gRPC services separately
3. Run performance tests on both implementations
4. Compare results for academic analysis

## Configuration Variables

| Variable | Default | Description | Override Example |
|----------|---------|-------------|------------------|
| `DOCKER_REGISTRY` | `localhost:5000` | Docker registry for images | `DOCKER_REGISTRY=myregistry.com make build` |
| `VERSION` | `latest` | Image version tag | `VERSION=v1.2.3 make build` |
| `QR_REST_PORT` | `8082` | QR Generator service port | Modify in Makefile |
| `URL_REST_PORT` | `8083` | URL Shortener service port | Modify in Makefile |
| `USER_MGMT_PORT` | `8080` | User Management service port | Modify in Makefile |
| `ANALYTICS_PORT` | `8081` | Analytics service port | Modify in Makefile |

## Common Usage Patterns

### Development Workflow
```bash
# Start development environment
make dev-up

# Make code changes...

# Run tests
make test

# Check code quality
make lint

# Stop development
make dev-down
```

### Production Deployment
```bash
# Build production images
make build

# Start production services
make up

# Verify deployment
make health
make status

# View logs if needed
make logs
```

### Testing & Quality Assurance
```bash
# Run full test suite
make test

# Generate coverage reports
make test-coverage

# Check code quality
make lint

# Performance testing
make benchmark
```

### Troubleshooting Workflow
```bash
# Check service status
make status

# View aggregated logs
make logs

# Check individual service
make logs-qr        # or logs-url, logs-user, logs-analytics

# Restart if needed
make restart

# Complete reset if necessary
make reset
```

## Service-Specific Information

### QR Generator REST Service (Port 8082)
- **Purpose**: Academic comparison with gRPC QR service
- **Features**: QR generation, batch processing, file uploads
- **Health Check**: `curl http://localhost:8082/health`
- **API Docs**: `curl http://localhost:8082/` for endpoint list

### URL Shortener REST Service (Port 8083)
- **Purpose**: Academic comparison with gRPC URL service
- **Features**: URL shortening, analytics, bulk operations
- **Health Check**: `curl http://localhost:8083/health`
- **API Docs**: `curl http://localhost:8083/` for endpoint list

### User Management Service (Port 8080)
- **Purpose**: Extended production functionality
- **Features**: Authentication, user profiles (placeholder)
- **Status**: Basic implementation, ready for extension

### Analytics Service (Port 8081)
- **Purpose**: Data aggregation and reporting
- **Features**: Dashboard APIs, metrics (placeholder)
- **Status**: Basic implementation, ready for extension

## Error Handling & Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8082

   # Kill the process or change port in Makefile
   ```

2. **Docker Build Failures**
   ```bash
   # Clean Docker cache
   make clean

   # Rebuild from scratch
   make build
   ```

3. **Service Not Starting**
   ```bash
   # Check logs
   make logs-qr  # (or specific service)

   # Verify dependencies
   make install-deps
   ```

4. **Health Check Failures**
   ```bash
   # Wait for services to start (can take 30-60 seconds)
   sleep 30
   make health

   # Check container status
   make status
   ```

### Debug Mode
```bash
# Start services with debug logging
LOG_LEVEL=debug make up

# View detailed logs
make logs
```

## Integration with Project Phases

This Makefile supports the PROJECT_PLAN.md implementation phases:

- **Phase 6.1**: Academic comparison REST services (QR + URL)
- **Phase 6.2**: Extended production services (User + Analytics)
- **Phase 6.3**: Service orchestration and management
- **Phase 8**: Performance testing and comparison

## Best Practices

1. **Always run `make health` after `make up`** to verify services started correctly
2. **Use `make dev-up` for development** to enable hot reload
3. **Run `make test` before committing** to ensure code quality
4. **Use `make clean` regularly** to avoid Docker disk space issues
5. **Check `make status`** to monitor container health over time

## Contributing

When adding new services or commands:

1. Follow existing naming conventions
2. Add help text using `## Description` format
3. Use color coding for output (RED, GREEN, YELLOW, BLUE, NC)
4. Include error handling with `2>/dev/null || true` where appropriate
5. Update this documentation with new commands