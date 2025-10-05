# PSPD Lab - gRPC Kubernetes 2025

## 🏗️ Arquitetura

- **MicroserviceA_LinkShortener**: Serviço para encurtamento de URLs
- **MicroserviceB_QRCode**: Serviço para geração de QR Codes

## 🚀 Como Executar

### Pré-requisitos
- Docker instalado
- PowerShell (ou terminal de sua preferência)

### 1. Build e Execução do MicroserviceA (Link Shortener)

```powershell
cd .\MicroserviceA_LinkShortener\
docker build -t microservicea -f MicroserviceA_LinkShortener/Dockerfile .
docker run -d -p 8080:80 --name link-shortener microservicea
```

### 2. Build e Execução do MicroserviceB (QRCode)

```powershell
cd .\MicroserviceB_QRCode\
docker build -t microserviceb -f .\MicroserviceB_QRCode\Dockerfile .
docker run -d -p 8081:81 --name qrcode microserviceb
```

Ao final, verifique a execução dos serviços com:

```powershell
docker ps
```

### 3. Execução kubernets
```powershell
kubectl apply -f deployments.yaml
```

```powershell
kubectl apply -f services.yaml
```

minikube image load microservicea:latest
minikube image load microserviceb:latest
minikube image load analytics-rest:latest
minikube image load qr-generator-rest:latest
minikube image load url-shortener-rest:latest

kubectl delete -f deployment.yaml
kubectl apply -f deployment.yaml

kubectl get pods