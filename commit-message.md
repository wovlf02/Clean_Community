docs: clean_community.md 프로젝트 소개 문서 작성

Clean Community 프로젝트에 맞게 프로젝트 소개 문서 작성

## 변경 사항
- clean_community.md 파일을 Clean Community 프로젝트 내용으로 전면 재작성
- 기존 CoUp 프로젝트 내용 → Clean Community 내용으로 변경

## 추가된 내용
- 프로젝트 개요: AI 기반 감정분석 커뮤니티 플랫폼 소개
- 기술 스택: Next.js 16, React 19, TypeScript, FastAPI, PyTorch, Socket.IO 등
- 개발 기간: 2026/01/15 ~ 2026/02/02
- 프로젝트 진행률: 85% (Phase 1-3 완료)
- GitHub 링크: https://github.com/wovlf02/Clean_Community
- 문서 링크: docs 폴더 주요 문서 링크 추가

## 개발 이슈 및 해결 방법 (6가지)
1. 효율성 개선: 마이크로서비스 아키텍처, API Routes 도메인별 분리, 컴포넌트 모듈화
2. AI 모델 개발: 3-모델 하이브리드 앙상블, 멀티라벨 분류 (9개 카테고리), Hamming Accuracy 96.22%
3. 실시간 통신 구현: Socket.IO 독립 서버, 실시간 채팅/알림, 온라인 상태 관리
4. 대시보드 및 관리자 기능: Recharts 활용 통계 시각화, 악성 콘텐츠 모니터링
5. UI/UX 최적화: Tailwind CSS v4 + shadcn/ui, 다크 모드, 반응형 디자인
6. 성능 최적화: Next.js 16 활용, React Query 캐싱, 코드 스플리팅
