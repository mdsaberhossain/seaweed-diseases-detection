<div align="center">

# 🌿 Seaweed Disease Detection System
### Prototype Mobile-Ready App for Seaweed Disease Detection Using Deep Learning

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen)](https://seaweed-diseases-api.vercel.app)
[![Accuracy](https://img.shields.io/badge/Accuracy-99%25-blue)](https://seaweed-diseases-api.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.11-yellow)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1-orange)](https://pytorch.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**An AI-powered web application for automated seaweed disease classification to support aquaculture health monitoring. Built with EfficientNet-B2, FastAPI, and React. Supports 50 languages.**

[🌐 Live Demo](https://seaweed-diseases-api.vercel.app) • [📖 API Docs](https://saber131-seaweed-disease-v2.hf.space/docs) • [🤗 HuggingFace](https://huggingface.co/spaces/Saber131/seaweed-disease-v2)

</div>

---

## 📌 Overview

Seaweed farming is a critical component of global aquaculture, yet disease outbreaks remain a major threat to production yield and farmer livelihoods. Early and accurate disease identification is essential for effective disease management.

This project presents a **mobile-ready deep learning system** capable of identifying six seaweed health conditions from a single image, deployed as a publicly accessible web application. The system is designed to be accessible to farmers, researchers, and aquaculture professionals worldwide.

---

## 🎯 Key Features

- ✅ **99% overall accuracy** across 6 disease classes
- ✅ **Mobile-ready** — works on any device with a browser
- ✅ **50 languages supported** including RTL (Arabic, Hebrew, Persian)
- ✅ **Real-time prediction** with confidence score
- ✅ **Low-confidence warning** system for uncertain predictions
- ✅ **"Not a Seaweed" rejection class** to handle irrelevant inputs
- ✅ **Publicly deployed** — accessible to anyone worldwide

---

## 🌐 Live Demo

👉 **[https://seaweed-diseases-api.vercel.app](https://seaweed-diseases-api.vercel.app)**

Upload any seaweed image and get an instant disease prediction with confidence score.

---

## 📊 Results

### Classification Performance

| Class | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| Bleached | 99% | 98% | 99% | 314 |
| Diseased | 98% | 100% | 99% | 324 |
| Epiphyte Infestation Diseases | 100% | 99% | 100% | 320 |
| Healthy Seaweed | 99% | 99% | 99% | 316 |
| Ice-Ice Diseases | 100% | 100% | 100% | 303 |
| Not a Seaweed | 99% | 98% | 99% | 342 |
| **Overall** | **99%** | **99%** | **99%** | **1919** |

### Confusion Matrix

![Confusion Matrix](assets/confusion_matrix.png)

### Training Curves

![Training Curves](assets/training_curves.png)

---

## 🏗️ System Architecture

```
User (Mobile/Desktop)
        ↓
React Frontend (Vercel)
        ↓
FastAPI Backend (HuggingFace Spaces)
        ↓
EfficientNet-B2 Model
        ↓
Disease Classification Result
```

---

## 🦠 Disease Classes

| Class | Description |
|---|---|
| 🟢 Healthy Seaweed | Normal, disease-free seaweed |
| 🔴 Ice-Ice Diseases | Caused by environmental stress and bacterial infection |
| 🟡 Bleached | Loss of pigmentation due to stress or disease |
| 🟠 Epiphyte Infestation | Overgrowth of epiphytic organisms |
| 🟣 Diseased | Includes white rot, red rot, and microbial infections |
| ⚫ Not a Seaweed | Rejects non-seaweed inputs |

---

## 🧠 Model

| Property | Details |
|---|---|
| Architecture | EfficientNet-B2 |
| Pretrained On | ImageNet |
| Input Size | 288 × 288 px |
| Parameters | ~9.7M |
| Training Epochs | 30 |
| Best Validation Accuracy | 94.4% |
| Overall Dataset Accuracy | 99% |
| Framework | PyTorch + TIMM |

### Training Strategy
- **Phase 1 (Epochs 1–5):** Backbone frozen, only classifier head trained
- **Phase 2 (Epochs 6–30):** Full network fine-tuned end-to-end
- **Optimizer:** AdamW with cosine annealing scheduler
- **Loss:** Cross-entropy with label smoothing (0.1)

---

## 📁 Project Structure

```
seaweed-disease-detection/
├── api/
│   ├── main.py              # FastAPI inference server
│   ├── Dockerfile           # Docker configuration
│   ├── requirements.txt     # Python dependencies
│   └── classes.json         # Class labels
├── frontend/
│   ├── App.jsx              # React frontend
│   ├── main.jsx             # Entry point
│   └── index.css            # Styles
├── assets/
│   ├── confusion_matrix.png # Evaluation results
│   └── training_curves.png  # Training progress
└── README.md
```

---

## 🚀 How to Run

### Backend API (Local)

```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend (Local)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 📦 Dataset

- **Source:** Literature review — screenshots from published research papers
- **Total Images:** 1,919
- **Classes:** 6
- **Images per class:** 300–350
- **Split:** 85% training / 15% validation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Deep Learning | PyTorch, TIMM, EfficientNet-B2 |
| Backend API | FastAPI, Uvicorn |
| Frontend | React, Vite |
| Deployment | HuggingFace Spaces (API), Vercel (Frontend) |
| Containerization | Docker |
| Training Environment | Google Colab (Tesla T4 GPU) |

---

## 👨‍💻 Author

**Md Saber Hossain**
- GitHub: [@mdsaberhossain](https://github.com/mdsaberhossain)
- HuggingFace: [@Saber131](https://huggingface.co/Saber131)
- Live Demo: [seaweed-diseases-api.vercel.app](https://seaweed-diseases-api.vercel.app)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Made with ❤️ for Aquaculture Health Monitoring
</div>