# 🔀 앙상블 구조

> 3-모델 가중 평균 앙상블의 상세 동작 원리

---

## 📋 개요

본 시스템은 **3개의 BERT 기반 모델**을 가중 평균 방식으로 앙상블하여 예측합니다.

### 앙상블 방식
- **유형**: 가중 평균 (Weighted Average)
- **결합 레벨**: 확률 점수 레벨
- **최종 결정**: 클래스별 임계값 기반

---

## 🏗️ 모델 구성

### 1. KcELECTRA

| 항목 | 내용 |
|------|------|
| **HuggingFace ID** | `beomi/KcELECTRA-base` |
| **가중치** | 0.35 (35%) |
| **역할** | 슬랭/욕설 전문가 |
| **특징** | 한국어 인터넷 커뮤니티 데이터로 학습 |

**강점**:
- 신조어, 인터넷 슬랭 이해
- 변형된 욕설 탐지
- 줄임말, 은어 처리

### 2. SoongsilBERT

| 항목 | 내용 |
|------|------|
| **HuggingFace ID** | `soongsil-ai/soongsil-bert-base` |
| **가중치** | 0.33 (33%) |
| **역할** | 안정적 베이스라인 |
| **특징** | 균형 잡힌 한국어 이해 |

**강점**:
- 일반적인 문장 구조 이해
- 안정적인 성능
- 다양한 도메인 대응

### 3. KLUE-RoBERTa

| 항목 | 내용 |
|------|------|
| **HuggingFace ID** | `klue/roberta-base` |
| **가중치** | 0.32 (32%) |
| **역할** | 고맥락 의미론 전문가 |
| **특징** | 문맥 기반 의미 이해 |

**강점**:
- 긴 문장에서의 문맥 파악
- 암시적 표현 탐지
- 미묘한 뉘앙스 이해

---

## 🔄 앙상블 프로세스

### Step 1: 개별 모델 예측

각 모델이 입력 텍스트에 대해 9개 라벨의 확률을 독립적으로 예측합니다.

```python
# 각 모델의 출력
kcelectra_probs = [0.85, 0.02, 0.01, 0.03, 0.02, 0.01, 0.01, 0.05, 0.78]
soongsil_probs = [0.82, 0.03, 0.02, 0.02, 0.01, 0.02, 0.01, 0.04, 0.75]
roberta_probs = [0.88, 0.01, 0.01, 0.04, 0.03, 0.01, 0.02, 0.06, 0.80]
```

### Step 2: 가중 평균 계산

각 모델의 예측에 가중치를 곱하여 합산합니다.

```python
weights = {
    "kcelectra": 0.35,
    "soongsil": 0.33,
    "roberta": 0.32
}

ensemble_probs = (
    kcelectra_probs * 0.35 +
    soongsil_probs * 0.33 +
    roberta_probs * 0.32
)
# 결과: [0.8489, 0.0201, 0.0134, 0.0299, 0.0199, 0.0134, 0.0134, 0.0499, 0.7766]
```

### Step 3: 임계값 적용

각 라벨별 최적화된 임계값을 적용하여 최종 라벨을 결정합니다.

```python
thresholds = {
    "여성/가족": 0.35,
    "남성": 0.22,
    "성소수자": 0.45,
    "인종/국적": 0.30,
    "연령": 0.30,
    "지역": 0.27,
    "종교": 0.30,
    "기타 혐오": 0.45,
    "악플/욕설": 0.40
}

# 예시 결과
# 여성/가족: 0.8489 >= 0.35 → ✅ 탐지
# 악플/욕설: 0.7766 >= 0.40 → ✅ 탐지
# 나머지: 임계값 미만 → ❌ 미탐지

final_labels = ["여성/가족", "악플/욕설"]
```

---

## 📊 앙상블 효과

### 단일 모델 vs 앙상블 성능

| 모델 | Hamming Accuracy |
|------|------------------|
| KcELECTRA 단독 | ~94.5% |
| SoongsilBERT 단독 | ~94.0% |
| RoBERTa 단독 | ~94.2% |
| **3-모델 앙상블** | **96.22%** |

> 앙상블로 약 **2%p 성능 향상** 달성

### 앙상블 장점

1. **오류 보완**: 한 모델의 오류를 다른 모델이 보완
2. **안정성 향상**: 예측 분산 감소
3. **강점 결합**: 각 모델의 전문 영역 활용

---

## 🔧 가중치 결정 근거

| 모델 | 가중치 | 결정 근거 |
|------|--------|-----------|
| KcELECTRA | 0.35 | 인터넷 언어 특화, 가장 높은 단독 성능 |
| SoongsilBERT | 0.33 | 안정적 베이스라인, 균형 잡힌 성능 |
| RoBERTa | 0.32 | 문맥 이해 우수, 복잡한 문장 처리 |

> 가중치 합계: 0.35 + 0.33 + 0.32 = **1.0**

---

## 💻 구현 코드

```python
class EnsembleClassifier:
    def __init__(self):
        self.models = {
            "kcelectra": HateSpeechClassifier("beomi/KcELECTRA-base", "models/kcelectra.pt"),
            "soongsil": HateSpeechClassifier("soongsil-ai/soongsil-bert-base", "models/soongsil.pt"),
            "roberta": HateSpeechClassifier("klue/roberta-base", "models/roberta_base.pt"),
        }
        self.weights = MODEL_WEIGHTS
        self.thresholds = THRESHOLDS
    
    def predict(self, text: str) -> Dict:
        # 각 모델 예측
        predictions = {}
        for name, model in self.models.items():
            predictions[name] = model.predict(text)
        
        # 가중 평균
        ensemble_scores = np.zeros(9)
        for name, probs in predictions.items():
            ensemble_scores += probs * self.weights[name]
        
        # 임계값 적용
        labels = []
        for i, label in enumerate(LABELS):
            if ensemble_scores[i] >= self.thresholds[label]:
                labels.append(label)
        
        return {
            "is_toxic": len(labels) > 0,
            "labels": labels,
            "scores": {LABELS[i]: float(ensemble_scores[i]) for i in range(9)}
        }
```

---

## 🎯 최적화 포인트

1. **가중치 튜닝**: 검증 데이터로 최적 가중치 탐색
2. **임계값 최적화**: 클래스별 F1-Score 최대화
3. **모델 선택**: 성능과 추론 속도 균형
