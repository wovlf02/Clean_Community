# 환경 변수

**관련 문서**: [Docker 배포](./docker.md) | [스케일링](./scaling.md)

---

## 개요

Socket Server는 `.env` 파일을 통해 환경 변수를 관리합니다.

---

## 환경 변수 목록

### 서버 설정

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `PORT` | 서버 포트 | `4000` | ❌ |
| `NODE_ENV` | 실행 환경 (`development`, `production`) | `development` | ❌ |

### JWT 설정

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `JWT_SECRET` | JWT 서명 시크릿 키 | - | ✅ |

> ⚠️ **주의**: 프로덕션에서는 반드시 안전한 시크릿 키를 사용하세요.

### Redis 설정

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `REDIS_URL` | Redis 연결 URL | `redis://localhost:6379` | ❌ |
| `REDIS_ENABLED` | Redis 활성화 여부 | `false` | ❌ |

### CORS 설정

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `CORS_ORIGIN` | 허용할 오리진 URL | `http://localhost:3000` | ❌ |

### 로깅 설정

| 변수 | 설명 | 기본값 | 필수 |
|------|------|--------|------|
| `LOG_LEVEL` | 로그 레벨 (`debug`, `info`, `warn`, `error`) | `debug` | ❌ |

---

## 환경별 설정 예시

### 개발 환경 (.env)

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### 프로덕션 환경

```env
# Server Configuration
PORT=4000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secure-production-secret-key

# Redis Configuration
REDIS_URL=redis://your-elasticache-endpoint:6379
REDIS_ENABLED=true

# CORS Configuration
CORS_ORIGIN=https://your-domain.com

# Logging
LOG_LEVEL=info
```

---

## AWS 환경 변수 관리

### ECS Task Definition

```json
{
  "containerDefinitions": [
    {
      "name": "socket-server",
      "environment": [
        { "name": "PORT", "value": "4000" },
        { "name": "NODE_ENV", "value": "production" },
        { "name": "REDIS_ENABLED", "value": "true" },
        { "name": "LOG_LEVEL", "value": "info" }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:jwt-secret"
        },
        {
          "name": "REDIS_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:redis-url"
        }
      ]
    }
  ]
}
```

---

**최종 업데이트**: 2026년 1월 31일
