"""
응답 스키마 정의 (Pydantic)
"""
from pydantic import BaseModel, Field
from typing import List, Dict


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


class ErrorDetail(BaseModel):
    """에러 상세 정보"""
    code: str
    message: str


class ErrorResponse(BaseModel):
    """에러 응답"""
    error: ErrorDetail = Field(
        description="에러 정보"
    )
