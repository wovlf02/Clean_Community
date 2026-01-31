# Docker 배포

**관련 문서**: [환경 변수](./environment.md) | [스케일링](./scaling.md)

---

## Dockerfile

```dockerfile
# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:24-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 socketserver

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built files
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R socketserver:nodejs /app

# Switch to non-root user
USER socketserver

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start server
CMD ["node", "dist/index.js"]
```

---

## .dockerignore

```
node_modules
dist
.env
.git
.gitignore
*.md
docs
.DS_Store
```

---

## Docker Compose

### 개발 환경 (docker-compose.dev.yml)

```yaml
version: '3.8'

services:
  socket-server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - PORT=4000
      - JWT_SECRET=dev-secret-key
      - REDIS_URL=redis://redis:6379
      - REDIS_ENABLED=true
      - CORS_ORIGIN=http://localhost:3000
      - LOG_LEVEL=debug
    depends_on:
      - redis
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  redis-data:
```

### 프로덕션 환경 (docker-compose.prod.yml)

```yaml
version: '3.8'

services:
  socket-server:
    image: your-registry/socket-server:latest
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
      - REDIS_ENABLED=true
      - LOG_LEVEL=info
    env_file:
      - .env.production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:4000/health')"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  app-network:
    external: true
```

---

## Docker 명령어

### 이미지 빌드

```bash
# 개발용 빌드
docker build -t socket-server:dev .

# 프로덕션용 빌드
docker build -t socket-server:latest .
```

### 컨테이너 실행

```bash
# 단일 컨테이너 실행
docker run -d \
  --name socket-server \
  -p 4000:4000 \
  -e JWT_SECRET=your-secret \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  -e REDIS_ENABLED=true \
  socket-server:latest

# Docker Compose로 실행
docker-compose -f docker-compose.dev.yml up -d
```

### 로그 확인

```bash
# 컨테이너 로그
docker logs -f socket-server

# Docker Compose 로그
docker-compose logs -f socket-server
```

---

**최종 업데이트**: 2026년 1월 31일
