"""
감정분석 API 라우트
"""
from fastapi import APIRouter, HTTPException

from ...schemas.request import AnalyzeRequest, BatchAnalyzeRequest
from ...schemas.response import (
    AnalyzeResponse,
    BatchAnalyzeResponse,
    AnalyzeResult
)
from ...models.ensemble import get_predictor
from ...utils.text_processor import preprocess_text
from ...services.model_loader import is_models_loaded

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
        # 모델 로드 확인
        if not is_models_loaded():
            raise HTTPException(
                status_code=503,
                detail={"code": "MODEL_NOT_LOADED", "message": "모델이 아직 로드되지 않았습니다."}
            )

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
        # 모델 로드 확인
        if not is_models_loaded():
            raise HTTPException(
                status_code=503,
                detail={"code": "MODEL_NOT_LOADED", "message": "모델이 아직 로드되지 않았습니다."}
            )

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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "BATCH_ANALYSIS_ERROR", "message": str(e)}
        )
