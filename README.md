# Next.js App with Watt - Kubernetes Ready

A Next.js application powered by [Watt](https://docs.platformatic.dev/docs/Overview), Platformatic's Node.js Application Server. This project demonstrates how to build and deploy a Next.js application with built-in observability, caching, and production-ready features on Kubernetes.

## What is Watt?

[Watt](https://docs.platformatic.dev/docs/Overview) is Platformatic's flagship Node.js Application Server that provides:

- 🚀 **Unified Development** - Run databases, APIs, and frontend frameworks in a single application server
- ⚡ **Built-in Observability** - Automatic logging, metrics, and distributed tracing
- 🔧 **Zero Configuration** - Sensible defaults that work out of the box
- 📊 **Auto-Generated APIs** - REST and GraphQL endpoints from your database schema
- 🎨 **Framework Agnostic** - Works with Next.js, React, Vue, Express, Fastify, and more

## Features

- **Next.js 15** with React 19
- **Watt Integration** via `@platformatic/next` for unified application server
- **Valkey Caching** - Redis-compatible in-memory data store
- **Prometheus Metrics** - Built-in metrics endpoint for monitoring
- **Kubernetes Ready** - Complete deployment configuration with Helm charts
- **Production Monitoring** - Health checks, structured logging, and distributed tracing

## Prerequisites

- Node.js 20+ 
- npm, pnpm, or yarn
- Docker (for containerization)
- Kubernetes cluster (for deployment)
- kubectl and helm (for Kubernetes deployment)

## Getting Started

### Installation

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Build

Build the application for production:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

### Start Production Server

Start the production server:

```bash
npm start
# or
pnpm start
# or
yarn start
```

## Project Structure

```
.
├── src/
│   └── app/              # Next.js app directory
│       ├── layout.tsx    # Root layout
│       ├── page.tsx      # Home page
│       └── globals.css   # Global styles
├── k8s/                  # Kubernetes manifests
│   ├── deployment.yaml   # Deployment configuration
│   ├── service.yaml      # Service configuration
│   └── podMonitor.yaml   # Prometheus PodMonitor
├── helm/                 # Helm chart overrides
│   ├── valkey-overrides.yaml      # Valkey configuration
│   └── prometheus-overrides.yaml  # Prometheus configuration
├── watt.json             # Watt configuration
├── next.config.ts        # Next.js configuration
├── Dockerfile            # Container image definition
└── docker-compose.yml    # Local development with Docker Compose
```

## Configuration

### Watt Configuration

The `watt.json` file configures Watt's runtime settings:

- **Cache**: Valkey adapter for Redis-compatible caching
- **Server**: Configurable hostname and port
- **Metrics**: Prometheus metrics endpoint on port 9090
- **Logging**: Structured logging with configurable levels
- **Workers**: Configurable number of Next.js workers

Environment variables can be used to customize the configuration:
- `PLT_VALKEY_HOST` - Valkey host
- `PLT_SERVER_LOGGER_LEVEL` - Logging level
- `PORT` - Server port
- `PLT_NEXT_WORKERS` - Number of Next.js workers

## Kubernetes Deployment

This application is ready to be deployed on Kubernetes with full observability and monitoring. For detailed deployment instructions, see [KUBERNETES_DEPLOYMENT.md](./KUBERNETES_DEPLOYMENT.md).

The deployment includes:

- **Next.js Application** - Containerized with health checks
- **Valkey** - Redis-compatible cache deployed via Helm
- **Prometheus Operator** - Metrics collection and monitoring
- **PodMonitor** - Automatic metrics discovery and scraping
- **NodePort Service** - Exposes the app on port 32100

Quick deployment overview:

1. Deploy Valkey using Helm
2. Deploy Prometheus Operator using Helm
3. Build the Docker image
4. Apply Kubernetes manifests from `k8s/` directory
5. Access the application on port 32100

For step-by-step instructions, troubleshooting, and configuration details, refer to the [Kubernetes Deployment Guide](./KUBERNETES_DEPLOYMENT.md).

## Technologies

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[Watt](https://docs.platformatic.dev/docs/Overview)** - Platformatic's Node.js Application Server
- **[Valkey](https://valkey.io/)** - Redis-compatible in-memory data store
- **[Prometheus](https://prometheus.io/)** - Monitoring and alerting toolkit
- **[Kubernetes](https://kubernetes.io/)** - Container orchestration
- **[Helm](https://helm.sh/)** - Kubernetes package manager
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Watt Documentation](https://docs.platformatic.dev/docs/Overview)
- [Next.js Documentation](https://nextjs.org/docs)
- [Platformatic Blog](https://blog.platformatic.dev)
- [Platformatic Discord](https://discord.gg/platformatic)

## License

This project is private and proprietary.

