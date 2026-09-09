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

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD;
    User[Medical Student] --> UI[Next.js 16 App Router UI];
    UI --> Pool[Local Daily Pool Engine];
    Pool --> Dedup[Jaccard Deduplication & Fingerprinting];
    Pool --> Matrix[2D Combinatorial Matrix - 100+ Stems];
    Pool --> AI[Google Gemini AI API];
    UI --> LocalStorage[Client Storage & Analytics];
    UI --> Supabase[Supabase DB - Optional Cloud Sync];

Frontend Framework: Next.js 16.3 (App Router with Turbopack)
UI & Styling: React 19, Tailwind CSS v4, Lucide Icons
Type Safety: TypeScript 5
Deduplication Engine: Jaccard similarity & stem hashing (src/lib/daily-pool.ts)
Procedural Engine: 2D Sub-Concept × Focus Angle Matrix (src/lib/fallback-questions.ts)
Cloud Database (Optional): Supabase PostgreSQL (@supabase/supabase-js)
Deployment Platform: Vercel
📁 Directory Structure


Medora/
├── src/
│   ├── app/
│   │   ├── api/             # REST API routes (attempts, questions, progress, users)
│   │   ├── dashboard/       # Main user analytics dashboard
│   │   ├── practice/
│   │   │   ├── mode/        # Exam selection (University vs USMLE)
│   │   │   ├── topic/       # Topic picker with voice search
│   │   │   └── quiz/        # Core MCQ quiz engine & mistake practice
│   │   ├── progress/        # Comprehensive performance charts
│   │   ├── questions/       # Question Bank & mistake review tab
│   │   ├── subjects/        # 19 MBBS subjects grid
│   │   └── page.tsx         # User onboarding landing page
│   ├── components/
│   │   ├── layout/          # Navbar, BottomNav, PageContainer
│   │   ├── progress/        # Accuracy charts & streak indicators
│   │   ├── quiz/            # QuestionCard, FeedbackPanel, TTSButton
│   │   ├── subjects/        # SubjectCard, ModeCard, SpeechInput
│   │   └── ui/              # StatCard, LoadingSkeleton, EmptyState
│   └── lib/
│       ├── constants.ts      # Curriculum knowledge base & constants
│       ├── daily-pool.ts     # Deduplication & daily pool storage manager
│       ├── fallback-questions.ts # 2D Combinatorial Question Generator
│       ├── gemini.ts        # Google Gemini AI integration
│       └── user.ts          # Storage & progress tracking utilities
├── public/                  # Static assets & icons
├── package.json
└── README.md
⚡ Quick Start Guide (Local Setup)
1. Prerequisites
Node.js: v18.0.0 or higher
npm: v9.0.0 or higher
2. Clone & Install
bash


git clone https://github.com/YOUR_USERNAME/medora.git
cd medora
npm install
3. Run Development Server
bash


npm run dev
Open http://localhost:3000 in your browser.

🌐 Deploying to Vercel
Push your code to a GitHub repository.
Go to Vercel and click Add New... → Project.
Import your medora repository.
Set Project Name to medora (all lowercase).
Click Deploy.
Note: Medora runs 100% out of the box without requiring environment variables. Optional keys (e.g. GEMINI_API_KEY) can be added under Project Settings → Environment Variables.

📜 License
This project is released under the MIT License.

