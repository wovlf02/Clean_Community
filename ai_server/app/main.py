"""
FastAPI 메인 애플리케이션

감정분석 AI 모델 서버의 엔트리포인트입니다.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .api.routes import analyze, health
from .services.model_loader import load_models
from .config import settings


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
cors_origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
    """API 루트 엔드포인트"""
    return {
        "message": "Emotion Analysis API",
        "docs": "/docs",
        "health": "/health"
    }
