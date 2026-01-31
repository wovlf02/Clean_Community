# 🐳 Docker 설정

> Dockerfile 및 컨테이너 설정 상세

---

## 📋 Dockerfile 구조

```dockerfile
# 베이스 이미지
FROM python:3.11-slim

# 작업 디렉토리
WORKDIR /app

# 시스템 의존성
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드
COPY app/ ./app/
COPY run_server.py .

# 모델 디렉토리 (볼륨 마운트 권장)
# COPY models/ ./models/

# 포트 노출
EXPOSE 8000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 실행 명령
CMD ["python", "run_server.py"]
```

---

## 🏗️ 이미지 빌드

### 기본 빌드

```bash
docker build -t hate-speech-api:latest .
```

### 태그 지정 빌드

```bash
docker build -t hate-speech-api:1.0.0 .
docker build -t hate-speech-api:$(date +%Y%m%d) .
```

### 멀티 플랫폼 빌드

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t hate-speech-api:latest .
```

---

## 🚀 컨테이너 실행

### 기본 실행

```bash
docker run -d \
  --name hate-speech-api \
  -p 8000:8000 \
  hate-speech-api:latest
```

### 모델 볼륨 마운트

```bash
docker run -d \
  --name hate-speech-api \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  hate-speech-api:latest
```

### 환경 변수 설정

```bash
docker run -d \
  --name hate-speech-api \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  -e DEVICE=cpu \
  -e LOG_LEVEL=INFO \
  hate-speech-api:latest
```

### 리소스 제한

```bash
docker run -d \
  --name hate-speech-api \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  --memory=4g \
  --cpus=2 \
  hate-speech-api:latest
```

---

## 📦 Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  hate-speech-api:
    build: .
    container_name: hate-speech-api
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models
    environment:
      - DEVICE=cpu
      - LOG_LEVEL=INFO
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G
```

### Compose 명령어

```bash
# 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down

# 재빌드 후 시작
docker-compose up -d --build
```

---

## 🔧 최적화 설정

### 1. 멀티 스테이지 빌드

```dockerfile
# 빌드 스테이지
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# 실행 스테이지
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY app/ ./app/
COPY run_server.py .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "run_server.py"]
```

### 2. .dockerignore

```
# 제외 파일
venv/
__pycache__/
*.pyc
*.pyo
.git/
.gitignore
*.md
tests/
*.log
.env
```

---

## 📊 이미지 크기 최적화

| 최적화 방법 | 예상 절감 |
|-------------|-----------|
| slim 베이스 이미지 | ~500MB |
| 멀티 스테이지 빌드 | ~200MB |
| .dockerignore | ~100MB |
| 캐시 정리 | ~100MB |

### 이미지 크기 확인

```bash
docker images hate-speech-api
```

---

## 🔍 디버깅

### 컨테이너 접속

```bash
docker exec -it hate-speech-api /bin/bash
```

### 로그 확인

```bash
# 전체 로그
docker logs hate-speech-api

# 실시간 로그
docker logs -f hate-speech-api

# 최근 100줄
docker logs --tail 100 hate-speech-api
```

### 리소스 사용량

```bash
docker stats hate-speech-api
```

---

## 🏥 헬스체크

### Dockerfile 헬스체크

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
```

### 헬스체크 상태 확인

```bash
docker inspect --format='{{.State.Health.Status}}' hate-speech-api
```

---

## 🔒 보안 권장사항

1. **비루트 사용자 실행**
```dockerfile
RUN useradd -m appuser
USER appuser
```

2. **최소 권한 원칙**
```dockerfile
RUN chmod -R 555 /app
```

3. **시크릿 관리**
```bash
docker run -d \
  --secret api_key \
  hate-speech-api:latest
```
