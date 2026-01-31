# 🚀 AI 혐오 표현 탐지 API 서버

> FastAPI 기반 3-모델 앙상블 혐오 표현 탐지 API 서버

## 📋 개요

이 서버는 한국어 텍스트에서 **9개 카테고리의 혐오 표현**을 실시간으로 탐지하는 API를 제공합니다.

| 항목 | 내용 |
|------|------|
| **서버 유형** | FastAPI REST API |
| **주요 기능** | 혐오 표현 멀티라벨 분류 |
| **모델 구조** | 3-모델 앙상블 |
| **성능** | Hamming Accuracy 96.22% |

---

## 📂 문서 구조

```
docs/
├── README.md                    # 현재 문서 (전체 개요)
├── 01_architecture/             # 아키텍처 문서
│   ├── README.md               # 시스템 아키텍처 개요
│   ├── directory-structure.md  # 디렉토리 구조
│   └── modules.md              # 모듈별 상세 설명
├── 02_api/                      # API 명세
│   ├── README.md               # API 개요
│   ├── endpoints.md            # 엔드포인트 상세
│   └── examples.md             # 요청/응답 예시
├── 03_deployment/               # 배포 가이드
│   ├── README.md               # 배포 개요
│   ├── docker.md               # Docker 설정
│   └── production.md           # 프로덕션 배포
└── 04_models/                   # 모델 문서
    ├── README.md               # 모델 개요
    ├── ensemble.md             # 앙상블 구조
    └── thresholds.md           # 임계값 설정
```

---

## 🎯 주요 기능

### 1. 단일 텍스트 분석
- 입력 텍스트의 혐오 여부 판정
- 9개 카테고리별 확률 점수 제공
- 탐지된 혐오 라벨 목록 반환

### 2. 배치 텍스트 분석
- 여러 텍스트 동시 분석
- 대량 데이터 처리 최적화

### 3. 상태 모니터링
- 서버 상태 확인
- 모델 로드 상태 확인

---

## 📊 성능 지표

### 테스트 환경
- **데이터셋**: UnSmile 테스트 데이터 (3,737개)
- **테스트 일시**: 2026년 1월 31일

### 전체 성능

| 지표 | 값 |
|------|------|
| **Hamming Accuracy** | 96.22% |
| **Exact Match** | 73.37% |

### 라벨별 F1-Score

| 라벨 | F1-Score | 평가 |
|------|----------|------|
| 지역 | 0.891 | ✅ 우수 |
| 성소수자 | 0.891 | ✅ 우수 |
| 종교 | 0.878 | ✅ 우수 |
| 연령 | 0.856 | ✅ 양호 |
| 인종/국적 | 0.839 | ✅ 양호 |
| 남성 | 0.816 | ✅ 양호 |
| 여성/가족 | 0.814 | ✅ 양호 |
| 악플/욕설 | 0.695 | ⚠️ 보통 |
| 기타 혐오 | 0.569 | ⚠️ 개선 필요 |

---

## 🛠️ 기술 스택

### 프레임워크 & 런타임

| 기술 | 버전 | 용도 |
|------|------|------|
| Python | 3.11 | 프로그래밍 언어 |
| FastAPI | 0.100+ | REST API 프레임워크 |
| Uvicorn | - | ASGI 서버 |
| Pydantic | 2.x | 데이터 검증 |

### AI/ML

| 기술 | 버전 | 용도 |
|------|------|------|
| PyTorch | 2.0+ | 딥러닝 프레임워크 |
| Transformers | 4.30+ | 사전학습 모델 |
| NumPy | - | 수치 연산 |

### 인프라

| 기술 | 용도 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 멀티 컨테이너 관리 |

---

## 🚀 빠른 시작

### 1. 환경 설정

```bash
cd ai_server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 서버 실행

```bash
python run_server.py
```

### 3. API 테스트

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "테스트 문장입니다"}'
```

---

## 📖 문서 바로가기

| 문서 | 설명 |
|------|------|
| [아키텍처](./01_architecture/README.md) | 시스템 구조 및 모듈 설명 |
| [API 명세](./02_api/README.md) | 엔드포인트 상세 문서 |
| [배포 가이드](./03_deployment/README.md) | Docker 및 서버 배포 방법 |
| [모델 문서](./04_models/README.md) | 앙상블 모델 상세 |

---

## 📞 API 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| `GET` | `/` | 서버 정보 |
| `GET` | `/health` | 상태 확인 |
| `POST` | `/analyze` | 단일 텍스트 분석 |
| `POST` | `/batch` | 배치 텍스트 분석 |

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**최종 업데이트**: 2026년 1월 31일
