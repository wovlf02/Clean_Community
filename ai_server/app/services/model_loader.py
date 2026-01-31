"""
모델 로딩 서비스

학습된 PyTorch 모델 파일(.pt)을 로드하고 관리합니다.
"""
import os
import torch
from typing import Dict, Tuple
from transformers import AutoTokenizer

from ..models.classifier import MultiLabelClassifier
from ..config import settings
from ..utils.constants import LABELS

# 전역 변수로 로드된 모델 저장
_models: Dict[str, MultiLabelClassifier] = {}
_tokenizers: Dict[str, AutoTokenizer] = {}
_device: torch.device = None


def get_device() -> torch.device:
    """
    사용 가능한 디바이스 반환 (GPU 우선)

    Returns:
        torch.device: CUDA 사용 가능시 cuda, 아니면 cpu
    """
    global _device
    if _device is None:
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    return _device


def load_single_model(
    model_name: str,
    checkpoint_path: str,
    hf_model_name: str
) -> Tuple[MultiLabelClassifier, AutoTokenizer]:
    """
    단일 모델과 토크나이저를 로드합니다.

    추론 전용: .pt 파일에서 전체 가중치를 로드하고,
    토크나이저만 HuggingFace에서 다운로드합니다.

    Args:
        model_name: 모델 식별자 (kcelectra, soongsil, roberta)
        checkpoint_path: .pt 파일 경로
        hf_model_name: HuggingFace 모델명 (토크나이저용)

    Returns:
        (model, tokenizer) 튜플
    """
    device = get_device()

    print(f"📦 {model_name} 로딩 중... (파일: {checkpoint_path})")

    # 1. 체크포인트 로드
    checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=False)

    # 2. state_dict 추출
    if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
        state_dict = checkpoint['model_state_dict']
        best_f1 = checkpoint.get('best_f1', 'N/A')
    elif isinstance(checkpoint, dict) and 'encoder.embeddings.word_embeddings.weight' in checkpoint:
        state_dict = checkpoint
        best_f1 = 'N/A'
    else:
        raise ValueError(f"알 수 없는 체크포인트 형식: {type(checkpoint)}")

    # 3. state_dict에서 encoder config 추출 (hidden_size 확인)
    # 대부분의 BERT 계열 모델은 768 hidden_size 사용
    from transformers import AutoConfig

    # 토크나이저만 HuggingFace에서 다운로드
    tokenizer = AutoTokenizer.from_pretrained(hf_model_name)

    # Config도 HuggingFace에서 다운로드 (모델 구조 정보만 필요)
    config = AutoConfig.from_pretrained(hf_model_name)

    # 4. 모델 구조 생성 (가중치 다운로드 없이 config만 사용)
    # 중요: ai-model/src/model.py와 동일한 구조여야 함
    model = MultiLabelClassifier(
        model_name=hf_model_name,
        num_labels=len(LABELS),
        dropout_rate=0.3,
        config=config  # config 전달하여 from_config 사용
    )

    # 5. 저장된 가중치 로드
    # strict=True: 모델 구조가 다르면 에러 발생 (문제 조기 발견)
    try:
        model.load_state_dict(state_dict, strict=True)
        print(f"✅ {model_name} 가중치 로드 성공 (strict=True)")
    except RuntimeError as e:
        print(f"⚠️ strict=True 로드 실패, strict=False로 재시도: {e}")
        # 호환성 문제 시 partial 로딩 시도
        missing, unexpected = model.load_state_dict(state_dict, strict=False)
        if missing:
            print(f"  ⚠️ 누락된 키: {missing}")
        if unexpected:
            print(f"  ⚠️ 예상치 못한 키: {unexpected}")

    # 6. 평가 모드 설정
    model.to(device)
    model.eval()


    print(f"✅ {model_name} 모델 로드 완료 (F1: {best_f1})")

    return model, tokenizer


def load_models() -> None:
    """
    모든 앙상블 모델을 로드합니다.
    FastAPI lifespan에서 호출됩니다.
    """
    global _models, _tokenizers

    model_configs = [
        {
            'name': 'kcelectra',
            'checkpoint': os.path.join(settings.MODEL_PATH, 'kcelectra.pt'),
            'hf_model': settings.KCELECTRA_MODEL
        },
        {
            'name': 'soongsil',
            'checkpoint': os.path.join(settings.MODEL_PATH, 'soongsil.pt'),
            'hf_model': settings.SOONGSIL_MODEL
        },
        {
            'name': 'roberta',
            'checkpoint': os.path.join(settings.MODEL_PATH, 'roberta_base.pt'),
            'hf_model': settings.ROBERTA_MODEL
        }
    ]

    print(f"🔄 모델 로딩 시작 (Device: {get_device()})")

    for config in model_configs:
        if not os.path.exists(config['checkpoint']):
            print(f"⚠️ 모델 파일 없음: {config['checkpoint']}")
            continue

        model, tokenizer = load_single_model(
            model_name=config['name'],
            checkpoint_path=config['checkpoint'],
            hf_model_name=config['hf_model']
        )
        _models[config['name']] = model
        _tokenizers[config['name']] = tokenizer

    print(f"✅ 전체 모델 로드 완료 ({len(_models)}개)")


def get_models() -> Dict[str, MultiLabelClassifier]:
    """로드된 모델 딕셔너리 반환"""
    return _models


def get_tokenizers() -> Dict[str, AutoTokenizer]:
    """로드된 토크나이저 딕셔너리 반환"""
    return _tokenizers


def is_models_loaded() -> bool:
    """모델이 로드되었는지 확인 (최소 1개 이상)"""
    return len(_models) >= 1
