# 🩺 Medora — AI-Powered MBBS & USMLE MCQ Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <strong>Medora</strong> is a state-of-the-art, high-yield medical MCQ platform engineered specifically for medical students preparing for <strong>MBBS University Professional Examinations</strong> and <strong>USMLE Step 1 / Step 2 CK</strong>.
</p>

---

## 🌟 Why Medora?

Traditional medical question banks often cap daily practice or repeat identical questions. Medora solves this with an **Infinite 2D Matrix Engine** that dynamically generates and serves **100+ unique, non-repeating MCQs per day** for **every single subject, topic, and test preparation type separately**.

---

## ✨ Key Features & Capabilities

### 🎯 1. 100+ Unique Daily MCQ Pool per Topic
- Separate daily question pools for every individual topic (e.g. *Physiology → Blood*, *Anatomy → Head & Neck*, *Pharmacology → Autonomic Nervous System*).
- Guaranteed minimum of **100 unique questions daily** per topic.
- Visual **`100+ Daily Pool`** status badge on every practice session.

---

### 🔬 2. Dual Preparation Modes (Strict Separation)
- **University Preparation Mode**: Focuses on core theoretical concepts, anatomical structures, physiological mechanisms, and direct high-yield academic questions.
- **USMLE Preparation Mode**: Emphasizes clinical vignettes, patient presentations, laboratory interpretations, and multi-step diagnostic reasoning.
- *Questions are strictly isolated and never cross between modes.*

---

### 🔄 3. Smart "Practice My Mistakes" Engine
- Dedicated mistake practice mode that automatically queues questions you previously answered incorrectly.
- **Real-Time Progress Correction**: When you select the correct answer for a previously missed question:
  - The system marks the question as resolved.
  - Your **total incorrect count immediately decreases by 1** across your dashboard and progress reports.
  - The item is cleanly removed from your active incorrect question bank.

---

### 🧬 4. Intelligent Deduplication Engine
- Uses **Jaccard Word-Overlap Similarity Fingerprinting** and text normalization algorithms.
- Rejects identical or substantially similar questions (similarity threshold > 85%) to ensure zero repetition during daily practice.

---

### 📊 5. Comprehensive Analytics & Progress Tracking
- **Daily Performance**: Questions attempted, accuracy percentage, and daily correct/incorrect counts.
- **Study Streak (🔥)**: Tracks consecutive study days.
- **Subject-Wise Breakdown**: Detailed accuracy breakdown across all 19 medical subjects.
- Works offline via client-side `localStorage` with optional cloud backup sync.

---

### 🔊 6. Text-to-Speech (TTS) & Voice Features
- **Integrated TTS Audio Player**: Listen to comprehensive medical explanations and concept clarifications with a single click.
- **Voice Topic Search**: Microphoned speech-to-text input for quick hands-free topic selection.

---

### 🌙 7. Premium Dark Medical Glassmorphic UI
- Designed with high-readability Inter typography, cyan and medical blue accent palettes (`#3B82F6`, `#14B8A6`), smooth CSS keyframe animations, and custom dark glassmorphic cards (`#0A0F1C` theme).

---

## 📚 Supported MBBS Subjects (Full Curriculum)

Medora supports all 19 subjects of the modern MBBS medical curriculum:

| Phase | Subjects Included |
|---|---|
| **Pre-Clinical** | Anatomy, Physiology, Biochemistry |
| **Para-Clinical** | Pathology, Microbiology, Pharmacology, Forensic Medicine, Community Medicine |
| **Clinical** | General Medicine, General Surgery, Obstetrics & Gynecology, Pediatrics, Ophthalmology, ENT, Orthopedics, Dermatology, Psychiatry, Radiology, Anesthesia |

---

## 🌐 Live Demo & Deployment

- **Live Platform**: [https://medora.vercel.app]((https://medora-gray.vercel.app/)) *(Replace with your actual Vercel link once deployed)*


---

## 🛠️ Architecture & Tech Stack

