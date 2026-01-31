docs: Add FastAPI AI model server TODO documentation

- AI 모델 서버 구축을 위한 상세 TODO 문서 7개 작성
  - README.md: 프로젝트 개요 및 참고 문서 구조화
  - 01_프로젝트_구조.md: FastAPI 디렉토리 구조 및 파일 설계
  - 02_환경_설정.md: Python 환경, 의존성, 환경 변수 설정
  - 03_모델_로딩.md: PT 모델 로드, 앙상블 구성, 추론 로직
  - 04_API_엔드포인트.md: REST API 설계 (/analyze, /analyze/batch, /health)
  - 05_NextJS_연동.md: Next.js 클라이언트 연동, 경고 모달 컴포넌트
  - 06_테스트_및_검증.md: pytest 테스트, 정확도 검증, 성능 테스트
  - 07_배포.md: Docker 컨테이너화, AWS ECS Fargate 배포

- 프로젝트 전체 버전 정보 업데이트
  - Next.js: 14+ → 16
  - React: 18+ → 19+
  - Python: 3.10+ → 3.11.9
  - Node.js: 20+ LTS → 24.11.0 LTS
  
- 각 TODO 문서에 ai-model 폴더의 기존 문서 참조 연결
  - 모델 아키텍처, 학습 전략, 실험 결과 문서 참조
  - 3개 PT 모델 파일 (kcelectra.pt, soongsil.pt, roberta_base.pt) 정보 포함
  - 9개 혐오 카테고리 탐지 및 앙상블 전략 상세 설명

Refs: #AI-Model-Server, #Documentation
