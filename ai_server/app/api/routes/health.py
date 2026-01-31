"""
헬스체크 API 라우트
"""
from fastapi import APIRouter

from ...schemas.response import HealthResponse
from ...services.model_loader import get_models, get_device

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
