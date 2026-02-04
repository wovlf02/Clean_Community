# AI Server - 감정분석 API

한국어 혐오 표현 탐지를 위한 FastAPI 기반 AI 모델 서버입니다.

## 📋 개요

- **프레임워크**: FastAPI 0.100+
- **Python 버전**: 3.11.9
- **AI 모델**: 3-모델 하이브리드 앙상블 (KcELECTRA, SoongsilBERT, RoBERTa-Base)
- **탐지 카테고리**: 9개 혐오 카테고리 동시 탐지

## 🚀 시작하기

### 1. 가상환경 생성 및 활성화

```bash
cd ai_server
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. 의존성 설치

```bash
# 프로덕션 의존성만
pip install -r requirements.txt

# 개발 의존성 포함
pip install -r requirements-dev.txt
```

### 3. 환경 변수 설정

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env

# .env 파일을 편집하여 설정 수정
```

### 4. 모델 파일 준비

모델 파일은 `ai_server/models/` 폴더에 위치해야 합니다:
- `kcelectra.pt`
- `soongsil.pt`
- `roberta_base.pt`

## 🏋️ 모델 학습 가이드

### 학습 환경 준비

모델 학습을 위해서는 별도의 학습 프로젝트(`ai-model/`)가 필요합니다.

```bash
# ai-model 프로젝트 디렉토리로 이동
cd ai-model

# 학습용 의존성 설치
pip install -r requirements.txt

# 데이터셋 준비 (data/ 폴더에 배치)
# - train.csv
# - valid.csv
# - test.csv
```

### 단일 모델 학습

```bash
# KcELECTRA 모델 학습
python src/train.py --model kcelectra --epochs 5 --batch-size 32

# SoongsilBERT 모델 학습
python src/train.py --model soongsil --epochs 5 --batch-size 32

# RoBERTa-Base 모델 학습
python src/train.py --model roberta --epochs 5 --batch-size 32
```

### 학습된 모델 파일 배치

학습이 완료되면 생성된 `.pt` 파일을 `ai_server/models/` 폴더로 복사합니다:

```bash
# Windows
copy ai-model\models\kcelectra.pt ai_server\models\
copy ai-model\models\soongsil.pt ai_server\models\
copy ai-model\models\roberta_base.pt ai_server\models\

# macOS/Linux
cp ai-model/models/kcelectra.pt ai_server/models/
cp ai-model/models/soongsil.pt ai_server/models/
cp ai-model/models/roberta_base.pt ai_server/models/
```

### 모델 평가

```bash
# 단일 모델 평가
python src/evaluate.py --model kcelectra

# 앙상블 모델 평가
python src/ensemble_evaluate.py
```

## 🖥️ FastAPI 서버 실행 가이드

### 방법 1: run_server.py 스크립트 사용 (권장)

```bash
# Clean_Community 프로젝트 루트에서 실행
python ai_server/run_server.py
```

### 방법 2: uvicorn 직접 실행

```bash
# Clean_Community 프로젝트 루트에서 실행
uvicorn ai_server.app.main:app --reload --host 0.0.0.0 --port 8000
```

### 방법 3: 배포 환경에서 실행 (프로덕션)

```bash
# 리로드 비활성화, 워커 프로세스 사용
uvicorn ai_server.app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 방법 4: Docker 사용

```bash
# Docker 이미지 빌드
docker build -t ai-server:latest ./ai_server

# Docker 컨테이너 실행
docker run -d -p 8000:8000 --name ai-server ai-server:latest
```

### 서버 동작 확인

서버가 실행되면 다음 URL에서 확인할 수 있습니다:

- **API 문서 (Swagger UI)**: http://localhost:8000/docs
- **API 문서 (ReDoc)**: http://localhost:8000/redoc
- **헬스체크**: http://localhost:8000/health
- **루트 엔드포인트**: http://localhost:8000/

### API 테스트 예시

```bash
# 헬스체크
curl http://localhost:8000/health

# 단일 텍스트 분석
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"테스트 문장입니다\"}"

# 배치 분석
curl -X POST "http://localhost:8000/analyze/batch" \
  -H "Content-Type: application/json" \
  -d "{\"texts\": [\"문장1\", \"문장2\", \"문장3\"]}"
```

### Python에서 API 호출

```python
import requests

# 단일 텍스트 분석
response = requests.post(
    "http://localhost:8000/analyze",
    json={"text": "테스트 문장입니다"}
)
result = response.json()
print(result)
```

## 📁 프로젝트 구조

```
ai_server/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 앱 엔트리포인트
│   ├── config.py               # 설정 및 환경 변수
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── analyze.py      # 감정분석 API 라우트
│   │       └── health.py       # 헬스체크 라우트
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── classifier.py       # MultiLabelClassifier 정의
│   │   └── ensemble.py         # 앙상블 모델 래퍼
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── request.py          # 요청 스키마 (Pydantic)
│   │   └── response.py         # 응답 스키마 (Pydantic)
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── model_loader.py     # 모델 로딩 서비스
│   │
│   └── utils/
│       ├── __init__.py
│       ├── text_processor.py   # 텍스트 전처리
│       └── constants.py        # 상수 정의 (라벨명 등)
│
├── tests/
│   └── __init__.py
│
├── .env.example
├── .gitignore
├── requirements.txt
├── requirements-dev.txt
└── README.md
```

## 📚 API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/` | GET | API 정보 |
| `/health` | GET | 서버 헬스체크 |
| `/analyze` | POST | 단일 텍스트 감정분석 |
| `/analyze/batch` | POST | 배치 텍스트 분석 |
| `/docs` | GET | Swagger UI 문서 |
| `/redoc` | GET | ReDoc 문서 |

## 🔧 환경 변수 설정

`.env` 파일에서 다음 설정을 변경할 수 있습니다:

```env
# 서버 설정
HOST=0.0.0.0
PORT=8000
DEBUG=False

# 모델 설정
MODEL_PATH=./models
KCELECTRA_MODEL=beomi/KcELECTRA-base
SOONGSIL_MODEL=snunlp/KR-SBERT-V40K-klueNLI-augSTS
ROBERTA_MODEL=klue/roberta-base

# 앙상블 가중치
KCELECTRA_WEIGHT=0.35
SOONGSIL_WEIGHT=0.33
ROBERTA_WEIGHT=0.32

# 추론 설정
MAX_LENGTH=128
BATCH_SIZE=32

# CORS 설정
CORS_ORIGINS=http://localhost:3000

# 로깅
LOG_LEVEL=INFO
```

## 🐛 트러블슈팅

### 모델 로드 실패

```bash
# 모델 파일 경로 확인
ls ai_server/models/

# 필요한 파일:
# - kcelectra.pt
# - soongsil.pt
# - roberta_base.pt
```

### CUDA 메모리 부족

```python
# config.py에서 배치 크기 줄이기
BATCH_SIZE=16  # 기본값 32에서 줄임
```

### 포트 충돌

```bash
# 다른 포트로 실행
uvicorn ai_server.app.main:app --port 8001
```

## 🔗 관련 문서

- [프로젝트 구조 TODO](../docs/08_todo/model_server/01_프로젝트_구조.md)
- [환경 설정 TODO](../docs/08_todo/model_server/02_환경_설정.md)
- [모델 로딩 TODO](../docs/08_todo/model_server/03_모델_로딩.md)
- [API 엔드포인트 TODO](../docs/08_todo/model_server/04_API_엔드포인트.md)
