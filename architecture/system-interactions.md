# System Interactions and Data Flow

## Complete System Interaction Flow

```mermaid
sequenceDiagram
    participant Client as Web Client
    participant Gateway as API Gateway
    participant QR as QR Service (gRPC)
    participant URL as URL Service (gRPC)
    participant User as User Service (REST)
    participant Analytics as Analytics Service (REST)
    participant DB as Database
    participant Cache as Redis Cache

    %% User Authentication Flow
    Client->>Gateway: POST /auth/login
    Gateway->>User: HTTP POST /users/authenticate
    User->>DB: Query user credentials
    DB-->>User: User data
    User->>Cache: Store session
    User-->>Gateway: JWT Token
    Gateway-->>Client: Authentication response

    %% QR Code Generation Flow
    Client->>Gateway: POST /qr/generate
    Gateway->>QR: gRPC GenerateQR()
    QR->>Cache: Check cache
    alt Cache miss
        QR->>DB: Store QR metadata
        QR->>QR: Generate QR code
        QR->>Cache: Cache result
    end
    QR-->>Gateway: QR image data
    Gateway->>Analytics: HTTP POST /analytics/track
    Analytics->>DB: Store analytics event
    Gateway-->>Client: QR code response

    %% URL Shortening Flow
    Client->>Gateway: POST /url/shorten
    Gateway->>URL: gRPC ShortenURL()
    URL->>DB: Check URL exists
    alt URL exists
        URL->>Cache: Get cached short URL
    else New URL
        URL->>URL: Generate short code
        URL->>DB: Store URL mapping
        URL->>Cache: Cache mapping
    end
    URL-->>Gateway: Short URL
    Gateway->>Analytics: HTTP POST /analytics/track
    Analytics->>DB: Store analytics event
    Gateway-->>Client: Short URL response

    %% Analytics Dashboard Flow
    Client->>Gateway: GET /analytics/dashboard
    Gateway->>Analytics: HTTP GET /analytics/summary
    Analytics->>DB: Query aggregated data
    DB-->>Analytics: Analytics data
    Analytics->>Cache: Cache results
    Analytics-->>Gateway: Dashboard data
    Gateway-->>Client: Dashboard response

    %% Real-time Updates (Server Streaming)
    Client->>Gateway: GET /qr/batch-progress
    Gateway->>QR: gRPC GenerateQRBatch()
    loop Batch processing
        QR->>DB: Process item
        QR-->>Gateway: Progress update
        Gateway-->>Client: SSE progress event
    end
```

## Service Communication Patterns

### gRPC Service Communication

```mermaid
flowchart LR
    subgraph "gRPC Communication (HTTP/2)"
        direction TB

        subgraph "Unary Calls"
            A1[GenerateQR] --> A2[ShortenURL]
        end

        subgraph "Streaming Calls"
            B1[BatchQRGeneration]
            B2[ClickStatistics]
        end

        subgraph "Protocol Buffers"
            C1[Binary Serialization]
            C2[Type Safety]
            C3[Code Generation]
        end
    end

    subgraph "Advantages"
        D1[Low Latency]
        D2[High Throughput]
        D3[Built-in Authentication]
        D4[Bidirectional Streaming]
    end

    A1 --> C1
    A2 --> C1
    B1 --> C2
    B2 --> C2
    C1 --> D1
    C2 --> D2
```

### REST Service Communication

```mermaid
flowchart LR
    subgraph "REST Communication (HTTP/1.1)"
        direction TB

        subgraph "HTTP Methods"
            A1[GET /users]
            A2[POST /analytics]
            A3[PUT /users/:id]
            A4[DELETE /sessions]
        end

        subgraph "JSON Payloads"
            B1[Text-based]
            B2[Human Readable]
            B3[Schema Validation]
        end

        subgraph "Status Codes"
            C1[200 OK]
            C2[201 Created]
            C3[400 Bad Request]
            C4[401 Unauthorized]
        end
    end

    subgraph "Advantages"
        D1[Wide Compatibility]
        D2[Easy Debugging]
        D3[Caching Support]
        D4[Stateless]
    end

    A1 --> B1
    A2 --> B2
    A3 --> C1
    A4 --> C2
    B1 --> D1
    B2 --> D2
```

## Data Flow Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser]
        Mobile[Mobile App]
        API[API Client]
    end

    subgraph "Gateway Layer"
        LoadBalancer[Load Balancer]
        RateLimit[Rate Limiter]
        Auth[Authentication]
        Transform[Data Transform]
    end

    subgraph "Service Layer"
        subgraph "gRPC Services"
            QRService[QR Generator<br/>Port: 50051]
            URLService[URL Shortener<br/>Port: 50052]
        end

        subgraph "REST Services"
            UserService[User Management<br/>Port: 8080]
            AnalyticsService[Analytics Dashboard<br/>Port: 8081]
        end
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Primary Data)]
        Redis[(Redis<br/>Cache & Sessions)]
        MinIO[(MinIO<br/>File Storage)]
    end

    subgraph "External Services"
        Monitoring[Prometheus<br/>Metrics]
        Logging[ELK Stack<br/>Logs]
        Tracing[Jaeger<br/>Distributed Tracing]
    end

    %% Client to Gateway
    Web --> LoadBalancer
    Mobile --> LoadBalancer
    API --> LoadBalancer

    %% Gateway processing
    LoadBalancer --> RateLimit
    RateLimit --> Auth
    Auth --> Transform

    %% Service routing
    Transform -.->|gRPC/HTTP2| QRService
    Transform -.->|gRPC/HTTP2| URLService
    Transform -.->|REST/HTTP1.1| UserService
    Transform -.->|REST/HTTP1.1| AnalyticsService

    %% Data access
    QRService --> PostgreSQL
    URLService --> PostgreSQL
    UserService --> PostgreSQL
    AnalyticsService --> PostgreSQL

    QRService --> Redis
    URLService --> Redis
    UserService --> Redis
    AnalyticsService --> Redis

    QRService --> MinIO

    %% Observability
    QRService -.-> Monitoring
    URLService -.-> Monitoring
    UserService -.-> Monitoring
    AnalyticsService -.-> Monitoring

    QRService -.-> Logging
    URLService -.-> Logging
    UserService -.-> Logging
    AnalyticsService -.-> Logging

    QRService -.-> Tracing
    URLService -.-> Tracing
    UserService -.-> Tracing
    AnalyticsService -.-> Tracing

    %% Styling
    classDef client fill:#e1f5fe
    classDef gateway fill:#e8eaf6
    classDef grpc fill:#e8f5e8
    classDef rest fill:#fff3e0
    classDef data fill:#fce4ec
    classDef external fill:#f1f8e9

    class Web,Mobile,API client
    class LoadBalancer,RateLimit,Auth,Transform gateway
    class QRService,URLService grpc
    class UserService,AnalyticsService rest
    class PostgreSQL,Redis,MinIO data
    class Monitoring,Logging,Tracing external
```

## Performance Comparison Matrix

| Aspect | gRPC Services | REST Services |
|--------|---------------|---------------|
| **Protocol** | HTTP/2, Binary | HTTP/1.1, Text |
| **Serialization** | Protocol Buffers | JSON |
| **Performance** | High throughput, Low latency | Moderate performance |
| **Streaming** | Native support | Limited (SSE, WebSocket) |
| **Browser Support** | Requires gRPC-Web | Native |
| **Debugging** | Binary format (tools needed) | Human readable |
| **Schema Evolution** | Backward/Forward compatible | Manual versioning |
| **Code Generation** | Multi-language support | Manual client creation |

## Service Communication Matrix

```mermaid
graph TB
    subgraph "Communication Matrix"
        QR[QR Service<br/>gRPC]
        URL[URL Service<br/>gRPC]
        User[User Service<br/>REST]
        Analytics[Analytics Service<br/>REST]
    end

    %% Inter-service communication
    QR -.->|Analytics Events| Analytics
    URL -.->|Analytics Events| Analytics
    User -.->|User Context| QR
    User -.->|User Context| URL
    Analytics -.->|Usage Reports| User

    %% Communication patterns
    QR -.->|Optional Direct| URL
    URL -.->|Optional Direct| QR

    %% Labels
    QR -.- QRLabel[gRPC/Protobuf<br/>Binary, Streaming<br/>High Performance]
    URL -.- URLLabel[gRPC/Protobuf<br/>Binary, Streaming<br/>High Performance]
    User -.- UserLabel[REST/JSON<br/>Text, Standard HTTP<br/>Wide Compatibility]
    Analytics -.- AnalyticsLabel[REST/JSON<br/>Text, Standard HTTP<br/>Caching Friendly]

    classDef grpc fill:#e8f5e8
    classDef rest fill:#fff3e0
    classDef label fill:#f5f5f5

    class QR,URL grpc
    class User,Analytics rest
    class QRLabel,URLLabel,UserLabel,AnalyticsLabel label
```