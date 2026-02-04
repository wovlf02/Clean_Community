docs(ai_server): requirements.txt 업데이트 및 실행 가이드 추가

- requirements.txt에 sentencepiece, tokenizers 패키지 추가
  - 모든 파이썬 파일 실행에 필요한 의존성 완성
  - HuggingFace 토크나이저 지원 강화

- README.md에 상세한 실행 가이드 추가
  - 모델 학습 가이드 섹션 추가
    * 학습 환경 준비 방법
    * 단일 모델 학습 명령어 (KcELECTRA, SoongsilBERT, RoBERTa)
    * 학습된 모델 파일 배치 가이드
    * 모델 평가 방법
  
  - FastAPI 서버 실행 가이드 섹션 추가
    * 4가지 실행 방법 제시 (스크립트/uvicorn/프로덕션/Docker)
    * 서버 동작 확인 URL 안내
    * API 테스트 예시 (curl, Python)
  
  - 추가 섹션
    * 환경 변수 설정 가이드
    * 트러블슈팅 (모델 로드 실패, CUDA 메모리, 포트 충돌)

- Windows 환경 명령어 지원 강화
  * cmd.exe 기반 명령어 예시 추가
  * 가상환경 활성화 경로 수정

