# 📁 디렉토리 구조

> AI 서버의 파일 및 폴더 구성

## 전체 구조

```
ai_server/
├── app/                        # 메인 애플리케이션
│   ├── __init__.py
│   ├── main.py                 # FastAPI 앱 엔트리포인트
│   ├── config.py               # 설정 관리
│   │
│   ├── api/                    # API 라우터
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── analyze.py      # 분석 엔드포인트
│   │
│   ├── models/                 # AI 모델 클래스
│   │   ├── __init__.py
│   │   ├── classifier.py       # 단일 모델 분류기
│   │   └── ensemble.py         # 앙상블 분류기
│   │
│   ├── schemas/                # Pydantic 스키마
│   │   ├── __init__.py
│   │   ├── request.py          # 요청 스키마
│   │   └── response.py         # 응답 스키마
│   │
│   ├── services/               # 비즈니스 로직
│   │   ├── __init__.py
│   │   └── model_loader.py     # 모델 로드 서비스
│   │
│   └── utils/                  # 유틸리티
│       ├── __init__.py
│       └── constants.py        # 상수 정의
│
├── models/                     # 학습된 모델 파일
│   ├── kcelectra.pt           # KcELECTRA 모델 (434MB)
│   ├── roberta_base.pt        # RoBERTa 모델 (442MB)
│   └── soongsil.pt            # SoongsilBERT 모델 (467MB)
│
├── docs/                       # 문서
│   ├── README.md
│   ├── 01_architecture/
│   ├── 02_api/
│   ├── 03_deployment/
│   └── 04_models/
│
├── .env.example               # 환경 변수 템플릿
├── .gitignore                 # Git 제외 파일
├── Dockerfile                 # Docker 이미지 빌드
├── README.md                  # 프로젝트 설명
├── requirements.txt           # 프로덕션 의존성
├── requirements-dev.txt       # 개발 의존성
├── run_server.py              # 서버 실행 스크립트
└── start_server.sh            # 서버 시작 쉘
```

---

## 📂 각 디렉토리 설명

### `app/` - 메인 애플리케이션

FastAPI 애플리케이션의 핵심 코드가 위치합니다.

#### `app/main.py`
- FastAPI 앱 인스턴스 생성
- 라우터 등록
- 미들웨어 설정
- 시작/종료 이벤트 핸들러

#### `app/config.py`
- 환경 변수 관리
- 설정 클래스 정의

### `app/api/` - API 라우터

#### `app/api/routes/analyze.py`
- `/analyze` 엔드포인트
- `/batch` 엔드포인트
- `/health` 엔드포인트

### `app/models/` - AI 모델

#### `app/models/classifier.py`
```python
class HateSpeechClassifier:
    """단일 모델 분류기"""
    def __init__(self, model_name: str, model_path: str)
    def predict(self, text: str) -> np.ndarray
```

#### `app/models/ensemble.py`
```python
class EnsembleClassifier:
    """3-모델 앙상블 분류기"""
    def __init__(self)
    def predict(self, text: str) -> Dict
    def predict_batch(self, texts: List[str]) -> List[Dict]
```

### `app/schemas/` - Pydantic 스키마

#### `app/schemas/request.py`
```python
class AnalyzeRequest(BaseModel):
    text: str

class BatchAnalyzeRequest(BaseModel):
    texts: List[str]
```

#### `app/schemas/response.py`
```python
class AnalyzeResponse(BaseModel):
    is_toxic: bool
    labels: List[str]
    scores: Dict[str, float]
```

### `app/utils/` - 유틸리티

#### `app/utils/constants.py`
```python
LABELS = ["여성/가족", "남성", ...]  # 9개 라벨
THRESHOLDS = {"여성/가족": 0.35, ...}  # 클래스별 임계값
MODEL_WEIGHTS = {"kcelectra": 0.35, ...}  # 모델 가중치
```

### `models/` - 학습된 모델

| 파일 | 크기 | 모델 |
|------|------|------|
| `kcelectra.pt` | 434MB | KcELECTRA |
| `roberta_base.pt` | 442MB | KLUE-RoBERTa |
| `soongsil.pt` | 467MB | SoongsilBERT |

> **총 용량**: 약 1.3GB

---

## 📄 루트 파일 설명

| 파일 | 설명 |
|------|------|
| `Dockerfile` | Docker 이미지 빌드 설정 |
| `requirements.txt` | 프로덕션 Python 패키지 |
| `requirements-dev.txt` | 개발용 Python 패키지 |
| `run_server.py` | 서버 실행 스크립트 |
| `start_server.sh` | 쉘 시작 스크립트 |
| `.env.example` | 환경 변수 템플릿 |
