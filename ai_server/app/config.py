"""
환경 변수 및 설정 관리
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """애플리케이션 설정"""

    # 서버 설정
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # 모델 설정 - ai_server/models 폴더 경로
    MODEL_PATH: str = "./models"
    KCELECTRA_MODEL: str = "beomi/KcELECTRA-base"
    SOONGSIL_MODEL: str = "snunlp/KR-SBERT-V40K-klueNLI-augSTS"  # 실제 학습에 사용된 모델
    ROBERTA_MODEL: str = "klue/roberta-base"

    # 앙상블 가중치
    KCELECTRA_WEIGHT: float = 0.35
    SOONGSIL_WEIGHT: float = 0.33
    ROBERTA_WEIGHT: float = 0.32

    # 추론 설정
    MAX_LENGTH: int = 128
    BATCH_SIZE: int = 32

    # CORS 설정 (Next.js 연동)
    CORS_ORIGINS: str = "http://localhost:3000"

    # 로깅
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
