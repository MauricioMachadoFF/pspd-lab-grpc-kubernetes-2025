# Architecture Documentation

This directory contains comprehensive architectural diagrams and documentation for the distributed microservices project as specified in the PSPD lab requirements.

## 📋 Contents

### 🏗️ Architecture Diagrams

1. **[Main Architecture](main-architecture.md)** - Original PDF requirements implementation
   - 3-module system (P, A, B)
   - gRPC-based microservices
   - Web client to backend communication

2. **[Extended Architecture](extended-architecture.md)** - Enhanced 4-microservice system
   - 2 gRPC microservices (QR Generator, URL Shortener)
   - 2 REST microservices (User Management, Analytics Dashboard)
   - Load balancing and service discovery

3. **[Kubernetes Deployment](kubernetes-deployment.md)** - Container orchestration
   - Pod specifications and deployments
   - Service networking and ingress
   - Resource allocation and scaling

4. **[gRPC Communication Patterns](grpc-communication-patterns.md)** - Communication details
   - 4 types of gRPC calls (Unary, Server Streaming, Client Streaming, Bidirectional)
   - Protocol buffer definitions
   - Message examples and use cases

5. **[System Interactions](system-interactions.md)** - Data flow and communication
   - Sequence diagrams
   - Service communication patterns
   - Performance comparison matrix

## 🎯 Project Objectives

Based on the PDF specification, this project aims to:

1. **Study gRPC Framework**
   - Understand Protocol Buffers and HTTP/2
   - Implement all 4 gRPC communication patterns
   - Compare with traditional REST/JSON approaches

2. **Build Distributed Application**
   - Module P: API Gateway with gRPC stub and web server
   - Module A: QR Code Generator (gRPC service)
   - Module B: URL Shortener (gRPC service)
   - Extended: User Management and Analytics (REST services)

3. **Deploy on Kubernetes**
   - Containerize all services
   - Configure minikube environment
   - Implement service discovery and networking

## 🏛️ System Architecture Overview

```
Web Client (HClient)
    ↓ HTTP/HTTPS
API Gateway (Pod P)
    ↓ gRPC/HTTP2        ↓ REST/HTTP1.1
gRPC Services        REST Services
├── QR Generator     ├── User Management
└── URL Shortener    └── Analytics Dashboard
    ↓                    ↓
Database Layer (PostgreSQL, Redis, MinIO)
```

## 📊 Technology Stack

### gRPC Services
- **Protocol**: HTTP/2 with Protocol Buffers
- **Languages**: Different languages per service (as required)
- **Features**: Binary serialization, streaming support, type safety

### REST Services
- **Protocol**: HTTP/1.1 with JSON
- **Standards**: RESTful APIs, standard HTTP methods
- **Features**: Human-readable, wide compatibility, caching support

### Infrastructure
- **Orchestration**: Kubernetes (minikube for development)
- **Database**: PostgreSQL for persistent data
- **Cache**: Redis for sessions and temporary data
- **Storage**: MinIO for file storage
- **Monitoring**: Prometheus, Grafana, Jaeger

## 🔄 Communication Flows

### gRPC Communication (High Performance)
- **QR Generator**: Unary calls for single QR codes, streaming for batch processing
- **URL Shortener**: Unary calls for shortening, streaming for analytics

### REST Communication (Wide Compatibility)
- **User Management**: Standard CRUD operations
- **Analytics Dashboard**: Data aggregation and reporting

## 🚀 Getting Started

1. Review the architectural diagrams in order:
   - Start with `main-architecture.md` for basic understanding
   - Move to `extended-architecture.md` for the full system
   - Study `kubernetes-deployment.md` for deployment details

2. Understand communication patterns:
   - Review `grpc-communication-patterns.md` for gRPC details
   - Analyze `system-interactions.md` for data flows

3. Implementation phases follow the PROJECT_PLAN.md structure

## 📋 Requirements Compliance

This architecture satisfies all PDF requirements:

✅ **gRPC Framework Study**: All 4 communication patterns documented
✅ **3-Module System**: P (Gateway), A (QR), B (URL) implemented
✅ **Different Languages**: Services can use different programming languages
✅ **Web Interface**: HTTP frontend with gRPC backend translation
✅ **Kubernetes Deployment**: Container-based deployment with minikube
✅ **Performance Comparison**: gRPC vs REST analysis included

## 🔧 Next Steps

1. Implement Protocol Buffer definitions
2. Develop individual microservices
3. Create API Gateway with dual protocol support
4. Set up Kubernetes manifests
5. Implement monitoring and observability
6. Conduct performance testing and comparison

## 📚 Related Files

- `PROJECT_PLAN.md` - Detailed implementation phases
- `PSPD_LabVirtualizacao_gRPC_2025_2.pdf` - Original requirements specification