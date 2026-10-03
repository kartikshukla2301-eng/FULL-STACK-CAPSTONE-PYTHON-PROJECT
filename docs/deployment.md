# TaskFlow Pro - Deployment Manual

This guide outlines containerized deployment using Docker Compose, Kubernetes, and AWS infrastructure.

---

## 🐳 1. Docker Compose (Single Host Production)

Run the full stack with isolated PostgreSQL and Redis volumes:

```bash
docker-compose -f docker-compose.yml up -d --build
```

---

## ☸️ 2. Kubernetes Cluster Deployment

Deploy manifests to your target K8s cluster (EKS, GKE, or Minikube):

```bash
kubectl apply -f infrastructure/kubernetes/postgres-deployment.yaml
kubectl apply -f infrastructure/kubernetes/redis-deployment.yaml
kubectl apply -f infrastructure/kubernetes/backend-deployment.yaml
kubectl apply -f infrastructure/kubernetes/frontend-deployment.yaml
kubectl apply -f infrastructure/kubernetes/ingress.yaml
```

---

## 🏗️ 3. Terraform Cloud Provisioning

Initialize and provision AWS resources (VPC, RDS PostgreSQL, ElastiCache Redis):

```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```
