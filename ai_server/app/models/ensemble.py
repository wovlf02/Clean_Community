"""
앙상블 모델 래퍼

3-모델 하이브리드 앙상블 예측기를 구현합니다.
참고: ai-model/docs/03_모델_아키텍처.md - 4. 앙상블 전략
"""
import torch
import numpy as np
from typing import List, Dict

from ..services.model_loader import get_models, get_tokenizers, get_device
from ..config import settings
from ..utils.constants import LABELS, THRESHOLDS, MODEL_WEIGHTS


class EnsemblePredictor:
    """
    3-모델 하이브리드 앙상블 예측기

    KcELECTRA, SoongsilBERT, RoBERTa-Base 모델의 예측을
    가중 소프트 보팅으로 앙상블합니다.
    """

    def __init__(self):
        """앙상블 예측기 초기화"""
        self.models = get_models()
        self.tokenizers = get_tokenizers()
        self.device = get_device()
        self.labels = LABELS
        self.thresholds = [THRESHOLDS[label] for label in LABELS]
        self.weights = MODEL_WEIGHTS

    def _tokenize(
        self,
        text: str,
        tokenizer
    ) -> Dict[str, torch.Tensor]:
        """
        텍스트를 토크나이징합니다.

        Args:
            text: 입력 텍스트
            tokenizer: HuggingFace 토크나이저

        Returns:
            토크나이즈된 입력 텐서 딕셔너리
        """
        inputs = tokenizer(
            text,
            return_tensors="pt",
            padding="max_length",
            truncation=True,
            max_length=settings.MAX_LENGTH
        )
        return {k: v.to(self.device) for k, v in inputs.items()}

    def _get_model_probs(
        self,
        text: str,
        model_name: str
    ) -> np.ndarray:
        """
        단일 모델의 확률 예측을 반환합니다.

        Args:
            text: 입력 텍스트
            model_name: 모델 식별자

        Returns:
            각 라벨별 확률 배열 [9]
        """
        model = self.models[model_name]
        tokenizer = self.tokenizers[model_name]

        inputs = self._tokenize(text, tokenizer)

        with torch.no_grad():
            logits = model(
                input_ids=inputs['input_ids'],
                attention_mask=inputs['attention_mask']
            )
            probs = torch.sigmoid(logits).cpu().numpy()[0]  # [9]

        return probs

    def predict(self, text: str) -> Dict:
        """
        가중 소프트 보팅을 통한 앙상블 예측

        Args:
            text: 분석할 텍스트

        Returns:
            dict: {
                "text": "입력 텍스트",
                "labels": ["여성/가족", "악플/욕설"],
                "scores": {"여성/가족": 0.92, "악플/욕설": 0.85, ...},
                "is_toxic": True
            }
        """
        # 1. 각 모델별 확률 예측
        weighted_probs = np.zeros(len(self.labels))

        for model_name, weight in self.weights.items():
            probs = self._get_model_probs(text, model_name)
            weighted_probs += probs * weight

        # 2. 클래스별 임계값 적용
        detected_labels = []
        scores = {}

        for i, (label, prob, threshold) in enumerate(
            zip(self.labels, weighted_probs, self.thresholds)
        ):
            scores[label] = float(round(prob, 4))
            if prob > threshold:
                detected_labels.append(label)

        # 3. 결과 반환
        return {
            "text": text,
            "labels": detected_labels,
            "scores": scores,
            "is_toxic": len(detected_labels) > 0
        }

    def predict_batch(self, texts: List[str]) -> List[Dict]:
        """
        배치 텍스트 예측

        Args:
            texts: 분석할 텍스트 리스트

        Returns:
            예측 결과 리스트
        """
        return [self.predict(text) for text in texts]


# 싱글톤 인스턴스
_predictor: EnsemblePredictor = None


def get_predictor() -> EnsemblePredictor:
    """앙상블 예측기 인스턴스 반환"""
    global _predictor
    if _predictor is None:
        _predictor = EnsemblePredictor()
    return _predictor


def reset_predictor() -> None:
    """예측기 인스턴스 초기화 (테스트용)"""
    global _predictor
    _predictor = None
