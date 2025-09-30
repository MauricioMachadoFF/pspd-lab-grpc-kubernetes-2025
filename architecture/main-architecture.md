# Main Architecture - Original PDF Requirements

![Main Architecture](../assets/architecture/main-architecture-3module.png)

```mermaid
graph TB
    subgraph "External Network"
        Client[Web Client<br/>Browser]
    end

    subgraph "Kubernetes Cluster (HServ)"
        subgraph "Pod P - Main Service"
            WebServer[Web Server<br/>Express/FastAPI]
            GrpcStub[gRPC Stub<br/>Client]
            RestAPI[REST API<br/>Gateway]
        end

        subgraph "Pod A - QR Code Generator"
            GrpcServerA[gRPC Server A<br/>QR Code Service]
            QrLogic[QR Generation Logic]
        end

        subgraph "Pod B - URL Shortener"
            GrpcServerB[gRPC Server B<br/>URL Shortener Service]
            UrlLogic[URL Shortening Logic]
        end
    end

    %% External connections
    Client -.->|HTTP/HTTPS| WebServer

    %% Internal gRPC connections
    GrpcStub -->|Proto Request| GrpcServerA
    GrpcServerA -->|Proto Response| GrpcStub

    GrpcStub -->|Proto Request| GrpcServerB
    GrpcServerB -->|Proto Response| GrpcStub

    %% Optional inter-service communication
    GrpcServerA -.->|Optional| GrpcServerB
    GrpcServerB -.->|Optional| GrpcServerA

    %% Internal connections within Pod P
    WebServer <--> RestAPI
    RestAPI <--> GrpcStub

    %% Internal connections within services
    GrpcServerA <--> QrLogic
    GrpcServerB <--> UrlLogic

    %% Styling
    classDef external fill:#e1f5fe
    classDef mainService fill:#f3e5f5
    classDef grpcService fill:#e8f5e8

    class Client external
    class WebServer,GrpcStub,RestAPI mainService
    class GrpcServerA,QrLogic,GrpcServerB,UrlLogic grpcService
```

## Architecture Components

### Module P (Main Service)
- **Web Server**: Handles HTTP requests from browsers
- **REST API Gateway**: Translates REST requests to gRPC calls
- **gRPC Stub**: Client that communicates with microservices A and B

### Module A (QR Code Generator)
- **gRPC Server A**: Provides QR code generation services
- **QR Generation Logic**: Core business logic for QR code creation

### Module B (URL Shortener)
- **gRPC Server B**: Provides URL shortening services
- **URL Shortening Logic**: Core business logic for URL management

## Communication Patterns
- **External**: HTTP/HTTPS from web clients
- **Internal**: gRPC over HTTP/2 between services
- **Optional**: Inter-service gRPC communication between A and B