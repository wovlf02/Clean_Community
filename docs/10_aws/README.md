# AWS 설정 가이드

**관련 문서**: [배포 가이드](../07_deployment/aws-deployment.md) | [시스템 설계](../03_architecture/system-design.md)

---

## 1. AWS 계정 설정

### 1.1 IAM 사용자 생성

1. AWS Console → IAM → Users → Add users
2. 사용자 이름: `emotion-community-deploy`
3. 액세스 타입: Programmatic access
4. 권한 정책:
   - `AmazonECS_FullAccess`
   - `AmazonRDSFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonElastiCacheFullAccess`
   - `CloudWatchFullAccess`
   - `AmazonEC2ContainerRegistryFullAccess`

### 1.2 Access Key 저장

```bash
# ~/.aws/credentials
[emotion-community]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY

# ~/.aws/config
[profile emotion-community]
region = ap-northeast-2
output = json
```

---

## 2. VPC 설정

### 2.1 VPC 생성

| 항목 | 값 |
|------|-----|
| Name | emotion-community-vpc |
| CIDR | 10.0.0.0/16 |

### 2.2 서브넷 구성

| 서브넷 | CIDR | AZ | 용도 |
|--------|------|-----|------|
| public-a | 10.0.1.0/24 | ap-northeast-2a | ALB, NAT |
| public-b | 10.0.2.0/24 | ap-northeast-2b | ALB, NAT |
| private-a | 10.0.11.0/24 | ap-northeast-2a | ECS, RDS |
| private-b | 10.0.12.0/24 | ap-northeast-2b | ECS, RDS |

### 2.3 인터넷 게이트웨이

```bash
aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text
aws ec2 attach-internet-gateway --internet-gateway-id <igw-id> --vpc-id <vpc-id>
```

### 2.4 NAT 게이트웨이

```bash
# Elastic IP 할당
aws ec2 allocate-address --domain vpc

# NAT Gateway 생성
aws ec2 create-nat-gateway --subnet-id <public-subnet-id> --allocation-id <eip-alloc-id>
```

---

## 3. 보안 그룹

### 3.1 ALB 보안 그룹

| Type | Port | Source |
|------|------|--------|
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

### 3.2 ECS 보안 그룹

| Type | Port | Source |
|------|------|--------|
| Custom TCP | 4000 | ALB SG |
| Custom TCP | 8000 | ALB SG |

### 3.3 RDS 보안 그룹

| Type | Port | Source |
|------|------|--------|
| PostgreSQL | 5432 | ECS SG |
| PostgreSQL | 5432 | Vercel IP ranges |

### 3.4 ElastiCache 보안 그룹

| Type | Port | Source |
|------|------|--------|
| Custom TCP | 6379 | ECS SG |

---

## 4. RDS (PostgreSQL)

### 4.1 생성

```bash
aws rds create-db-instance \
  --db-instance-identifier emotion-community-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15 \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20 \
  --storage-type gp3 \
  --db-name emotion_community \
  --vpc-security-group-ids <sg-id> \
  --db-subnet-group-name emotion-community-subnet-group \
  --backup-retention-period 7 \
  --no-publicly-accessible
```

### 4.2 파라미터 그룹

| 파라미터 | 값 |
|----------|-----|
| max_connections | 100 |
| shared_buffers | 256MB |
| log_statement | ddl |

---

## 5. ElastiCache (Redis)

### 5.1 생성

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id emotion-community-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --security-group-ids <sg-id> \
  --cache-subnet-group-name emotion-community-cache-subnet
```

---

## 6. S3

### 6.1 버킷 생성

```bash
# 업로드 버킷
aws s3 mb s3://emotion-community-uploads --region ap-northeast-2

# 버킷 정책
aws s3api put-bucket-policy --bucket emotion-community-uploads --policy file://bucket-policy.json
```

### 6.2 CORS 설정

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://emotion-community.com", "http://localhost:3000"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

### 6.3 수명 주기 규칙

| 규칙 | 조건 | 작업 |
|------|------|------|
| 임시 파일 삭제 | prefix: temp/, 1일 후 | 삭제 |
| 오래된 버전 삭제 | 30일 후 | 이전 버전 삭제 |

---

## 7. CloudFront

### 7.1 배포 생성

| 항목 | 설정 |
|------|------|
| Origin | S3 버킷 |
| Viewer Protocol | Redirect HTTP to HTTPS |
| Cache Policy | CachingOptimized |
| Price Class | PriceClass_200 |

### 7.2 캐시 무효화

```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

---

## 8. ECS

### 8.1 클러스터 생성

```bash
aws ecs create-cluster --cluster-name emotion-community
```

### 8.2 ECR 리포지토리

```bash
# Socket Server
aws ecr create-repository --repository-name socket-server

# AI Server
aws ecr create-repository --repository-name ai-server
```

### 8.3 서비스 생성

```bash
aws ecs create-service \
  --cluster emotion-community \
  --service-name socket-server \
  --task-definition socket-server:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<subnet-ids>],securityGroups=[<sg-id>],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=<tg-arn>,containerName=socket-server,containerPort=4000"
```

### 8.4 Auto Scaling

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/emotion-community/socket-server \
  --min-capacity 2 \
  --max-capacity 10

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/emotion-community/socket-server \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

---

## 9. Route 53

### 9.1 호스팅 영역 생성

```bash
aws route53 create-hosted-zone --name emotion-community.com --caller-reference $(date +%s)
```

### 9.2 레코드 설정

| 이름 | 유형 | 값 |
|------|------|-----|
| emotion-community.com | A | CloudFront Alias |
| api.emotion-community.com | A | ALB Alias |
| socket.emotion-community.com | A | ALB Alias |

---

## 10. CloudWatch

### 10.1 로그 그룹

```bash
aws logs create-log-group --log-group-name /ecs/socket-server
aws logs create-log-group --log-group-name /ecs/ai-server
```

### 10.2 알람

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "ECS-HighCPU" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ClusterName,Value=emotion-community Name=ServiceName,Value=socket-server \
  --evaluation-periods 2 \
  --alarm-actions <sns-topic-arn>
```

### 10.3 대시보드

주요 메트릭:
- ECS CPU/Memory Utilization
- RDS Connections/IOPS
- ElastiCache Hit Rate
- ALB Request Count/Latency
- S3 Request Count

---

**최종 업데이트**: 2026년 1월 29일
