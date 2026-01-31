# 스케일링

**관련 문서**: [환경 변수](./environment.md) | [Docker 배포](./docker.md)

---

## 개요

Socket Server는 Redis Adapter를 통해 수평 확장을 지원합니다.

---

## 단일 인스턴스 vs 다중 인스턴스

### 단일 인스턴스

```
┌─────────┐     ┌─────────────────┐
│ Clients │────▶│  Socket Server  │
└─────────┘     │   (Instance)    │
                └─────────────────┘
```

- Redis 불필요 (`REDIS_ENABLED=false`)
- 개발/테스트 환경에 적합
- 단일 장애점 (SPOF)

### 다중 인스턴스 (권장)

```
┌─────────┐     ┌─────────────┐     ┌─────────────────┐
│ Clients │────▶│    ALB      │────▶│  Instance A     │
└─────────┘     │  (Sticky)   │     ├─────────────────┤
                └─────────────┘     │  Instance B     │
                                    ├─────────────────┤
                                    │  Instance C     │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │     Redis       │
                                    │   (Pub/Sub)     │
                                    └─────────────────┘
```

- Redis 필수 (`REDIS_ENABLED=true`)
- 고가용성
- 수평 확장 가능

---

## Redis Adapter 설정

### 환경 변수

```env
REDIS_URL=redis://your-redis-host:6379
REDIS_ENABLED=true
```

### AWS ElastiCache 설정

```env
REDIS_URL=redis://your-cluster.cache.amazonaws.com:6379
REDIS_ENABLED=true
```

---

## 로드밸런서 설정

### Sticky Sessions (필수)

WebSocket 연결은 상태를 유지하므로 Sticky Session이 필요합니다.

#### AWS ALB 설정

```yaml
# Target Group 설정
TargetGroup:
  Type: AWS::ElasticLoadBalancingV2::TargetGroup
  Properties:
    TargetType: ip
    Protocol: HTTP
    Port: 4000
    VpcId: !Ref VPC
    HealthCheckPath: /health
    HealthCheckIntervalSeconds: 30
    TargetGroupAttributes:
      - Key: stickiness.enabled
        Value: "true"
      - Key: stickiness.type
        Value: lb_cookie
      - Key: stickiness.lb_cookie.duration_seconds
        Value: "86400"
```

#### Nginx 설정

```nginx
upstream socket_servers {
    ip_hash;  # Sticky session by IP
    server socket-server-1:4000;
    server socket-server-2:4000;
    server socket-server-3:4000;
}

server {
    listen 80;
    
    location /socket.io/ {
        proxy_pass http://socket_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

## Auto Scaling

### ECS Auto Scaling

```yaml
ScalableTarget:
  Type: AWS::ApplicationAutoScaling::ScalableTarget
  Properties:
    MaxCapacity: 10
    MinCapacity: 2
    ResourceId: !Sub service/${ClusterName}/${ServiceName}
    RoleARN: !GetAtt AutoScalingRole.Arn
    ScalableDimension: ecs:service:DesiredCount
    ServiceNamespace: ecs

ScalingPolicy:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: socket-server-scaling-policy
    PolicyType: TargetTrackingScaling
    ScalingTargetId: !Ref ScalableTarget
    TargetTrackingScalingPolicyConfiguration:
      PredefinedMetricSpecification:
        PredefinedMetricType: ECSServiceAverageCPUUtilization
      TargetValue: 70.0
      ScaleInCooldown: 300
      ScaleOutCooldown: 60
```

---

## 모니터링

### 주요 메트릭

| 메트릭 | 설명 | 알림 임계값 |
|--------|------|-------------|
| 활성 연결 수 | 현재 WebSocket 연결 수 | 인스턴스당 10,000 초과 시 |
| 메시지 처리량 | 초당 처리 메시지 수 | - |
| 에러율 | 에러 발생 비율 | 1% 초과 시 |
| 지연 시간 | 메시지 전달 지연 | 100ms 초과 시 |

### CloudWatch 대시보드

```yaml
Dashboard:
  Type: AWS::CloudWatch::Dashboard
  Properties:
    DashboardName: socket-server-dashboard
    DashboardBody: !Sub |
      {
        "widgets": [
          {
            "type": "metric",
            "properties": {
              "title": "Active Connections",
              "metrics": [
                ["SocketServer", "ActiveConnections", "ServiceName", "${ServiceName}"]
              ]
            }
          }
        ]
      }
```

---

## 성능 최적화

### 권장 설정

| 항목 | 권장값 | 설명 |
|------|--------|------|
| 인스턴스 크기 | t3.medium 이상 | CPU 2코어, 메모리 4GB |
| 최대 연결 수 | 10,000/인스턴스 | Node.js 기본 제한 |
| Redis 연결 풀 | 10 | 인스턴스당 Redis 연결 수 |

### Node.js 튜닝

```bash
# 최대 파일 디스크립터 수 증가
ulimit -n 65535

# Node.js 환경 변수
NODE_OPTIONS="--max-old-space-size=4096"
```

---

**최종 업데이트**: 2026년 1월 31일
