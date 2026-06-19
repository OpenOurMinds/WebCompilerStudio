# Deployment Guide

This guide covers various deployment options for WebCompilerStudio with Claurst integration.

## 🚀 Quick Start (Development)

### Prerequisites
- Rust 1.75+
- Node.js 18+
- Docker & Docker Compose (optional)

### Local Development
```bash
# Clone and navigate to project
git clone <repository-url>
cd WebCompilerStudio

# Run integration tests
./test-integration.sh

# Start development environment
./start-dev.sh
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Create environment file:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

2. **Start services:**
```bash
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Health Check: http://localhost:8080/health

### Environment Variables

Create a `.env` file:
```env
# API Keys (at least one required)
CLAUDE_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key

# Optional Configuration
RUST_LOG=info
MAX_TOKENS=4096
DEFAULT_MODEL=anthropic/claude-3-sonnet-20240229
```

## ☁️ Cloud Deployment

### AWS ECS

1. **Build and push images:**
```bash
# Backend
docker build -t your-registry/webcompilerstudio-backend:latest ./claurst-main
docker push your-registry/webcompilerstudio-backend:latest

# Frontend
docker build -t your-registry/webcompilerstudio-frontend:latest ./ai-lang-studio-main
docker push your-registry/webcompilerstudio-frontend:latest
```

2. **Deploy using ECS task definition with the docker-compose.yml configuration**

### Google Cloud Run

1. **Build and deploy:**
```bash
# Backend
gcloud builds submit --tag gcr.io/PROJECT-ID/backend ./claurst-main
gcloud run deploy backend --image gcr.io/PROJECT-ID/backend --platform managed

# Frontend
gcloud builds submit --tag gcr.io/PROJECT-ID/frontend ./ai-lang-studio-main
gcloud run deploy frontend --image gcr.io/PROJECT-ID/frontend --platform managed
```

### Azure Container Instances

```bash
# Create resource group
az group create --name webcompilerstudio-rg --location eastus

# Deploy container group
az container create \
  --resource-group webcompilerstudio-rg \
  --name webcompilerstudio \
  --image your-registry/webcompilerstudio:latest \
  --ports 80 8080 \
  --environment-variables CLAUDE_API_KEY=$CLAUDE_API_KEY
```

## 🔧 Production Configuration

### Backend Configuration

Create a `production-settings.json`:
```json
{
  "config": {
    "api_key": "${CLAUDE_API_KEY}",
    "model": "anthropic/claude-3-sonnet-20240229",
    "max_tokens": 4096,
    "permission_mode": "Default",
    "auto_compact": true,
    "compact_threshold": 0.8,
    "enable_all_mcp_servers": false,
    "mcp_servers": [
      {
        "name": "filesystem",
        "command": "claurst-mcp-filesystem",
        "args": ["--allow", "."]
      }
    ]
  },
  "permission_rules": [
    {
      "scope": "file_write",
      "action": "allow",
      "pattern": "/app/workspace/**/*"
    }
  ]
}
```

### Frontend Configuration

Update `vite.config.ts` for production:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true
      }
    }
  }
})
```

## 🔒 Security Considerations

### API Security
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use environment variables for secrets

### Docker Security
- Run containers as non-root users
- Use multi-stage builds
- Regularly update base images
- Scan images for vulnerabilities

### Network Security
- Configure firewalls
- Use reverse proxy (nginx)
- Implement CORS policies
- Enable security headers

## 📊 Monitoring & Logging

### Backend Monitoring
```rust
// Add to main.rs
use tracing::{info, error, instrument};

#[instrument]
async fn handle_request(req: Request) -> Result<Response, Error> {
    info!("Processing request: {}", req.uri());
    // ... handler logic
}
```

### Frontend Monitoring
```typescript
// Add to main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
});
```

### Health Checks
- Backend: `/health` endpoint
- Frontend: nginx health check
- Database: connection validation
- External APIs: ping tests

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Run tests
        run: ./test-integration.sh

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check Rust version: `rustc --version`
   - Verify dependencies: `cargo check`
   - Check port availability: `lsof -i :8080`

2. **Frontend build fails**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node version: `node --version`
   - Verify TypeScript: `npx tsc --noEmit`

3. **Docker issues**
   - Check Docker logs: `docker-compose logs`
   - Verify image builds: `docker-compose build`
   - Check resource usage: `docker stats`

4. **API connection errors**
   - Verify backend health: `curl http://localhost:8080/health`
   - Check CORS configuration
   - Validate environment variables

### Performance Optimization

1. **Backend**
   - Enable Rust optimizations: `cargo build --release`
   - Use connection pooling
   - Implement caching

2. **Frontend**
   - Enable code splitting
   - Optimize bundle size
   - Use lazy loading

3. **Database**
   - Add indexes
   - Optimize queries
   - Implement connection pooling

## 📚 Additional Resources

- [Claurst Documentation](./claurst-main/README.md)
- [React Documentation](https://react.dev/)
- [Rust Web Frameworks](https://www.rust-lang.org/what/wasm)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
