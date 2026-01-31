#!/usr/bin/env python3
"""
FastAPI 서버 실행 스크립트
"""
import sys
import os

# 프로젝트 루트를 PYTHONPATH에 추가
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

if __name__ == "__main__":
    import uvicorn

    print("=" * 60)
    print("FastAPI 서버 시작")
    print("=" * 60)
    print(f"프로젝트 루트: {project_root}")
    print(f"Python 경로: {sys.executable}")
    print("=" * 60)

    uvicorn.run(
        "ai_server.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
