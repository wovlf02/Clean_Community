# Clean_Community

> 🧠 AI 기반 한국어 혐오 표현 탐지 기술을 활용한 건전한 온라인 커뮤니티 플랫폼

[![Hamming Accuracy](https://img.shields.io/badge/Hamming%20Accuracy-96.72%25-brightgreen)](./ai-model/docs/05_실험_결과.md)
[![F1-Macro](https://img.shields.io/badge/F1--Macro-82.91%25-blue)](./ai-model/docs/05_실험_결과.md)
[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## ⚠️ LEGAL NOTICE

**© 2026 Clean Community Project**

This is a **source-available** project, NOT open source.

| Action | Permission |
|--------|------------|
| 👀 View code | ✅ Allowed (portfolio review) |
| 🏃 Run/Use | ❌ **Prohibited** |
| 📋 Copy | ❌ **Prohibited** |
| 🔧 Modify | ❌ **Prohibited** |
| 💼 Commercial use | ❌ **Prohibited** |

**Unauthorized use is copyright infringement.**

See [LICENSE](./LICENSE) for full legal terms.

---

## 📋 프로젝트 소개

**Clean Community**는 AI 기반 감정분석 기술을 활용한 건강한 온라인 커뮤니티 플랫폼입니다. 
3-모델 하이브리드 앙상블 기술을 통해 **9개 혐오 카테고리**를 동시에 탐지하여 건전한 커뮤니티 문화를 조성합니다.

**🎯 This is a portfolio project to demonstrate:**
- AI/ML model development and deployment skills
- Full-stack development capabilities
- System architecture and design expertise

### 🎯 핵심 기능

| 기능 | 설명 |
|------|------|
| **🛡️ AI 혐오 탐지** | 9개 카테고리 다중 라벨 분류 (Hamming Accuracy 96.72%) |
| **📝 게시판** | 게시글 CRUD, 댓글/대댓글, 좋아요, 실시간 감정분석 |
| **💬 채팅** | 1:1/그룹 채팅, WebSocket 기반 실시간 메시지 분석 |
| **👥 친구 관리** | 친구 추가/삭제, 1:1 채팅 바로가기 |
| **📊 대시보드** | 사용자 활동 통계, 인기 게시글, 시각화 |

---

## 🧠 AI 모델

### 3-모델 하이브리드 앙상블 아키텍처

| 모델 | 역할 | 특징 |
|------|------|------|
| **KcELECTRA** | 슬랭/욕설 전문가 | 한국어 인터넷 언어에 특화 |
| **SoongsilBERT** | 안정적 베이스라인 | 균형 잡힌 범용 성능 |
| **KLUE-RoBERTa** | 고맥락 의미론 전문가 | 문맥 이해력 우수 |

### 혐오 카테고리 (9개)

```
여성/가족 | 남성 | 성소수자 | 인종/국적 | 연령 | 지역 | 종교 | 기타 혐오 | 악플/욕설
```

### 성능 지표

| 지표 | 성능 |
|------|------|
| **Hamming Accuracy** | **96.72%** ✅ |
| **F1-Macro** | **82.91%** ✅ |
| **F1-Micro** | 81.08% |
| **Exact Match** | 74.63% |

---

## 🛠️ 기술 스택

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **React Query** + Zustand

### Backend
- **Next.js API Routes** + Prisma ORM
- **Express.js** + Socket.IO (실시간 서버)
- **FastAPI** (AI 모델 서빙)
- **PostgreSQL** + Redis

### AI/ML
- **Python 3.10+**
- **PyTorch 2.0+**
- **Transformers 4.30+**
- **UnSmile 데이터셋** (Smilegate AI)

### 클라우드 (AWS)
- EC2 / ECS (컴퓨팅)
- RDS PostgreSQL (데이터베이스)
- S3 + CloudFront (스토리지/CDN)
- ElastiCache Redis (캐시)

---

## 📁 프로젝트 구조

```
Clean_Community/
├── ai-model/                # AI 모델 관련
│   ├── data/                # 데이터셋
│   │   ├── raw/             # 원본 데이터
│   │   └── processed/       # 전처리된 데이터
│   ├── models/              # 학습된 모델 (.pt 파일)
│   │   ├── kcelectra.pt
│   │   ├── soongsil.pt
│   │   └── roberta_base.pt
│   └── docs/                # AI 모델 문서
│       ├── 01_프로젝트_개요.md
│       ├── 02_데이터_분석.md
│       ├── 03_모델_아키텍처.md
│       ├── 04_학습_전략.md
│       └── 05_실험_결과.md
├── docs/                    # 플랫폼 설계 문서
│   ├── 01_overview/         # 프로젝트 개요
│   ├── 02_requirements/     # 요구사항
│   ├── 03_architecture/     # 아키텍처
│   ├── 04_database/         # 데이터베이스 설계
│   ├── 05_screens/          # 화면 설계
│   └── ...
└── README.md
```

---

## 📚 문서

### 플랫폼 설계 문서
- [프로젝트 개요](./docs/01_overview/project-overview.md)
- [기술 스택](./docs/03_architecture/tech-stack.md)
- [시스템 설계](./docs/03_architecture/system-design.md)
- [데이터베이스 스키마](./docs/04_database/database-schema.md)

### AI 모델 문서
- [AI 프로젝트 개요](./ai-model/docs/01_프로젝트_개요.md)
- [데이터 분석 (UnSmile EDA)](./ai-model/docs/02_데이터_분석.md)
- [모델 아키텍처](./ai-model/docs/03_모델_아키텍처.md)
- [학습 전략](./ai-model/docs/04_학습_전략.md)
- [실험 결과](./ai-model/docs/05_실험_결과.md)

---

## 📥 학습된 모델 다운로드

학습된 모델 파일(.pt)은 용량이 커서 별도로 다운로드해야 합니다.

- **다운로드**: [Google Drive](https://drive.google.com/drive/folders/1Noow6HkhI6hkAuggptroiNmbUVGDbu1u?usp=sharing)
  - `kcelectra.pt` (약 400MB)
  - `soongsil.pt` (약 400MB)
  - `roberta_base.pt` (약 400MB)

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 20+ LTS
- Python 3.10+
- PostgreSQL 15+
- Redis

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/Clean_Community.git
cd Clean_Community

# 프론트엔드 의존성 설치
npm install

# AI 모델 서버 의존성 설치
cd ai-model
pip install -r requirements.txt

# 학습된 모델 다운로드 후 ai-model/models/ 폴더에 배치
```

자세한 설정 방법은 [개발 환경 설정](./docs/06_development/setup.md)을 참고하세요.

---

## 📊 참고 자료

### 데이터셋 및 사전학습 모델

**이 프로젝트는 다음의 오픈소스 데이터셋과 모델을 사용합니다:**

#### UnSmile 데이터셋
- **제공:** Smilegate AI
- **라이선스:** CC BY-SA 4.0
- **출처:** [Smilegate AI GitHub](https://github.com/smilegate-ai/korean_unsmile_dataset)
- **논문:** EMNLP 2022 - UnSmile: Detecting Toxicity and Biases in Korean Comments
- **인용:**
  ```
  Kim, K., Park, J., Jang, J., & Park, J. (2022). UnSmile: Korean Toxic Comment Detection Dataset. 
  In Proceedings of EMNLP 2022. Smilegate AI.
  ```

#### 사전학습 언어 모델

| 모델 | 개발자/기관 | 라이선스 | 출처 |
|------|------------|---------|------|
| **KcELECTRA** | Junbum Lee (beomi) | Apache 2.0 | [Hugging Face](https://huggingface.co/beomi/KcELECTRA-base) |
| **SoongsilBERT** | 숭실대학교 AI Lab | Apache 2.0 | [Hugging Face](https://huggingface.co/soongsil-ai/soongsil-bert-base) |
| **KLUE-RoBERTa** | KLUE Team | CC BY-SA 4.0 | [Hugging Face](https://huggingface.co/klue/roberta-base) |

### 오픈소스 라이브러리

주요 오픈소스 라이브러리:
- **Frontend:** Next.js (Vercel), React (Meta), Tailwind CSS (Tailwind Labs)
- **Backend:** Express.js, Socket.IO, Prisma
- **AI/ML:** PyTorch (Meta), Transformers (Hugging Face), FastAPI

전체 오픈소스 라이선스 정보는 [NOTICE.md](./NOTICE.md)를 참조하세요.

---

## 🙏 감사의 말

이 프로젝트는 다음 기관 및 개발자들의 오픈소스 기여 덕분에 가능했습니다:

- **Smilegate AI** - UnSmile 데이터셋 제공
- **Junbum Lee (beomi)** - KcELECTRA 모델 개발
- **숭실대학교 AI Lab** - SoongsilBERT 모델 개발
- **KLUE Team** - KLUE-RoBERTa 모델 개발
- **Hugging Face** - Transformers 라이브러리 개발
- **Meta Platforms** - PyTorch 및 React 개발
- 그 외 모든 오픈소스 기여자분들께 감사드립니다.

---

## 📄 License

This project uses a **dual licensing model**.

| Component | License | Commercial Use |
|-----------|---------|----------------|
| **Platform Code** | MIT | ✅ Allowed |
| **AI Model** | Proprietary | ❌ License Required |

### Non-Commercial Use
Academic research, personal learning, and portfolio projects are permitted.

### Commercial Licensing
For commercial use of the AI model, contact: [your-email@example.com]

See [LICENSE](./LICENSE) for full terms.

---

## Acknowledgments

- **Smilegate AI** - UnSmile Dataset
- **Junbum Lee** - KcELECTRA
- **Soongsil University** - SoongsilBERT
- **KLUE Team** - KLUE-RoBERTa

See [NOTICE.md](./NOTICE.md) for third-party licenses.

---

**Last Updated:** January 30, 2026
