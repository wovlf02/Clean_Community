# 💡 요청/응답 예시

> 실제 사용 시나리오별 API 요청 및 응답 예시

---

## 1. 정상 텍스트 분석

### 요청
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "오늘 날씨가 정말 좋네요. 산책하기 딱 좋은 날입니다."}'
```

### 응답
```json
{
  "success": true,
  "data": {
    "is_toxic": false,
    "labels": [],
    "scores": {
      "여성/가족": 0.0012,
      "남성": 0.0008,
      "성소수자": 0.0003,
      "인종/국적": 0.0015,
      "연령": 0.0021,
      "지역": 0.0009,
      "종교": 0.0005,
      "기타 혐오": 0.0034,
      "악플/욕설": 0.0089
    }
  }
}
```

---

## 2. 단일 라벨 혐오 표현

### 요청
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "요즘 젊은 애들은 버릇이 없어"}'
```

### 응답
```json
{
  "success": true,
  "data": {
    "is_toxic": true,
    "labels": ["연령"],
    "scores": {
      "여성/가족": 0.0234,
      "남성": 0.0156,
      "성소수자": 0.0023,
      "인종/국적": 0.0089,
      "연령": 0.8765,
      "지역": 0.0034,
      "종교": 0.0012,
      "기타 혐오": 0.0456,
      "악플/욕설": 0.1234
    }
  }
}
```

---

## 3. 멀티 라벨 혐오 표현

### 요청
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "늙은 전라도 아줌마들은 왜 그렇게 시끄러워"}'
```

### 응답
```json
{
  "success": true,
  "data": {
    "is_toxic": true,
    "labels": ["여성/가족", "연령", "지역"],
    "scores": {
      "여성/가족": 0.8912,
      "남성": 0.0023,
      "성소수자": 0.0005,
      "인종/국적": 0.0234,
      "연령": 0.7654,
      "지역": 0.9123,
      "종교": 0.0012,
      "기타 혐오": 0.0567,
      "악플/욕설": 0.2345
    }
  }
}
```

---

## 4. 배치 분석

### 요청
```bash
curl -X POST http://localhost:8000/batch \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "오늘 점심 뭐 먹을까?",
      "이 게임 진짜 재미있다",
      "너 같은 멍청이는 처음 봐"
    ]
  }'
```

### 응답
```json
{
  "success": true,
  "data": [
    {
      "is_toxic": false,
      "labels": [],
      "scores": {
        "여성/가족": 0.0012,
        "남성": 0.0008,
        "성소수자": 0.0003,
        "인종/국적": 0.0015,
        "연령": 0.0021,
        "지역": 0.0009,
        "종교": 0.0005,
        "기타 혐오": 0.0034,
        "악플/욕설": 0.0089
      }
    },
    {
      "is_toxic": false,
      "labels": [],
      "scores": {
        "여성/가족": 0.0023,
        "남성": 0.0012,
        "성소수자": 0.0008,
        "인종/국적": 0.0034,
        "연령": 0.0045,
        "지역": 0.0012,
        "종교": 0.0009,
        "기타 혐오": 0.0056,
        "악플/욕설": 0.0123
      }
    },
    {
      "is_toxic": true,
      "labels": ["악플/욕설"],
      "scores": {
        "여성/가족": 0.0345,
        "남성": 0.0234,
        "성소수자": 0.0012,
        "인종/국적": 0.0089,
        "연령": 0.0156,
        "지역": 0.0045,
        "종교": 0.0023,
        "기타 혐오": 0.1234,
        "악플/욕설": 0.8567
      }
    }
  ]
}
```

---

## 5. 헬스 체크

### 요청
```bash
curl http://localhost:8000/health
```

### 응답 (정상)
```json
{
  "status": "healthy",
  "models_loaded": true,
  "model_count": 3,
  "models": ["kcelectra", "soongsil", "roberta_base"]
}
```

---

## 6. Python 클라이언트 예시

```python
import requests

API_URL = "http://localhost:8000"

def analyze_text(text: str) -> dict:
    """단일 텍스트 분석"""
    response = requests.post(
        f"{API_URL}/analyze",
        json={"text": text}
    )
    return response.json()

def analyze_batch(texts: list) -> dict:
    """배치 텍스트 분석"""
    response = requests.post(
        f"{API_URL}/batch",
        json={"texts": texts}
    )
    return response.json()

# 사용 예시
result = analyze_text("분석할 텍스트입니다")
print(f"혐오 여부: {result['data']['is_toxic']}")
print(f"탐지 라벨: {result['data']['labels']}")
```

---

## 7. JavaScript 클라이언트 예시

```javascript
const API_URL = "http://localhost:8000";

async function analyzeText(text) {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  return response.json();
}

// 사용 예시
const result = await analyzeText("분석할 텍스트입니다");
console.log("혐오 여부:", result.data.is_toxic);
console.log("탐지 라벨:", result.data.labels);
```

---

## 8. 에러 응답 예시

### 빈 텍스트 전송
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'
```

### 응답
```json
{
  "detail": [
    {
      "loc": ["body", "text"],
      "msg": "ensure this value has at least 1 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

### 필수 필드 누락
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 응답
```json
{
  "detail": [
    {
      "loc": ["body", "text"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
