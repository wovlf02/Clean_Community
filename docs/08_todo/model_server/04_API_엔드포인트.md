# 04. API 엔드포인트

**관련 문서**: [시스템 설계](../../03_architecture/system-design.md) | [API 명세서](../../12_api/README.md) | [기능 요구사항](../../02_requirements/functional.md)

---

## 📋 개요

이 문서는 FastAPI 감정분석 서버의 REST API 엔드포인트 설계 및 구현을 설명합니다.

---

## ✅ 체크리스트

- [ ] Pydantic 요청/응답 스키마 정의
- [ ] `POST /analyze` 엔드포인트 구현
- [ ] `POST /analyze/batch` 엔드포인트 구현
- [ ] `GET /health` 헬스체크 구현
- [ ] 에러 핸들링 구현
- [ ] CORS 설정
- [ ] Rate Limiting 적용
- [ ] OpenAPI 문서 설정

---

## 1. API 개요

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/analyze` | POST | 단일 텍스트 감정분석 |
| `/analyze/batch` | POST | 다중 텍스트 배치 분석 |
| `/health` | GET | 서버 헬스체크 |
| `/docs` | GET | OpenAPI 문서 (Swagger UI) |

---

## 2. 스키마 정의

### 2.1 app/schemas/request.py

```python
from pydantic import BaseModel, Field
from typing import List

class AnalyzeRequest(BaseModel):
    """단일 텍스트 분석 요청"""
    text: str = Field(
        ..., 
        min_length=1, 
        max_length=1000,
        description="분석할 한국어 텍스트",
        examples=["이 게시글의 내용입니다."]
    )

class BatchAnalyzeRequest(BaseModel):
    """배치 텍스트 분석 요청"""
    texts: List[str] = Field(
        ..., 
        min_length=1,
        max_length=100,
        description="분석할 텍스트 리스트 (최대 100개)",
        examples=[["첫 번째 텍스트", "두 번째 텍스트"]]
    )
```

### 2.2 app/schemas/response.py

```python
from pydantic import BaseModel
from typing import List, Dict, Optional

class AnalyzeResult(BaseModel):
    """분석 결과"""
    text: str
    labels: List[str] = Field(
        description="감지된 혐오 라벨 목록"
    )
    scores: Dict[str, float] = Field(
        description="각 라벨별 신뢰도 점수 (0.0 ~ 1.0)"
    )
    is_toxic: bool = Field(
        description="악성 표현 감지 여부"
    )

class AnalyzeResponse(BaseModel):
    """단일 분석 응답"""
    data: AnalyzeResult
    message: str = "분석 완료"

class BatchAnalyzeResponse(BaseModel):
    """배치 분석 응답"""
    data: List[AnalyzeResult]
    count: int
    message: str = "배치 분석 완료"

class HealthResponse(BaseModel):
    """헬스체크 응답"""
    status: str = "healthy"
    models_loaded: bool
    device: str
    version: str

class ErrorResponse(BaseModel):
    """에러 응답"""
    error: Dict[str, str] = Field(
        description="에러 정보",
        examples=[{"code": "INVALID_TEXT", "message": "텍스트가 비어있습니다."}]
    )
```

---

## 3. API 라우트 구현

### 3.1 app/api/routes/analyze.py

```python
from fastapi import APIRouter, HTTPException
from typing import List

from app.schemas.request import AnalyzeRequest, BatchAnalyzeRequest
from app.schemas.response import (
    AnalyzeResponse, 
    BatchAnalyzeResponse, 
    AnalyzeResult
)
from app.models.ensemble import get_predictor
from app.utils.text_processor import preprocess_text

router = APIRouter()

@router.post(
    "",
    response_model=AnalyzeResponse,
    summary="단일 텍스트 감정분석",
    description="""
    한국어 텍스트의 혐오 표현을 분석합니다.
    
    **9개 혐오 카테고리:**
    - 여성/가족, 남성, 성소수자, 인종/국적
    - 연령, 지역, 종교, 기타 혐오, 악플/욕설
    
    **참고:** FR-40, FR-41, FR-42 (기능 요구사항)
    """
)
async def analyze_text(request: AnalyzeRequest) -> AnalyzeResponse:
    """단일 텍스트 감정분석 API"""
    try:
        # 1. 텍스트 전처리
        processed_text = preprocess_text(request.text)
        
        if not processed_text:
            raise HTTPException(
                status_code=400,
                detail={"code": "EMPTY_TEXT", "message": "유효한 텍스트가 없습니다."}
            )
        
        # 2. 앙상블 예측
        predictor = get_predictor()
        result = predictor.predict(processed_text)
        
        # 3. 응답 반환
        return AnalyzeResponse(
            data=AnalyzeResult(**result),
            message="분석 완료"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "ANALYSIS_ERROR", "message": str(e)}
        )

@router.post(
    "/batch",
    response_model=BatchAnalyzeResponse,
    summary="배치 텍스트 감정분석",
    description="여러 텍스트를 한 번에 분석합니다. (최대 100개)"
)
async def analyze_batch(request: BatchAnalyzeRequest) -> BatchAnalyzeResponse:
    """배치 텍스트 감정분석 API"""
    try:
        predictor = get_predictor()
        
        # 각 텍스트 전처리 및 분석
        results = []
        for text in request.texts:
            processed = preprocess_text(text)
            if processed:
                result = predictor.predict(processed)
                results.append(AnalyzeResult(**result))
        
        return BatchAnalyzeResponse(
            data=results,
            count=len(results),
            message=f"{len(results)}개 텍스트 분석 완료"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "BATCH_ANALYSIS_ERROR", "message": str(e)}
        )
```

### 3.2 app/api/routes/health.py

```python
from fastapi import APIRouter
import torch

from app.schemas.response import HealthResponse
from app.services.model_loader import get_models, get_device

router = APIRouter()

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="서버 헬스체크",
    description="서버 상태 및 모델 로드 상태를 확인합니다."
)
async def health_check() -> HealthResponse:
    """헬스체크 API"""
    models = get_models()
    device = get_device()
    
    return HealthResponse(
        status="healthy",
        models_loaded=len(models) == 3,
        device=str(device),
        version="1.0.0"
    )
```

---

## 4. 텍스트 전처리

### 4.1 app/utils/text_processor.py

```python
import re
from typing import Optional

def preprocess_text(text: str) -> Optional[str]:
    """
    텍스트 전처리
    
    - 앞뒤 공백 제거
    - 연속 공백 정리
    - 빈 텍스트 처리
    """
    if not text:
        return None
    
    # 앞뒤 공백 제거
    text = text.strip()
    
    # 연속 공백을 단일 공백으로
    text = re.sub(r'\s+', ' ', text)
    
    # 빈 문자열 체크
    if not text:
        return None
    
    return text
```

---

## 5. 메인 애플리케이션

### 5.1 app/main.py (완성본)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import analyze, health
from app.services.model_loader import load_models
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 라이프사이클 관리"""
    # 시작 시 모델 로드
    print("🚀 서버 시작...")
    load_models()
    yield
    # 종료 시 정리
    print("👋 서버 종료...")

app = FastAPI(
    title="Emotion Analysis API",
    description="""
    ## 한국어 혐오 표현 탐지 AI API
    
    3-모델 하이브리드 앙상블을 통해 9개 혐오 카테고리를 동시에 탐지합니다.
    
    ### 혐오 카테고리
    - 여성/가족, 남성, 성소수자, 인종/국적
    - 연령, 지역, 종교, 기타 혐오, 악플/욕설
    
    ### 성능
    - Hamming Accuracy: 96.72%
    - F1-Macro: 82.91%
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정 (Next.js 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(analyze.router, prefix="/analyze", tags=["감정분석"])
app.include_router(health.router, tags=["헬스체크"])

# 루트 엔드포인트
@app.get("/")
async def root():
    return {
        "message": "Emotion Analysis API",
        "docs": "/docs",
        "health": "/health"
    }
```

---

## 6. API 응답 예시

### 6.1 단일 분석 (`POST /analyze`)

**요청:**
```json
{
  "text": "김치녀들은 진짜 답이 없다"
}
```

**응답:**
```json
{
  "data": {
    "text": "김치녀들은 진짜 답이 없다",
    "labels": ["여성/가족", "악플/욕설"],
    "scores": {
      "여성/가족": 0.88,
      "남성": 0.04,
      "성소수자": 0.02,
      "인종/국적": 0.02,
      "연령": 0.01,
      "지역": 0.02,
      "종교": 0.01,
      "기타 혐오": 0.02,
      "악플/욕설": 0.79
    },
    "is_toxic": true
  },
  "message": "분석 완료"
}
```

### 6.2 정상 텍스트 분석

**요청:**
```json
{
  "text": "오늘 날씨가 정말 좋네요"
}
```

**응답:**
```json
{
  "data": {
    "text": "오늘 날씨가 정말 좋네요",
    "labels": [],
    "scores": {
      "여성/가족": 0.02,
      "남성": 0.01,
      "성소수자": 0.01,
      "인종/국적": 0.01,
      "연령": 0.01,
      "지역": 0.01,
      "종교": 0.01,
      "기타 혐오": 0.01,
      "악플/욕설": 0.03
    },
    "is_toxic": false
  },
  "message": "분석 완료"
}
```

---

## 7. 에러 응답

| HTTP 코드 | 코드 | 설명 |
|-----------|------|------|
| 400 | EMPTY_TEXT | 빈 텍스트 |
| 400 | INVALID_TEXT | 유효하지 않은 텍스트 |
| 500 | ANALYSIS_ERROR | 분석 중 오류 |
| 500 | MODEL_NOT_LOADED | 모델 미로드 |

**예시:**
```json
{
  "error": {
    "code": "EMPTY_TEXT",
    "message": "유효한 텍스트가 없습니다."
  }
}
```

---

## 🔗 참고 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| 시스템 설계 | `docs/03_architecture/system-design.md` | AI Server 레이어 다이어그램 |
| API 명세서 | `docs/12_api/README.md` | 응답 형식 참고 |
| 기능 요구사항 | `docs/02_requirements/functional.md` | FR-40~44 (AI 감정분석 요구사항) |

---

**이전 문서**: [03_모델_로딩.md](./03_모델_로딩.md)  
**다음 문서**: [05_NextJS_연동.md](./05_NextJS_연동.md)
