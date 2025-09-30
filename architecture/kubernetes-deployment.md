# Kubernetes Deployment Architecture

```mermaid
graph TB
    subgraph "External Network"
        HClient[HClient<br/>Desktop Browser]
    end

    subgraph "Kubernetes Cluster (HServ - Linux Host)"
        subgraph "Ingress Layer"
            Ingress[Ingress Controller<br/>NGINX/Traefik]
        end

        subgraph "Main Service Deployment"
            subgraph "main-service-pod"
                MainContainer[Main Service Container<br/>API Gateway]
                MainPort[Port: 3000]
            end
            MainService[main-service<br/>ClusterIP Service]
        end

        subgraph "gRPC Services Deployment"
            subgraph "qr-service-pod"
                QrContainer[QR Generator Container<br/>gRPC Server A]
                QrPort[Port: 50051]
            end
            QrService[qr-service<br/>ClusterIP Service]

            subgraph "url-service-pod"
                UrlContainer[URL Shortener Container<br/>gRPC Server B]
                UrlPort[Port: 50052]
            end
            UrlService[url-service<br/>ClusterIP Service]
        end

        subgraph "REST Services Deployment"
            subgraph "user-service-pod"
                UserContainer[User Management Container<br/>REST Server C]
                UserPort[Port: 8080]
            end
            UserService[user-service<br/>ClusterIP Service]

            subgraph "analytics-service-pod"
                AnalyticsContainer[Analytics Container<br/>REST Server D]
                AnalyticsPort[Port: 8081]
            end
            AnalyticsService[analytics-service<br/>ClusterIP Service]
        end

        subgraph "Data Layer"
            subgraph "database-pod"
                DatabaseContainer[PostgreSQL Container]
                DbPort[Port: 5432]
            end
            DatabaseService[database-service<br/>ClusterIP Service]

            subgraph "cache-pod"
                CacheContainer[Redis Container]
                CachePort[Port: 6379]
            end
            CacheService[cache-service<br/>ClusterIP Service]

            subgraph "storage-pod"
                StorageContainer[MinIO Container]
                StoragePort[Port: 9000]
            end
            StorageService[storage-service<br/>ClusterIP Service]
        end

        subgraph "ConfigMaps & Secrets"
            ConfigMap[ConfigMap<br/>app-config]
            Secret[Secret<br/>db-credentials]
        end
    end

    %% External connections
    HClient -->|HTTP/HTTPS| Ingress
    Ingress -->|Route /| MainService

    %% Service to Pod connections
    MainService --> MainContainer
    QrService --> QrContainer
    UrlService --> UrlContainer
    UserService --> UserContainer
    AnalyticsService --> AnalyticsContainer
    DatabaseService --> DatabaseContainer
    CacheService --> CacheContainer
    StorageService --> StorageContainer

    %% Inter-service communication (Internal Network - HTTP/2)
    MainContainer -->|gRPC| QrService
    MainContainer -->|gRPC| UrlService
    MainContainer -->|HTTP| UserService
    MainContainer -->|HTTP| AnalyticsService

    %% Data layer connections
    QrContainer --> DatabaseService
    UrlContainer --> DatabaseService
    UserContainer --> DatabaseService
    AnalyticsContainer --> DatabaseService

    QrContainer --> CacheService
    UrlContainer --> CacheService
    UserContainer --> CacheService
    AnalyticsContainer --> CacheService

    QrContainer --> StorageService

    %% Configuration connections
    MainContainer -.-> ConfigMap
    MainContainer -.-> Secret
    QrContainer -.-> ConfigMap
    UrlContainer -.-> ConfigMap
    UserContainer -.-> ConfigMap
    AnalyticsContainer -.-> ConfigMap
    DatabaseContainer -.-> Secret
    CacheContainer -.-> ConfigMap

    %% Styling
    classDef external fill:#e1f5fe
    classDef ingress fill:#e8eaf6
    classDef mainService fill:#f3e5f5
    classDef grpcService fill:#e8f5e8
    classDef restService fill:#fff3e0
    classDef dataLayer fill:#fce4ec
    classDef config fill:#f1f8e9

    class HClient external
    class Ingress ingress
    class MainContainer,MainService,MainPort mainService
    class QrContainer,QrService,QrPort,UrlContainer,UrlService,UrlPort grpcService
    class UserContainer,UserService,UserPort,AnalyticsContainer,AnalyticsService,AnalyticsPort restService
    class DatabaseContainer,DatabaseService,DbPort,CacheContainer,CacheService,CachePort,StorageContainer,StorageService,StoragePort dataLayer
    class ConfigMap,Secret config
```

## Kubernetes Resources

### Namespaces
- **default**: Main application components
- **monitoring**: Observability stack (optional)

### Deployments
- **main-service**: 2 replicas, rolling updates
- **qr-service**: 3 replicas, auto-scaling enabled
- **url-service**: 3 replicas, auto-scaling enabled
- **user-service**: 2 replicas, rolling updates
- **analytics-service**: 2 replicas, rolling updates
- **database**: 1 replica, persistent volume
- **cache**: 1 replica, ephemeral storage
- **storage**: 1 replica, persistent volume

### Services
- **ClusterIP**: Internal service-to-service communication
- **NodePort**: External access during development
- **LoadBalancer**: Production external access

### Network Policies
- **External Network**: HTTP/HTTPS from clients
- **Internal Network**: gRPC (HTTP/2) and REST (HTTP/1.1)
- **Data Network**: Database and cache connections

## Container Specifications

### Main Service Container
```yaml
image: main-service:latest
ports:
  - containerPort: 3000
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### gRPC Service Containers
```yaml
# QR Service
image: qr-service:latest
ports:
  - containerPort: 50051
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"

# URL Service
image: url-service:latest
ports:
  - containerPort: 50052
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```

### REST Service Containers
```yaml
# User Service
image: user-service:latest
ports:
  - containerPort: 8080
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "512Mi"
    cpu: "400m"

# Analytics Service
image: analytics-service:latest
ports:
  - containerPort: 8081
resources:
  requests:
    memory: "512Mi"
    cpu: "300m"
  limits:
    memory: "1Gi"
    cpu: "600m"
```