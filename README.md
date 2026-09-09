# 🩺 Medora — AI-Powered MBBS MCQ Preparation Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Medora** is an advanced, high-yield medical MCQ platform designed for medical students preparing for **MBBS University Examinations** and **USMLE Step 1 / Step 2 CK**. 

Featuring a modern dark-glassmorphic medical UI, Medora provides a dynamic daily pool of **100+ unique, non-repeating MCQs** for every medical subject and topic, powered by a 2D combinatorial engine and strict duplicate prevention algorithms.

---

## ✨ Key Features

- 🎯 **100+ Unique Daily MCQs Per Topic**: Guaranteed daily pool of 100+ distinct questions per topic, per subject, and per exam mode.
- 🔬 **Two Specialized Exam Modes**:
  - **University Preparation**: Direct mechanisms, high-yield facts, and core theoretical medical concepts.
  - **USMLE Preparation**: Clinical vignettes, multi-step diagnostic reasoning, and patient case scenarios.
- 🔄 **"Practice My Mistakes" Mode**:
  - Automatically queues all questions you previously answered incorrectly.
  - Answering a missed question correctly removes it from your mistake list and **decreases your overall incorrect count by 1**.
- 🧬 **Deduplication Engine**: Uses Jaccard word-overlap fingerprinting and text normalization to eliminate duplicate questions.
- 📊 **Comprehensive Analytics**:
  - Live accuracy percentage & daily progress tracking.
  - Consecutive study streak counter (🔥).
  - Subject-by-subject accuracy breakdown.
- 🔊 **Text-to-Speech (TTS)**: Audio playback for detailed medical explanations and concept clarifications.
- 🎙️ **Voice Topic Search**: Integrated speech-to-text input for hands-free topic entry.
- 🌙 **Dark Glassmorphic Medical UI**: Designed with smooth animations, high-readability typography, and modern glassmorphic cards.

---

## 📚 Supported MBBS Subjects

Medora covers all 19 core medical curriculum subjects:

- **Pre-Clinical**: Anatomy, Physiology, Biochemistry
- **Para-Clinical**: Pathology, Microbiology, Pharmacology, Forensic Medicine, Community Medicine
- **Clinical**: General Medicine, General Surgery, Obstetrics & Gynecology, Pediatrics, Ophthalmology, ENT, Orthopedics, Dermatology, Psychiatry, Radiology, Anesthesia

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.3 (App Router with Turbopack)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React Icons
- **Language**: TypeScript
- **State & Storage**: Client-side `localStorage` caching with seamless Supabase DB sync support
- **AI Integration**: Google Gemini API (`@google/generative-ai`) with 2D combinatorial procedural fallback generator

---

## 🚀 Getting Started Locally

### Prerequisites

Ensure you have **Node.js 18+** installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/medora.git
   cd medora
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` to view Medora in action.

---

## 📦 Production Build & Deployment

To verify TypeScript compilation and create an optimized production build:

```bash
npm run build
```

Medora is pre-configured for instant 1-click deployment on **[Vercel](https://vercel.com)**.

---

## 📄 License

This project is open-source under the MIT License.
