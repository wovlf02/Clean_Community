# 🧩 모듈별 상세 설명

> 각 모듈의 역할과 구현 상세

---

## 1. main.py - 애플리케이션 엔트리포인트

### 역할
- FastAPI 앱 인스턴스 생성
- 라우터 등록
- CORS 미들웨어 설정
- 시작/종료 이벤트 핸들링
- 모델 로딩 관리

### 주요 코드 구조

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Hate Speech Detection API",
    description="한국어 혐오 표현 탐지 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 시작 이벤트 - 모델 로드
@app.on_event("startup")
async def startup_event():
    load_models()

# 라우터 등록
app.include_router(analyze_router)
```

---

## 2. config.py - 설정 관리

### 역할
- 환경 변수 로드
- 설정값 중앙 관리
- 환경별 설정 분리

### 주요 설정값

```python
class Settings:
    # 서버 설정
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # 모델 설정
    MODEL_DIR: str = "./models"
    DEVICE: str = "cpu"  # 또는 "cuda"
    
    # 모델 파일 경로
    KCELECTRA_PATH: str = "./models/kcelectra.pt"
    SOONGSIL_PATH: str = "./models/soongsil.pt"
    ROBERTA_PATH: str = "./models/roberta_base.pt"
```

---

## 3. models/classifier.py - 단일 모델 분류기

### 역할
- 개별 BERT 모델 로드
- 텍스트 토큰화
- 예측 수행

### 클래스 구조

```python
class HateSpeechClassifier:
    def __init__(self, model_name: str, model_path: str, device: str):
        """
        Args:
            model_name: HuggingFace 모델 이름
            model_path: 학습된 가중치 경로
            device: 'cpu' 또는 'cuda'
        """
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = self._load_model(model_path)
        
    def predict(self, text: str) -> np.ndarray:
        """
        텍스트에 대한 9개 라벨 확률 반환
        
        Args:
            text: 분석할 텍스트
            
        Returns:
            9개 라벨에 대한 확률 배열 (0~1)
        """
        inputs = self.tokenizer(text, return_tensors="pt", ...)
        outputs = self.model(**inputs)
        probs = torch.sigmoid(outputs.logits)
        return probs.numpy()
```

### 지원 모델

| 모델 | HuggingFace ID |
|------|----------------|
| KcELECTRA | `beomi/KcELECTRA-base` |
| SoongsilBERT | `soongsil-ai/soongsil-bert-base` |
| RoBERTa | `klue/roberta-base` |

---

## 4. models/ensemble.py - 앙상블 분류기

### 역할
- 3개 모델 통합 관리
- 가중 평균 앙상블
- 임계값 기반 라벨 결정

### 클래스 구조

```python
class EnsembleClassifier:
    def __init__(self):
        self.classifiers = {}  # 3개 모델
        self.weights = MODEL_WEIGHTS  # 가중치
        self.thresholds = THRESHOLDS  # 임계값
        
    def predict(self, text: str) -> Dict:
        """
        앙상블 예측 수행
        
        Returns:
            {
                "is_toxic": bool,
                "labels": List[str],
                "scores": Dict[str, float]
            }
        """
        # 각 모델 예측
        predictions = []
        for name, clf in self.classifiers.items():
            pred = clf.predict(text)
            predictions.append(pred * self.weights[name])
        
        # 가중 평균
        ensemble_scores = sum(predictions)
        
        # 임계값 적용
        labels = []
        for i, label in enumerate(LABELS):
            if ensemble_scores[i] >= self.thresholds[label]:
                labels.append(label)
        
        return {
            "is_toxic": len(labels) > 0,
            "labels": labels,
            "scores": {LABELS[i]: float(ensemble_scores[i]) for i in range(9)}
        }
```

### 앙상블 가중치

| 모델 | 가중치 | 역할 |
|------|--------|------|
| KcELECTRA | 0.35 | 슬랭/욕설 전문가 |
| SoongsilBERT | 0.33 | 안정적 베이스라인 |
| RoBERTa | 0.32 | 고맥락 의미론 전문가 |

---

## 5. schemas/request.py - 요청 스키마

### 역할
- API 요청 데이터 검증
- 타입 힌팅 및 문서화

### 스키마 정의

```python
from pydantic import BaseModel, Field
from typing import List

class AnalyzeRequest(BaseModel):
    """단일 텍스트 분석 요청"""
    text: str = Field(..., min_length=1, max_length=1000)
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "분석할 텍스트입니다"
            }
        }

class BatchAnalyzeRequest(BaseModel):
    """배치 텍스트 분석 요청"""
    texts: List[str] = Field(..., min_items=1, max_items=100)
```

---

## 6. schemas/response.py - 응답 스키마

### 역할
- API 응답 형식 정의
- 일관된 응답 구조 보장

### 스키마 정의

```python
class AnalyzeResult(BaseModel):
    """분석 결과"""
    is_toxic: bool
    labels: List[str]
    scores: Dict[str, float]

class AnalyzeResponse(BaseModel):
    """단일 분석 응답"""
    success: bool = True
    data: AnalyzeResult

class BatchAnalyzeResponse(BaseModel):
    """배치 분석 응답"""
    success: bool = True
    data: List[AnalyzeResult]
```

---

## 7. utils/constants.py - 상수 정의

### 역할
- 9개 혐오 라벨 정의
- 클래스별 최적화된 임계값
- 모델 가중치 정의

### 상수 정의

```python
# 9개 혐오 카테고리 라벨
LABELS = [
    "여성/가족",
    "남성",
    "성소수자",
    "인종/국적",
    "연령",
    "지역",
    "종교",
    "기타 혐오",
    "악플/욕설"
]

# 클래스별 최적화된 임계값
THRESHOLDS = {
    "여성/가족": 0.35,
    "남성": 0.22,
    "성소수자": 0.45,
    "인종/국적": 0.30,
    "연령": 0.30,
    "지역": 0.27,
    "종교": 0.30,
    "기타 혐오": 0.45,
    "악플/욕설": 0.40
}

# 모델 가중치
MODEL_WEIGHTS = {
    "kcelectra": 0.35,
    "soongsil": 0.33,
    "roberta": 0.32
}
```

---

## 8. services/model_loader.py - 모델 로더

### 역할
- 서버 시작 시 모델 로드
- 모델 인스턴스 관리
- 로드 상태 확인

### 주요 함수

```python
# 글로벌 분류기 인스턴스
_classifier: EnsembleClassifier = None

def load_models():
    """서버 시작 시 모델 로드"""
    global _classifier
    _classifier = EnsembleClassifier()
    _classifier.load_all_models()

def get_classifier() -> EnsembleClassifier:
    """분류기 인스턴스 반환"""
    if _classifier is None:
        raise RuntimeError("Models not loaded")
    return _classifier

def is_loaded() -> bool:
    """모델 로드 상태 확인"""
    return _classifier is not None
```
