# 💡 Comandos e Dicas de Gerenciamento de Ambiente


## 1\. Limpeza Completa (Hard Reset)

Remove **imagens, containers e cache** do Docker, além de apagar o cluster Minikube.

```bash
docker system prune -a
minikube delete
```

-----

## 2\. Limpeza Leve (Kubernetes)

Remove apenas os recursos do Kubernetes (**Deployments** e **Services**), sem apagar o cluster Minikube.

```bash
kubectl delete -f k8s/services/
kubectl delete -f k8s/deployments/
kubectl delete -f k8s/config/configmap.yaml
```

-----

## 3\. Reconfigurando o Ambiente (Step-by-Step)

Suba o ambiente novamente, etapa por etapa.

```bash
minikube start
eval $(minikube docker-env)
docker compose build
kubectl apply -f k8s/config/configmap.yaml
kubectl apply -f k8s/deployments
kubectl apply -f k8s/services
```

-----

## 4\. Comandos Úteis de Visualização

| Ação | Comando |
| :--- | :--- |
| **Visualizar todos os recursos** | `kubectl get all` |
| Ver **Pods** | `kubectl get pods` |
| Ver **Pods** (detalhado) | `kubectl get pods -o wide` |
| Ver **Pods** (modo observação) | `kubectl get pods -w` |
| Ver **Services** | `kubectl get services` |
| Ver **Deployments** | `kubectl get deployments` |

### Filtragem por Labels

| Recurso | Comando |
| :--- | :--- |
| **Pods** (tipo `grpc`) | `kubectl get pods -l service-type=grpc` |
| **Pods** (tipo `rest`) | `kubectl get pods -l service-type=rest` |
| **Pods** (tier `frontend`) | `kubectl get pods -l tier=frontend` |

-----

## 5\. Logs e Depuração

Exibir logs de um pod específico:

```bash
kubectl logs web-client-5b7b48f585-pk5dq
```

-----

## 6\. Limpeza Geral Rápida

| Ação | Comando | **Atenção** |
| :--- | :--- | :--- |
| Apagar **todos** os recursos (sem excluir o cluster) | `kubectl delete all --all` | Não remove ConfigMaps/Secrets |
| Limpeza mais **completa** (inclui **ConfigMaps**, **Secrets** e **PVCs**) | `kubectl delete all,cm,secret,pvc --all` | Recomendado para um reset total |
| **Excluir tudo**, incluindo **Namespaces** | `kubectl delete all --all --all-namespaces` | **MUITO CUIDADO\!** |

-----

## 7\. Acessar Serviços

Exibir a URL para acessar um serviço no Minikube:

```bash
minikube service web-client --url
```

-----

## 8\. Erros Comuns e Soluções Rápidas

| Erro Comum | Status do Pod | Causa Mais Comum | Solução Rápida |
| :--- | :--- | :--- | :--- |
| **Falha ao puxar a imagem** | `ErrImageNeverPull` / `ImagePullBackOff` | Imagem não existe, nome errado ou Minikube não está usando o Docker local (`eval $(minikube docker-env)`). | 1. Verifique o nome da imagem no YAML. 2. **Execute:** `eval $(minikube docker-env)`. 3. Execute: `docker compose build`. |
| **Pod Reiniciando em Loop** | `CrashLoopBackOff` | O container iniciou, mas o processo principal parou logo em seguida (erro na aplicação, dependência faltando, porta em uso, etc.). | **Verifique os logs:** `kubectl logs <nome-do-pod>`. O erro real estará lá. |
| **Pod Pendente** | `Pending` | Não há recursos suficientes no cluster (CPU/Memória) ou imagem não pôde ser baixada. | 1. Aumente os recursos do Minikube: `minikube start --memory 4096`. 2. Verifique o evento: `kubectl describe pod <nome-do-pod>`. |
| **Serviço não responde** | `None` (Serviço) | O seletor (**`selector`**) do Service não está encontrando os Pods com a Label correta. | **Verifique o `selector`** no YAML do Service e confira as **`labels`** no Deployment/Pod. |