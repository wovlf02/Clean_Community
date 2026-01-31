"""
텍스트 전처리 유틸리티
"""
import re
from typing import Optional


def preprocess_text(text: str) -> Optional[str]:
    """
    텍스트 전처리

    - 앞뒤 공백 제거
    - 연속 공백 정리
    - 빈 텍스트 처리

    Args:
        text: 입력 텍스트

    Returns:
        전처리된 텍스트 또는 None (빈 텍스트인 경우)
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
