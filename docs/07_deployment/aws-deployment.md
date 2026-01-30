# AWS 배포 가이드

**관련 문서**: [기술 스택](../03_architecture/tech-stack.md) | [시스템 설계](../03_architecture/system-design.md)

---

## 1. 배포 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AWS Cloud                                       │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           Route 53 (DNS)                                │ │
│  └──────────────────────────────┬─────────────────────────────────────────┘ │
│                                 │                                            │
│                                 ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         CloudFront (CDN)                                │ │
│  └──────────────────────────────┬─────────────────────────────────────────┘ │
│                                 │                                            │
│         ┌───────────────────────┼───────────────────────┐                   │
│         │                       │                       │                   │
│         ▼                       ▼                       ▼                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐              │
│  │   Vercel     │      │  ALB         │      │  ALB         │              │
│  │  (Next.js)   │      │ (Socket)     │      │ (AI)         │              │
│  │              │      │              │      │              │              │
│  │  - SSR/SSG   │      │  ┌────────┐  │      │  ┌────────┐  │              │
│  │  - API Routes│      │  │  ECS   │  │      │  │  ECS   │  │              │
│  │              │      │  │Fargate │  │      │  │Fargate │  │              │
│  │              │      │  │        │  │      │  │        │  │              │
│  │              │      │  │Express │  │      │  │FastAPI │  │              │
│  │              │      │  └────────┘  │      │  └────────┘  │              │
│  └──────┬───────┘      └──────┬───────┘      └──────────────┘              │
│         │                     │                                             │
│         └──────────┬──────────┘                                             │
│                    │                                                        │
│                    ▼                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                              VPC                                      │  │
│  │                                                                       │  │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │  │
│  │   │     RDS      │  │ ElastiCache  │  │      S3      │               │  │
│  │   │ (PostgreSQL) │  │   (Redis)    │  │   (Files)    │               │  │
│  │   │              │  │              │  │              │               │  │
│  │   │ Private      │  │ Private      │  │ Public       │               │  │
│  │   │ Subnet       │  │ Subnet       │  │              │               │  │
│  │   └──────────────┘  └──────────────┘  └──────────────┘               │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 서비스별 배포

### 2.1 Next.js (Vercel)

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 연결
vercel link

# 환경 변수 설정
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# 배포
vercel --prod
```

**vercel.json**
```json
{
  "framework": "nextjs",
  "regions": ["icn1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_URL": "@nextauth_url",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  }
}
```

### 2.2 Socket Server (ECS Fargate)

**Dockerfile**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
```

**Task Definition**
```json
{
  "family": "socket-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "socket-server",
      "image": "xxx.dkr.ecr.ap-northeast-2.amazonaws.com/socket-server:latest",
      "portMappings": [
        {
          "containerPort": 4000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "REDIS_URL",
          "value": "redis://xxx.cache.amazonaws.com:6379"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/socket-server",
          "awslogs-region": "ap-northeast-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 2.3 AI Server (ECS Fargate)

**Dockerfile**
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 모델 파일 복사
COPY models/ /app/models/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 3. 데이터베이스 (RDS)

### 3.1 PostgreSQL 설정

| 항목 | 값 |
|------|-----|
| Engine | PostgreSQL 15 |
| Instance | db.t3.micro (개발) / db.r6g.large (운영) |
| Storage | 20GB gp3 |
| Multi-AZ | No (개발) / Yes (운영) |
| Backup | 7일 자동 백업 |

### 3.2 보안 그룹

```
Inbound Rules:
- Type: PostgreSQL (5432)
- Source: ECS Security Group / Vercel IP ranges
```

### 3.3 연결 문자열

```
postgresql://username:password@endpoint:5432/emotion_community?sslmode=require
```

---

## 4. 캐시 (ElastiCache)

### 4.1 Redis 설정

| 항목 | 값 |
|------|-----|
| Engine | Redis 7.x |
| Node Type | cache.t3.micro (개발) / cache.r6g.large (운영) |
| Cluster Mode | Disabled |

### 4.2 용도

- Socket.IO 어댑터 (Pub/Sub)
- 세션 캐싱
- Rate Limiting

---

## 5. 파일 스토리지 (S3)

### 5.1 버킷 설정

```bash
# 버킷 생성
aws s3 mb s3://emotion-community-uploads

# CORS 설정
aws s3api put-bucket-cors --bucket emotion-community-uploads --cors-configuration file://cors.json
```

**cors.json**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-domain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

### 5.2 CloudFront 연동

- S3 버킷을 Origin으로 설정
- HTTPS 강제
- 캐시 정책 적용

---

## 6. CI/CD (GitHub Actions)

**.github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-socket:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: socket-server
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG apps/socket-server
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster emotion-community --service socket-server --force-new-deployment

  deploy-ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: ai-server
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG apps/ai-server
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster emotion-community --service ai-server --force-new-deployment
```

---

## 7. 모니터링

### 7.1 CloudWatch

- **로그 그룹**: /ecs/socket-server, /ecs/ai-server
- **메트릭**: CPU, 메모리, 네트워크
- **알람**: 에러율 5% 초과, CPU 80% 초과

### 7.2 알람 설정

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "HighCPU" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:ap-northeast-2:xxx:alerts
```

---

## 8. 비용 예상 (월간)

| 서비스 | 사양 | 예상 비용 |
|--------|------|----------|
| Vercel | Pro | $20 |
| RDS (PostgreSQL) | db.t3.micro | $15 |
| ECS Fargate (Socket) | 0.25 vCPU, 0.5GB | $10 |
| ECS Fargate (AI) | 0.5 vCPU, 1GB | $20 |
| ElastiCache | cache.t3.micro | $15 |
| S3 | 10GB | $0.25 |
| CloudFront | 100GB 전송 | $10 |
| **총계** | | **~$90/월** |

---

**최종 업데이트**: 2026년 1월 29일
