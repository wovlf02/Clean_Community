# 용어 정의 (Glossary)

**관련 문서**: [프로젝트 개요](./project-overview.md) | [기술 스택](../03_architecture/tech-stack.md)

---

## 비즈니스 용어

| 용어 | 영문 | 설명 |
|------|------|------|
| 감정분석 | Sentiment Analysis | AI를 활용하여 텍스트에서 감정이나 의도를 분석하는 기술 |
| 멀티라벨 | Multi-label | 하나의 텍스트가 여러 라벨에 동시에 해당될 수 있는 분류 방식 |
| 혐오표현 | Hate Speech | 특정 집단이나 개인을 비하하거나 혐오하는 표현 |
| 게시판 | Board | 사용자들이 게시글을 작성하고 공유하는 공간 |
| 대댓글 | Reply | 댓글에 대한 답변 댓글 |
| 그룹채팅 | Group Chat | 3명 이상의 사용자가 참여하는 채팅방 |
| 대시보드 | Dashboard | 주요 정보와 통계를 한눈에 볼 수 있는 화면 |

## 기술 용어

### Frontend

| 용어 | 설명 |
|------|------|
| Next.js | React 기반 풀스택 웹 프레임워크 |
| TypeScript | JavaScript에 정적 타입을 추가한 프로그래밍 언어 |
| App Router | Next.js 13+의 새로운 라우팅 시스템 |
| SSR | Server Side Rendering, 서버에서 페이지를 렌더링하는 방식 |
| SSG | Static Site Generation, 빌드 시 정적 페이지를 생성하는 방식 |
| Tailwind CSS | 유틸리티 우선 CSS 프레임워크 |
| Zustand | 경량 상태 관리 라이브러리 |
| React Query | 서버 상태 관리 및 데이터 페칭 라이브러리 |

### Backend

| 용어 | 설명 |
|------|------|
| FastAPI | Python 기반 고성능 웹 프레임워크 |
| Express.js | Node.js 기반 웹 프레임워크 |
| Socket.IO | 실시간 양방향 통신을 위한 라이브러리 |
| WebSocket | 실시간 양방향 통신 프로토콜 |
| Prisma | TypeScript/JavaScript용 차세대 ORM |
| ORM | Object-Relational Mapping, 객체와 관계형 DB를 매핑하는 기술 |
| NextAuth.js | Next.js용 인증 라이브러리 |
| JWT | JSON Web Token, 토큰 기반 인증 방식 |

### Database

| 용어 | 설명 |
|------|------|
| PostgreSQL | 오픈소스 관계형 데이터베이스 |
| RDS | Amazon Relational Database Service |
| Migration | 데이터베이스 스키마 변경을 관리하는 방법 |
| Index | 데이터베이스 조회 성능을 높이기 위한 구조 |

### AI/ML

| 용어 | 설명 |
|------|------|
| PyTorch | 딥러닝 프레임워크 |
| .pt 파일 | PyTorch 모델 저장 형식 |
| 추론 (Inference) | 학습된 모델로 예측을 수행하는 과정 |
| 토큰화 (Tokenization) | 텍스트를 모델이 처리할 수 있는 단위로 분할 |
| 다중 라벨 분류 (Multi-label Classification) | 하나의 입력이 여러 클래스에 동시에 속할 수 있는 분류 방식 |
| 앙상블 (Ensemble) | 여러 모델의 예측을 결합하여 성능을 향상시키는 기법 |
| 가중 소프트 보팅 (Weighted Soft Voting) | 각 모델의 확률 예측에 가중치를 부여하여 평균하는 방식 |
| 임계값 (Threshold) | 확률을 이진 분류로 변환하는 기준값 |
| Hamming Accuracy | 다중 라벨에서 개별 라벨 정확도의 평균 |
| F1-Score | 정밀도와 재현율의 조화 평균 |
| F1-Macro | 클래스별 F1-Score의 단순 평균 |
| ELECTRA | 효율적인 텍스트 인코더 사전학습 모델 아키텍처 |
| BERT | Bidirectional Encoder Representations from Transformers |
| RoBERTa | Robustly Optimized BERT Approach |
| Transformers | Hugging Face의 사전학습 모델 라이브러리 |
| Fine-tuning | 사전학습 모델을 특정 태스크에 맞게 추가 학습하는 과정 |
| AEDA | An Easier Data Augmentation, 구두점 삽입 기반 데이터 증강 기법 |
| BCEWithLogitsLoss | 다중 라벨 분류를 위한 Binary Cross-Entropy 손실 함수 |
| pos_weight | 클래스 불균형 해결을 위한 양성 샘플 가중치 |

### 사전학습 모델

| 모델 | 설명 |
|------|------|
| KcELECTRA | 한국어 인터넷 언어에 특화된 ELECTRA 모델 (beomi) |
| SoongsilBERT | 숭실대학교에서 개발한 한국어 BERT 모델 |
| KLUE-RoBERTa | 한국어 언어 이해 벤치마크(KLUE) 기반 RoBERTa 모델 |

### 데이터셋

| 용어 | 설명 |
|------|------|
| UnSmile | Smilegate AI에서 제공하는 한국어 혐오 표현 탐지 데이터셋 |
| 클래스 불균형 | 특정 클래스의 샘플이 다른 클래스보다 현저히 적거나 많은 현상 |
| 오버샘플링 | 소수 클래스 데이터를 증가시키는 기법 |

### Cloud/DevOps

| 용어 | 설명 |
|------|------|
| AWS | Amazon Web Services, 클라우드 컴퓨팅 플랫폼 |
| EC2 | Elastic Compute Cloud, AWS 가상 서버 |
| ECS | Elastic Container Service, 컨테이너 오케스트레이션 서비스 |
| S3 | Simple Storage Service, 객체 스토리지 |
| CloudFront | AWS CDN 서비스 |
| Vercel | Next.js 전용 배포 플랫폼 |
| CI/CD | 지속적 통합/지속적 배포 |

## 약어

| 약어 | 전체 | 설명 |
|------|------|------|
| API | Application Programming Interface | 애플리케이션 간 통신 인터페이스 |
| REST | Representational State Transfer | API 설계 아키텍처 스타일 |
| CRUD | Create, Read, Update, Delete | 기본적인 데이터 처리 작업 |
| CDN | Content Delivery Network | 콘텐츠 전송 네트워크 |
| HTTPS | HyperText Transfer Protocol Secure | 보안 HTTP 프로토콜 |
| WSS | WebSocket Secure | 보안 WebSocket 프로토콜 |

---

**최종 업데이트**: 2026년 1월 30일
