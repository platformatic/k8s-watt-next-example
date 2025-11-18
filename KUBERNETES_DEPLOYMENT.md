# Kubernetes Deployment Guide for Next.js App

This guide will walk you through deploying your Next.js application on a local Kubernetes cluster, exposing it on port 32100.

## Prerequisites

- A local Kubernetes cluster running (minikube, kind, k3s, Docker Desktop with Kubernetes, etc.)
- `kubectl` installed and configured to connect to your cluster
- `helm` installed (for deploying Valkey and Prometheus)
- Docker installed (for building the container image)
- `docker` command accessible in your terminal

## Step-by-Step Deployment Guide

### Step 1: Verify Kubernetes Cluster is Running

First, verify that your Kubernetes cluster is accessible:

```bash
kubectl cluster-info
kubectl get nodes
```

You should see your cluster information and at least one node in `Ready` status.

### Step 2: Deploy Valkey with Helm

Valkey is a Redis-compatible in-memory data store. Deploy it using Helm:

```bash
helm upgrade --install valkey oci://registry-1.docker.io/cloudpirates/valkey \
  --values=helm/valkey-overrides.yaml \
  --version=0.3.2
```

**Note**: If you need to specify a specific Kubernetes context, add the `--kube-context` flag:

```bash
helm upgrade --install valkey oci://registry-1.docker.io/cloudpirates/valkey \
  --values=helm/valkey-overrides.yaml \
  --version=0.3.2 \
  --kube-context=docker-desktop
```

Verify that Valkey is deployed:

```bash
kubectl get pods -l app.kubernetes.io/name=valkey
kubectl get services -l app.kubernetes.io/name=valkey
```

Wait until the Valkey pod shows `Running` status and is `1/1` ready.

### Step 3: Deploy Prometheus Operator (kube-prometheus-stack) with Helm

Prometheus Operator provides native Kubernetes integration for Prometheus monitoring. Deploy it using Helm:

First, add the Prometheus community Helm repository:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

Deploy Prometheus Operator (kube-prometheus-stack):

```bash
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --values=helm/prometheus-overrides.yaml \
  --namespace=monitoring \
  --create-namespace
```

**Note**: If you need to specify a specific Kubernetes context, add the `--kube-context` flag:

```bash
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
  --values=helm/prometheus-overrides.yaml \
  --namespace=monitoring \
  --create-namespace \
  --kube-context=docker-desktop
```

Verify that Prometheus Operator is deployed:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=prometheus
kubectl get services -n monitoring -l app.kubernetes.io/name=prometheus
kubectl get podmonitors -n monitoring
```

Wait until the Prometheus pod shows `Running` status and is ready.

The Prometheus dashboard will be available on port 30090 once the service is ready.

### Step 4: Build the Docker Image

Navigate to the project root directory:

```bash
cd /Users/leonardo/Workspace/platformatic.dev/watt-next/next-app
```

Build the Docker image. The method depends on your Kubernetes setup:

#### Option A: Using Docker Desktop or Local Docker

If you're using Docker Desktop or a local Docker daemon:

```bash
docker build -t next-app:latest .
```

#### Option B: Using Minikube

If you're using Minikube, you need to use Minikube's Docker daemon:

```bash
eval $(minikube docker-env)
docker build -t next-app:latest .
```

#### Option C: Using Kind

If you're using Kind, load the image into the cluster:

```bash
docker build -t next-app:latest .
kind load docker-image next-app:latest
```

### Step 5: Verify the Image was Built

Check that the image exists:

```bash
docker images | grep next-app
```

You should see `next-app:latest` in the list.

### Step 6: Deploy Next.js App to Kubernetes

Apply the Kubernetes manifests:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/podMonitor.yaml
```

Alternatively, you can apply all manifests at once:

```bash
kubectl apply -f k8s/
```

**Note**: The PodMonitor resource (`k8s/podMonitor.yaml`) enables Prometheus Operator to automatically discover and scrape metrics from your Next.js app pods. Make sure Prometheus Operator is deployed (Step 3) before applying the PodMonitor.



### Step 7: Verify Deployment

Check that the deployment was created successfully:

```bash
kubectl get deployments
```

You should see `next-app` with the desired number of replicas.

Check the pods:

```bash
kubectl get pods -l app=next-app
```

Wait until all pods show `Running` status and are `1/1` ready. This may take a minute or two while the containers start.

### Step 8: Verify Service

Check that the service was created:

```bash
kubectl get services
```

You should see `next-app-service` with type `NodePort` and port `32100:3000/TCP`.

### Step 9: Access the Application

The application is now accessible on port 32100. The exact URL depends on your Kubernetes setup:

#### Option A: Docker Desktop or Local Cluster

Access via `localhost`:

```bash
curl http://localhost:32100
```

Or open in your browser:
```
http://localhost:32100
```

#### Option B: Minikube

Get the Minikube IP and access via that IP:

```bash
minikube ip
# Use the returned IP, e.g., http://192.168.49.2:32100
```

Or use Minikube's service command:

```bash
minikube service next-app-service
```

#### Option C: Kind or Other Clusters

If your cluster doesn't expose NodePort on localhost, you may need to:

1. Find your node's IP:
   ```bash
   kubectl get nodes -o wide
   ```

2. Access via the node IP on port 32100:
   ```
   http://<NODE_IP>:32100
   ```

### Step 10: View Logs (Optional)

To view application logs:

```bash
# View logs from all pods
kubectl logs -l app=next-app

# View logs from a specific pod
kubectl logs <pod-name>

# Follow logs in real-time
kubectl logs -f -l app=next-app
```

### Step 11: Access Prometheus Dashboard

The Prometheus dashboard is accessible on port 30090. The exact URL depends on your Kubernetes setup:

#### Option A: Docker Desktop or Local Cluster

Access via `localhost`:

```bash
curl http://localhost:30090
```

Or open in your browser:
```
http://localhost:30090
```

#### Option B: Minikube

Get the Minikube IP and access via that IP:

```bash
minikube ip
# Use the returned IP, e.g., http://192.168.49.2:30090
```

Or use Minikube's service command:

```bash
minikube service prometheus-server
```

#### Option C: Kind or Other Clusters

Access via the node IP on port 30090:
```
http://<NODE_IP>:30090
```

### Step 12: Check Service Details

Get detailed information about the service:

```bash
kubectl describe service next-app-service
```

This will show you the service endpoints and port mappings.

## Troubleshooting

### Pods Not Starting

If pods are not starting, check their status:

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

Common issues:
- **ImagePullBackOff**: The image wasn't found. Make sure you built the image correctly for your cluster type.
- **CrashLoopBackOff**: The application is crashing. Check the logs for errors.

### Cannot Access on Port 32100

1. Verify the service is using NodePort:
   ```bash
   kubectl get service next-app-service -o yaml
   ```

2. Check if the port is actually listening:
   ```bash
   # For Minikube
   minikube service list
   
   # For other clusters, check if NodePort is enabled
   kubectl get nodes -o yaml | grep -i nodeport
   ```

3. If using a firewall, ensure port 32100 is open.

### Update the Application

If you make changes to your application:

1. Rebuild the Docker image:
   ```bash
   docker build -t next-app:latest .
   # If using Minikube: eval $(minikube docker-env) first
   # If using Kind: kind load docker-image next-app:latest
   ```

2. Restart the deployment:
   ```bash
   kubectl rollout restart deployment next-app
   ```

3. Monitor the rollout:
   ```bash
   kubectl rollout status deployment next-app
   ```

## Cleanup

To remove the Next.js deployment and service:

```bash
kubectl delete -f k8s/
```

Or delete individually:

```bash
kubectl delete deployment next-app
kubectl delete service next-app-service
```

To remove Valkey:

```bash
helm uninstall valkey
```

Or if you need to specify a context:

```bash
helm uninstall valkey --kube-context=docker-desktop
```

To remove Prometheus:

```bash
helm uninstall prometheus
```

Or if you need to specify a context:

```bash
helm uninstall prometheus --kube-context=docker-desktop
```

## Configuration Details

### Valkey

Valkey is deployed using the Helm chart with the following configuration (from `helm/valkey-overrides.yaml`):

- **Image Tag**: latest
- **Resources**:
  - Requests: 256Mi memory, 100m CPU
  - Limits: 1024Mi memory, 500m CPU
- **Service Type**: NodePort
- **Authentication**: Enabled with default password

To view the Valkey service details:

```bash
kubectl get service valkey -o yaml
```

### Prometheus Operator (kube-prometheus-stack)

Prometheus Operator is deployed using the Helm chart with the following configuration (from `helm/prometheus-overrides.yaml`):

- **Chart**: kube-prometheus-stack (Prometheus Operator)
- **Namespace**: monitoring
- **Service Type**: NodePort
- **Node Port**: 30090 (external access)
- **Storage**: 10Gi persistent volume
- **Retention**: 15 days
- **PodMonitor Discovery**: Enabled (discovers all PodMonitors across all namespaces)

Prometheus Operator automatically discovers and scrapes metrics from pods using PodMonitor resources. The Next.js app pods are configured with:
- Label: `platformatic.dev/monitor: prometheus` - Used by PodMonitor to select pods
- Port: `metrics` (port 9090) - Metrics endpoint port
- Path: `/metrics` - Metrics endpoint path

The PodMonitor resource (`k8s/podMonitor.yaml`) selects pods with the `platformatic.dev/monitor: prometheus` label and configures scraping.

To view the Prometheus service details:

```bash
kubectl get service -n monitoring prometheus-kube-prometheus-prometheus
```

To view PodMonitors:

```bash
kubectl get podmonitors -A
kubectl get podmonitor next-app-pod-monitor -n default -o yaml
```

To access Prometheus metrics and queries, navigate to the dashboard at `http://localhost:30090` (or your cluster's node IP).

To verify that Prometheus is scraping the Next.js app:
1. Open the Prometheus dashboard at `http://localhost:30090`
2. Go to Status → Targets
3. You should see targets from the PodMonitor with the next-app pods
4. Check that the targets are "UP" and showing metrics

You can also query metrics directly in Prometheus, for example:
- `up{job=~".*next-app.*"}` - Shows all scraped next-app pods
- `up{kubernetes_pod_name=~"next-app-.*"}` - Shows only next-app pods

### Next.js Deployment

- **Replicas**: 1
- **Container Ports**: 
  - 3000 (HTTP - Next.js default)
  - 9090 (Metrics endpoint)
- **Resources**: 
  - Requests: 256Mi memory, 250m CPU
  - Limits: 512Mi memory, 500m CPU
- **Health Checks**: Liveness and readiness probes configured
- **Monitoring Labels**: 
  - `platformatic.dev/monitor: prometheus` - Used by PodMonitor to discover and scrape metrics

### Service

- **Type**: NodePort
- **Node Port**: 32100 (external access)
- **Target Port**: 3000 (container port)
- **Service Port**: 3000 (internal cluster access)

## Additional Notes

- The application uses Next.js standalone output mode for optimal containerization
- The Dockerfile is already configured for production builds
- Health probes ensure only healthy pods receive traffic
- The deployment uses `imagePullPolicy: IfNotPresent` to use locally built images

## Next Steps

- Consider using an Ingress controller for more advanced routing
- Set up horizontal pod autoscaling (HPA) for automatic scaling
- Configure persistent volumes if your app needs storage
- Set up monitoring and logging solutions

