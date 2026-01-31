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
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows
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
cp .env.example .env
# .env 파일을 편집하여 설정 수정
```

### 4. 모델 파일 준비

모델 파일은 `ai-model/models/` 폴더에 위치해야 합니다:
- `kcelectra.pt`
- `soongsil.pt`
- `roberta_base.pt`

### 5. 서버 실행

```bash
# 프로젝트 루트에서 실행
cd ..  # Clean_Community 루트로 이동
uvicorn ai_server.app.main:app --reload --host 0.0.0.0 --port 8000
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

## 🔗 관련 문서

- [프로젝트 구조 TODO](../docs/08_todo/model_server/01_프로젝트_구조.md)
- [환경 설정 TODO](../docs/08_todo/model_server/02_환경_설정.md)
- [모델 로딩 TODO](../docs/08_todo/model_server/03_모델_로딩.md)
- [API 엔드포인트 TODO](../docs/08_todo/model_server/04_API_엔드포인트.md)
