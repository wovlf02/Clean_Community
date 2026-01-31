# 🚀 배포 가이드

> AI 혐오 표현 탐지 API 서버 배포 방법

---

## 📋 개요

| 배포 방식 | 설명 | 권장 환경 |
|-----------|------|-----------|
| 로컬 실행 | Python 직접 실행 | 개발/테스트 |
| Docker | 컨테이너 배포 | 프로덕션 |
| Docker Compose | 멀티 서비스 | 전체 스택 |

---

## 📖 상세 문서

- [Docker 설정](./docker.md) - Dockerfile 및 컨테이너 설정
- [프로덕션 배포](./production.md) - AWS/클라우드 배포 가이드

---

## 🖥️ 로컬 실행

### 1. 환경 설정

```bash
cd ai_server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 모델 파일 확인

```bash
ls -la models/
# kcelectra.pt (434MB)
# roberta_base.pt (442MB)
# soongsil.pt (467MB)
```

### 3. 서버 실행

```bash
# 방법 1: run_server.py 사용
python run_server.py

# 방법 2: uvicorn 직접 실행
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 방법 3: 쉘 스크립트 사용
./start_server.sh
```

### 4. 서버 확인

```bash
curl http://localhost:8000/health
```

---

## 🐳 Docker 배포

### 1. 이미지 빌드

```bash
docker build -t hate-speech-api:latest .
```

### 2. 컨테이너 실행

```bash
docker run -d \
  --name hate-speech-api \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  hate-speech-api:latest
```

### 3. 로그 확인

```bash
docker logs -f hate-speech-api
```

### 4. 컨테이너 중지

```bash
docker stop hate-speech-api
docker rm hate-speech-api
```

---

## 📊 시스템 요구사항

### 최소 사양

| 항목 | 요구사항 |
|------|----------|
| CPU | 2 cores |
| RAM | 4GB |
| 디스크 | 5GB (모델 포함) |
| Python | 3.11+ |

### 권장 사양

| 항목 | 권장사항 |
|------|----------|
| CPU | 4+ cores |
| RAM | 8GB+ |
| GPU | CUDA 지원 (선택) |
| 디스크 | 10GB+ |

---

## 🔧 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `HOST` | `0.0.0.0` | 바인딩 호스트 |
| `PORT` | `8000` | 서버 포트 |
| `MODEL_DIR` | `./models` | 모델 디렉토리 |
| `DEVICE` | `cpu` | 추론 장치 (`cpu`/`cuda`) |
| `LOG_LEVEL` | `INFO` | 로그 레벨 |

### .env 파일 예시

```env
HOST=0.0.0.0
PORT=8000
MODEL_DIR=./models
DEVICE=cpu
LOG_LEVEL=INFO
```

---

## 🏥 헬스 체크

### 엔드포인트
```
GET /health
```

### 정상 응답
```json
{
  "status": "healthy",
  "models_loaded": true,
  "model_count": 3
}
```

### Docker 헬스체크 설정

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

---

## 🔒 보안 고려사항

1. **Rate Limiting**: 과도한 요청 제한
2. **Input Validation**: 입력 텍스트 길이 제한 (1000자)
3. **CORS 설정**: 허용된 도메인만 접근
4. **HTTPS**: 프로덕션에서 반드시 사용

---

## 📈 모니터링

### 로그 레벨

| 레벨 | 용도 |
|------|------|
| `DEBUG` | 개발 디버깅 |
| `INFO` | 일반 운영 |
| `WARNING` | 경고 |
| `ERROR` | 오류 |

### 주요 로그 항목

- 서버 시작/종료
- 모델 로드 상태
- API 요청/응답
- 에러 발생
