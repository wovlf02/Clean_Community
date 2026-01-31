# REST API

**관련 문서**: [Socket.IO 이벤트](./socket-events.md) | [타입 정의](./types.md)

---

## 개요

Socket Server는 헬스체크 및 상태 확인을 위한 REST API를 제공합니다.

**Base URL**: `http://localhost:4000`

---

## 엔드포인트

### 1. 헬스체크

서버의 상태를 확인합니다.

```
GET /health
```

**응답 (200 OK)**

```json
{
  "status": "healthy",
  "timestamp": "2026-01-31T12:00:00.000Z",
  "uptime": 3600.123,
  "environment": "development"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | string | 서버 상태 (`healthy`) |
| `timestamp` | string | 현재 시간 (ISO 8601) |
| `uptime` | number | 서버 가동 시간 (초) |
| `environment` | string | 실행 환경 |

---

### 2. 레디니스 체크

서버가 트래픽을 받을 준비가 되었는지 확인합니다.

```
GET /ready
```

**응답 (200 OK)**

```json
{
  "status": "ready",
  "timestamp": "2026-01-31T12:00:00.000Z"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | string | 준비 상태 (`ready`) |
| `timestamp` | string | 현재 시간 (ISO 8601) |

---

## 사용 예시

### cURL

```bash
# 헬스체크
curl http://localhost:4000/health

# 레디니스 체크
curl http://localhost:4000/ready
```

### Kubernetes Probe 설정

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 4000
  initialDelaySeconds: 10
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /ready
    port: 4000
  initialDelaySeconds: 5
  periodSeconds: 10
```

---

**최종 업데이트**: 2026년 1월 31일
