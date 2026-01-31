feat(ai_server): 혐오 표현 탐지 API 서버 구축 및 최적화

3-모델 앙상블 기반 혐오 표현 탐지 FastAPI 서버 구축

주요 변경사항:
- KcELECTRA, Soongsil-BERT, RoBERTa 3-모델 앙상블 구현
- UnSmile 데이터셋 기반 9개 카테고리 멀티라벨 분류
- 클래스별 최적화된 임계값 적용
- FastAPI 기반 RESTful API 서버 구현

성능:
- Hamming Accuracy: 96.22% (3,737개 테스트 샘플)
- Exact Match: 73.37%
- 주요 라벨 F1-Score: 0.81~0.89

API 엔드포인트:
- POST /analyze: 단일 텍스트 분석
- POST /batch: 배치 텍스트 분석
- GET /health: 서버 상태 확인

기술 스택:
- FastAPI, PyTorch, Transformers
- Docker 지원
- 비동기 처리

정리 작업:
- 불필요한 테스트 파일 및 로그 삭제
- 배포용 디렉토리 구조 정리
- API 문서화 완료
