"""
다중 라벨 분류기 모델 정의

참고: ai-model/docs/03_모델_아키텍처.md - 3. 분류기 헤드 설계

중요: 이 모델 구조는 ai-model/src/model.py와 완전히 동일해야 합니다.
학습 시와 추론 시의 모델 구조가 다르면 가중치 로드가 실패합니다.
"""
import torch
import torch.nn as nn
from transformers import AutoModel, AutoConfig
from typing import Optional


class MultiLabelClassifier(nn.Module):
    """
    다중 라벨 분류를 위한 BERT 기반 분류기

    Attributes:
        encoder: HuggingFace 사전학습 모델
        dropout1, dropout2: 드롭아웃 레이어 (학습 시 과적합 방지)
        classifier: 최종 분류기 헤드 (Linear)

    Note:
        모델 구조는 ai-model/src/model.py의 MultiLabelClassifier와
        완전히 동일해야 합니다. (dropout1, dropout2, classifier 레이어)
    """

    def __init__(
        self,
        model_name: str,
        num_labels: int = 9,
        dropout_rate: float = 0.3,
        config: Optional[AutoConfig] = None
    ):
        """
        Args:
            model_name: HuggingFace 모델명
            num_labels: 라벨 개수 (기본 9개)
            dropout_rate: 드롭아웃 비율
            config: 미리 로드된 config (추론 시 사용)
        """
        super().__init__()

        # 1. 사전학습 모델 로드
        # config가 제공되면 로컬 config 사용 (추론 전용)
        if config is not None:
            self.encoder = AutoModel.from_config(config)
            hidden_size = config.hidden_size
        else:
            # 학습 시에는 HuggingFace에서 다운로드
            self.encoder = AutoModel.from_pretrained(model_name)
            hidden_size = self.encoder.config.hidden_size  # 768

        # 2. 분류기 헤드 - ai-model/src/model.py와 동일한 구조
        # 중요: 학습 시 모델과 정확히 같은 레이어 이름을 사용해야 함
        self.dropout1 = nn.Dropout(dropout_rate)
        self.dropout2 = nn.Dropout(dropout_rate * 0.5)  # 0.15
        self.classifier = nn.Linear(hidden_size, num_labels)

    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor
    ) -> torch.Tensor:
        """
        순전파 연산

        Args:
            input_ids: 토큰 ID 텐서 [batch, seq_len]
            attention_mask: 어텐션 마스크 [batch, seq_len]

        Returns:
            logits: 분류 로짓 [batch, num_labels]
        """
        # [CLS] 토큰 임베딩 추출
        outputs = self.encoder(input_ids, attention_mask)
        cls_embedding = outputs.last_hidden_state[:, 0, :]  # [batch, 768]

        # 분류 - ai-model/src/model.py와 동일한 순서
        # 추론 시에는 eval 모드이므로 dropout은 비활성화됨
        pooled_output = self.dropout1(cls_embedding)
        pooled_output = self.dropout2(pooled_output)
        logits = self.classifier(pooled_output)  # [batch, 9]

        return logits
