Configurando o kubernets
```bash
kubectl apply -f k8s/config/configmap.yaml
```

```bash
kubectl apply -f k8s/deployments

```

```bash
kubectl apply -f k8s/services
```

Limpando o kubernets
```bash
kubectl delete -f k8s/services/
```
```bash
kubectl delete -f k8s/deployments/
```
```bash
kubectl delete -f k8s/config/configmap.yaml
```


# View everything
kubectl get all

# View pods
kubectl get pods
kubectl get pods -o wide  # with more details
kubectl get pods -w       # watch mode

# View services
kubectl get services

# View deployments
kubectl get deployments

# Filter by labels
kubectl get pods -l service-type=grpc
kubectl get pods -l service-type=rest
kubectl get pods -l tier=frontend