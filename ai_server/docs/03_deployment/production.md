# 🌐 프로덕션 배포

> AWS 및 클라우드 환경 배포 가이드

---

## 📋 배포 옵션

| 옵션 | 설명 | 권장 |
|------|------|------|
| AWS EC2 | 단일 인스턴스 | 소규모 |
| AWS ECS | 컨테이너 서비스 | 중규모 |
| AWS EKS | Kubernetes | 대규모 |
| AWS Lambda | 서버리스 | 간헐적 사용 |

---

## 🖥️ AWS EC2 배포

### 1. 인스턴스 요구사항

| 항목 | 최소 | 권장 |
|------|------|------|
| 인스턴스 타입 | t3.medium | t3.large / c5.xlarge |
| vCPU | 2 | 4+ |
| 메모리 | 4GB | 8GB+ |
| 스토리지 | 20GB | 30GB+ |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### 2. 초기 설정

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 재로그인 후 확인
docker --version
```

### 3. 애플리케이션 배포

```bash
# 코드 클론
git clone https://github.com/your-repo/ai_server.git
cd ai_server

# 모델 파일 다운로드 (S3에서)
aws s3 cp s3://your-bucket/models/ ./models/ --recursive

# Docker 이미지 빌드
docker build -t hate-speech-api:latest .

# 컨테이너 실행
docker run -d \
  --name hate-speech-api \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  --restart unless-stopped \
  hate-speech-api:latest
```

### 4. 보안 그룹 설정

| 포트 | 프로토콜 | 소스 | 설명 |
|------|----------|------|------|
| 22 | TCP | 관리자 IP | SSH |
| 8000 | TCP | VPC 내부 | API |
| 80/443 | TCP | 0.0.0.0/0 | 로드밸런서 |

---

## 🔄 AWS ECS 배포

### 1. ECR에 이미지 푸시

```bash
# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.ap-northeast-2.amazonaws.com

# 이미지 태그
docker tag hate-speech-api:latest \
  123456789.dkr.ecr.ap-northeast-2.amazonaws.com/hate-speech-api:latest

# 이미지 푸시
docker push 123456789.dkr.ecr.ap-northeast-2.amazonaws.com/hate-speech-api:latest
```

### 2. Task Definition

```json
{
  "family": "hate-speech-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "hate-speech-api",
      "image": "123456789.dkr.ecr.ap-northeast-2.amazonaws.com/hate-speech-api:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 10,
        "retries": 3
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/hate-speech-api",
          "awslogs-region": "ap-northeast-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 3. 서비스 생성

```bash
aws ecs create-service \
  --cluster production \
  --service-name hate-speech-api \
  --task-definition hate-speech-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## ⚖️ 로드 밸런서 설정

### Application Load Balancer

```
ALB
├── Listener (HTTPS:443)
│   └── Target Group (Port 8000)
│       ├── ECS Task 1
│       └── ECS Task 2
```

### 헬스체크 설정

| 항목 | 값 |
|------|------|
| 경로 | `/health` |
| 프로토콜 | HTTP |
| 포트 | 8000 |
| 정상 임계값 | 2 |
| 비정상 임계값 | 3 |
| 타임아웃 | 10초 |
| 간격 | 30초 |

---

## 📈 오토 스케일링

### Target Tracking 정책

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/production/hate-speech-api \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/production/hate-speech-api \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 120
  }'
```

---

## 📊 모니터링

### CloudWatch 메트릭

| 메트릭 | 설명 | 알람 조건 |
|--------|------|-----------|
| CPUUtilization | CPU 사용률 | > 80% |
| MemoryUtilization | 메모리 사용률 | > 80% |
| HealthyHostCount | 정상 호스트 수 | < 2 |
| RequestCount | 요청 수 | - |
| TargetResponseTime | 응답 시간 | > 5s |

### CloudWatch 알람

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "HateSpeechAPI-HighCPU" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ClusterName,Value=production Name=ServiceName,Value=hate-speech-api \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:ap-northeast-2:123456789:alerts
```

---

## 🔒 보안 설정

### 1. HTTPS 적용

- AWS Certificate Manager (ACM)에서 인증서 발급
- ALB에 HTTPS 리스너 추가
- HTTP → HTTPS 리다이렉션

### 2. WAF 규칙

- Rate limiting (초당 요청 제한)
- SQL Injection 방지
- XSS 방지

### 3. 네트워크 보안

- VPC 내부에서만 API 접근
- NAT Gateway로 아웃바운드만 허용
- Security Group 최소 권한

---

## 🔄 CI/CD 파이프라인

### GitHub Actions 예시

```yaml
name: Deploy to ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      
      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push
        run: |
          docker build -t hate-speech-api .
          docker tag hate-speech-api:latest $ECR_REGISTRY/hate-speech-api:latest
          docker push $ECR_REGISTRY/hate-speech-api:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production \
            --service hate-speech-api \
            --force-new-deployment
```

---

## 💰 비용 최적화

| 방법 | 절감률 |
|------|--------|
| Reserved Instances | ~30% |
| Spot Instances (개발) | ~70% |
| 오토 스케일링 | 가변 |
| 적정 인스턴스 선택 | ~20% |
