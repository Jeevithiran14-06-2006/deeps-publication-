# Vowles Publications 🔬📚
> **A Next-Generation, Peer-Reviewed Scientific Publishing & Open Access Platform**

Vowles Publications is a modern, glassmorphic academic publishing platform designed to accelerate scientific discovery through rapid double-blind peer review, open access dissemination, and interactive AI research tools.

---

## ✨ Key Features

- **🏛️ Flagship Indexed Journals Directory:** Dedicated landing pages for 6 flagship journals featuring Clarivate Impact Factors (up to 7.3), CiteScores, ISSN numbers, and Editorial Boards.
- **🔍 EurekaSelect-Style Faceted Catalog:** Search by DOI, author, title, abstract, or keyword with real-time filtering by subject and access type.
- **🛒 Academic Shopping Cart & Checkout:** Slide-out cart drawer supporting article PDF purchases, institutional subscriptions, and APC vouchers with promo code support (`VOWLES20`).
- **📜 1-Click Academic Citation Generator:** Copy citations formatted in APA 7th, MLA 9th, Chicago, Harvard, IEEE, BibTeX, and RIS for Zotero/Mendeley.
- **📖 In-Browser Glassmorphic Reader:** Distraction-free full-text reader with adjustable typography and embedded PDF preview.
- **🤖 Paper AI Research Assistant:** Interactive "Chat with Paper" drawer with preset prompts (*Summarize findings*, *Explain methodology*, *ELI5*, *Limitations*).
- **🎧 2-Minute Paper Podcast / Audio Digest:** Browser-native speech synthesis narration with animated equalizer waveform bars and live transcript word highlighting.
- **📍 Live 6-Stage Manuscript Tracker:** Real-time author pipeline tracking submissions through file verification, plagiarism screening, double-blind peer review, editorial decision, and DOI minting.
- **🛡️ Editorial Office Dashboard:** Manage submissions, assign expert peer reviewers, inspect evaluation scorecards, and mint official DOIs (`10.5555/vowles...`).
- **💾 Google Drive / SQLite Storage:** Dual-layer persistence with SQLite database and local Drive folder syncing for manuscripts.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Jeevithiran14-06-2006/vowles-publication-.git
cd vowles-publication-

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Running Locally
Run the backend server and frontend dev server:

```bash
# Terminal 1: Start Backend API (Port 3001)
node backend/server.js

# Terminal 2: Start Vite Frontend (Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Credentials
- **Editorial Admin Access:** `admin@vowles.com` (Unlocks `/dashboard`)
- **Author / Reader Access:** `dr.sarah@mit.edu` or any academic email

---

## 🛠️ Technology Stack
- **Frontend:** React 19, Vite, React Router 7, Lucide Icons
- **Backend:** Node.js, Express.js, Multer
- **Database:** SQLite3 with pre-seeded flagship manuscripts
- **Styling:** Custom Glassmorphic Dark UI, CSS animations

---

## 📄 License
© Vowles Publications. All rights reserved.
