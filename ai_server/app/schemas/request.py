"""
요청 스키마 정의 (Pydantic)
"""
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
