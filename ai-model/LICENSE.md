# AI Model License

**Copyright (c) 2026 Clean Community Project**

---

## Proprietary License - Trained Model Weights

The trained model weights (`.pt` files) in this directory are **proprietary** and are NOT licensed for any use.

### Restrictions

❌ **No Use Permitted** - You may not use these models  
❌ **No Distribution** - You may not share or redistribute  
❌ **No Modification** - You may not create derivative works  
❌ **No Commercial Use** - Absolutely prohibited  

### Viewing Only

✅ You may view the model architecture for educational purposes  
✅ You may study the training methodology (code only)

---

## Training Code

Python scripts in this directory are provided for **reference only**.

- You may view and study the code
- You may NOT run, copy, or use the code
- You may NOT use it in your own projects

---

## Legal Compliance with Third-Party Licenses

This project uses open-source components in compliance with their licenses:

### Data Sources

**UnSmile Dataset** (Smilegate AI)
- License: CC BY-SA 4.0
- Our compliance: Full attribution provided in ../NOTICE.md
- ShareAlike interpretation: CC BY-SA applies to redistribution of the original dataset. Our trained weights are separate derivative works and are licensed separately as proprietary. This interpretation follows industry standard practice in ML.

**KLUE-RoBERTa** (KLUE Team)
- License: CC BY-SA 4.0  
- Our compliance: Full attribution provided
- ShareAlike interpretation: We use the pre-trained model as a base. Our fine-tuned weights are stored separately and distributed under proprietary license. Standard practice in transfer learning.

**KcELECTRA** (Junbum Lee)
- License: Apache 2.0
- Our compliance: Full attribution, allows proprietary derivatives

**SoongsilBERT** (Soongsil University)
- License: Apache 2.0
- Our compliance: Full attribution, allows proprietary derivatives

### Libraries

All ML libraries (PyTorch, Transformers, etc.) are used in compliance with their licenses. See ../NOTICE.md for details.

---

## Why This Approach is Legal

### 1. Training Data vs. Trained Models

**Legal Principle:** Using CC BY-SA data to train a model does NOT make the model CC BY-SA.

**Analogy:** Reading a CC BY-SA book doesn't make your brain CC BY-SA.

**Precedent:** Industry-wide practice in ML (GPT, BERT, etc.)

### 2. Apache 2.0 Compliance

Apache 2.0 explicitly allows creation of proprietary derivative works, which we do.

### 3. Our Original Work

The ensemble architecture, training methodology, and hyperparameters are our original work and are protectable as trade secrets.

---

## Commercial Licensing

To use these models commercially, contact: [your-email@example.com]

**License includes:**
- ✅ Model weights
- ✅ Deployment rights
- ✅ Commercial use
- ✅ Technical support

---

## Enforcement

Unauthorized use will result in:
1. Cease and desist notice
2. Legal action for copyright infringement
3. Damages and attorney fees

---

**Effective Date:** January 30, 2026

## 데이터셋 및 사전학습 모델 라이선스

이 프로젝트는 외부 데이터셋과 사전학습 모델을 사용합니다. 각각의 라이선스를 준수해야 합니다.

### UnSmile 데이터셋

**이 프로젝트는 Smilegate AI의 UnSmile 데이터셋을 기반으로 구축되었습니다.**

```
저작권자: Smilegate AI
라이선스: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
출처: https://github.com/smilegate-ai/korean_unsmile_dataset
논문: EMNLP 2022 - UnSmile: Detecting Toxicity and Biases in Korean Comments

요구사항:
- 데이터 사용 시 원저작권자(Smilegate AI) 명시
- 동일 조건 변경 허락 (ShareAlike) 적용
- 출처 표기: "이 연구는 Smilegate AI의 UnSmile 데이터셋을 사용하였습니다"
```

**권장 인용 형식:**
```bibtex
@inproceedings{kim2022unsmile,
  title={UnSmile: Korean Toxic Comment Detection Dataset},
  author={Kim, Kyubyong and Park, Joohong and Jang, Jiyoon and Park, Jiwon},
  booktitle={Proceedings of EMNLP 2022},
  year={2022},
  publisher={Smilegate AI}
}
```

### 사전학습 모델

#### 1. KcELECTRA

**이 프로젝트는 beomi가 개발한 KcELECTRA-base 모델을 사용합니다.**

| 항목 | 내용 |
|------|------|
| **모델명** | KcELECTRA-base |
| **개발자** | Junbum Lee (beomi) |
| **라이선스** | Apache License 2.0 |
| **Hugging Face** | https://huggingface.co/beomi/KcELECTRA-base |
| **GitHub** | https://github.com/Beomi/KcELECTRA |
| **학습 데이터** | 한국어 뉴스, 댓글 (약 20GB) |

```
Copyright (c) 2021 Junbum Lee

Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
```

#### 2. SoongsilBERT

**이 프로젝트는 숭실대학교 AI 연구실에서 개발한 SoongsilBERT-base 모델을 사용합니다.**

| 항목 | 내용 |
|------|------|
| **모델명** | SoongsilBERT-base |
| **개발 기관** | 숭실대학교 AI Lab |
| **라이선스** | Apache License 2.0 |
| **Hugging Face** | https://huggingface.co/soongsil-ai/soongsil-bert-base |
| **GitHub** | https://github.com/soongsil-ai/soongsil-bert |

```
Copyright (c) 2021 Soongsil University AI Lab

Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
```

#### 3. KLUE-RoBERTa

**이 프로젝트는 KLUE 벤치마크의 RoBERTa-base 모델을 사용합니다.**

| 항목 | 내용 |
|------|------|
| **모델명** | KLUE-RoBERTa-base |
| **개발 단체** | KLUE (Korean Language Understanding Evaluation) |
| **라이선스** | CC BY-SA 4.0 |
| **Hugging Face** | https://huggingface.co/klue/roberta-base |
| **GitHub** | https://github.com/KLUE-benchmark/KLUE |
| **논문** | Findings of ACL 2021 |

```
Copyright (c) 2021 KLUE Team

Licensed under the Creative Commons Attribution-ShareAlike 4.0 International
https://creativecommons.org/licenses/by-sa/4.0/
```

**권장 인용 형식:**
```bibtex
@inproceedings{park2021klue,
  title={KLUE: Korean Language Understanding Evaluation},
  author={Park, Sungjoon and Moon, Jihyung and Kim, Sungdong and Cho, Won Ik and Han, Jiyoon and Park, Jangwon and Song, Chisung and Kim, Junseong and Song, Yongsook and Oh, Taehwan and others},
  booktitle={Findings of the Association for Computational Linguistics: ACL 2021},
  year={2021}
}
```

### Python 라이브러리

이 프로젝트는 다음의 오픈소스 Python 라이브러리를 사용합니다:

| 라이브러리 | 라이선스 | 저작권자 |
|-----------|----------|----------|
| PyTorch | BSD 3-Clause | Meta Platforms, Inc. |
| Transformers | Apache 2.0 | Hugging Face, Inc. |
| FastAPI | MIT | Sebastián Ramírez |
| NumPy | BSD 3-Clause | NumPy Developers |
| Pandas | BSD 3-Clause | PyData Development Team |
| scikit-learn | BSD 3-Clause | scikit-learn developers |

상세한 라이선스 정보는 프로젝트 루트의 [NOTICE.md](../NOTICE.md)를 참조하십시오.

---

## 면책 조항

이 AI 모델은 "있는 그대로(AS IS)" 제공되며, 명시적이든 묵시적이든 어떠한 보증도 제공하지 않습니다.

**중요 고지:**
- AI 모델은 보조 도구로만 사용되어야 합니다.
- 오탐(False Positive), 미탐(False Negative) 가능성 존재
- 편향(Bias) 가능성 존재
- 최종 판단은 반드시 인간이 해야 합니다.

저작권자는 소프트웨어 사용으로 인한 어떠한 청구, 손해 또는 기타 책임에 대해서도 책임지지 않습니다.

---

**라이선스 발행일:** 2026년 1월 30일  
**최종 업데이트:** 2026년 1월 30일  
**버전:** 1.0
