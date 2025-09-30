# Extended Architecture - 4 Microservices (2 REST + 2 gRPC)

![Extended Architecture](../assets/architecture/extended-architecture-4microservices.png)

```mermaid
flowchart TB
    subgraph "External Network"
        Client[Web Client<br/>Browser]
    end

    subgraph "Kubernetes Cluster"
        subgraph "Main Service Pod"
            WebServer[Web Server<br/>Express/FastAPI]
            RestGateway[REST API Gateway]
            GrpcStub[gRPC Client Stub]
            LoadBalancer[Load Balancer<br/>Service Discovery]
        end

        subgraph "gRPC Microservices"
            subgraph "Pod A - QR Code Generator"
                GrpcServerA[gRPC Server A<br/>QR Code Service]
                QrProcessor[QR Code Processor]
                QrStorage[QR Code Storage]
            end

            subgraph "Pod B - URL Shortener"
                GrpcServerB[gRPC Server B<br/>URL Shortener Service]
                UrlProcessor[URL Processor]
                UrlAnalytics[URL Analytics]
            end
        end

        subgraph "REST/JSON Microservices"
            subgraph "Pod C - User Management"
                RestServerC[REST Server C<br/>User Management API]
                UserAuth[Authentication Service]
                UserProfiles[User Profile Manager]
            end

            subgraph "Pod D - Analytics Dashboard"
                RestServerD[REST Server D<br/>Analytics API]
                DataProcessor[Data Processor]
                ReportGenerator[Report Generator]
            end
        end

        subgraph "Data Layer"
            Database[(Database<br/>PostgreSQL/MongoDB)]
            Cache[(Redis Cache)]
            FileStorage[(File Storage<br/>MinIO/S3)]
        end
    end

    %% External connections
    Client -.->|HTTP/HTTPS| WebServer

    %% Main service internal connections
    WebServer <--> RestGateway
    WebServer <--> GrpcStub
    RestGateway <--> LoadBalancer
    GrpcStub <--> LoadBalancer

    %% Load balancer routing
    LoadBalancer -->|gRPC| GrpcServerA
    LoadBalancer -->|gRPC| GrpcServerB
    LoadBalancer -->|HTTP/REST| RestServerC
    LoadBalancer -->|HTTP/REST| RestServerD

    %% gRPC service internal connections
    GrpcServerA <--> QrProcessor
    QrProcessor <--> QrStorage
    GrpcServerB <--> UrlProcessor
    UrlProcessor <--> UrlAnalytics

    %% REST service internal connections
    RestServerC <--> UserAuth
    UserAuth <--> UserProfiles
    RestServerD <--> DataProcessor
    DataProcessor <--> ReportGenerator

    %% Inter-service communication
    GrpcServerA -.->|Analytics Data| RestServerD
    GrpcServerB -.->|Analytics Data| RestServerD
    RestServerC -.->|User Context| GrpcServerA
    RestServerC -.->|User Context| GrpcServerB

    %% Data layer connections
    QrStorage <--> Database
    UrlAnalytics <--> Database
    UserProfiles <--> Database
    ReportGenerator <--> Database

    QrProcessor <--> Cache
    UrlProcessor <--> Cache
    UserAuth <--> Cache
    DataProcessor <--> Cache

    QrStorage <--> FileStorage

    %% Styling
    classDef external fill:#e1f5fe
    classDef mainService fill:#f3e5f5
    classDef grpcService fill:#e8f5e8
    classDef restService fill:#fff3e0
    classDef dataLayer fill:#fce4ec

    class Client external
    class WebServer,RestGateway,GrpcStub,LoadBalancer mainService
    class GrpcServerA,QrProcessor,QrStorage,GrpcServerB,UrlProcessor,UrlAnalytics grpcService
    class RestServerC,UserAuth,UserProfiles,RestServerD,DataProcessor,ReportGenerator restService
    class Database,Cache,FileStorage dataLayer
```

## Service Breakdown

### Main Service (Gateway)
- **Web Server**: Frontend interface and HTTP handling
- **REST API Gateway**: Routes REST requests to appropriate services
- **gRPC Client Stub**: Handles gRPC communication
- **Load Balancer**: Service discovery and request distribution

### gRPC Microservices (Protocol Buffers)

#### Service A - QR Code Generator
- **Port**: 50051
- **Protocol**: gRPC/HTTP2
- **Features**: QR code generation, format conversion, batch processing
- **Data**: Stores generated QR codes and metadata

#### Service B - URL Shortener
- **Port**: 50052
- **Protocol**: gRPC/HTTP2
- **Features**: URL shortening, redirect handling, click tracking
- **Data**: URL mappings and analytics

### REST/JSON Microservices

#### Service C - User Management
- **Port**: 8080
- **Protocol**: REST/HTTP
- **Features**: User authentication, profile management, permissions
- **Data**: User accounts, sessions, preferences

#### Service D - Analytics Dashboard
- **Port**: 8081
- **Protocol**: REST/HTTP
- **Features**: Data aggregation, reporting, dashboard APIs
- **Data**: Analytics data, reports, metrics

## Communication Patterns

### gRPC Communication
- Unary RPCs for simple request-response
- Server streaming for real-time updates
- Client streaming for batch operations
- Bidirectional streaming for interactive features

### REST Communication
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON payload format
- RESTful resource-based URLs
- Standard HTTP status codes