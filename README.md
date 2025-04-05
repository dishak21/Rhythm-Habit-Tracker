# 🌟 Rhythm: AI-Powered Habit Tracker

Effortless. Intelligent. Deeply Personalised.  
Rhythm is an AI-powered habit tracking platform that dynamically adapts to your lifestyle—helping you stay productive, motivated, and balanced, without the stress of micromanaging your routines.

---

## 🚀 What We Do

We use cutting-edge AI and smart automation to craft personalised daily routines that seamlessly fit into your schedule. Whether you're managing work, studies, fitness, or mindfulness, Rhythm optimises your habits in real-time—so you can focus on what truly matters.

---

## 🧠 Why We’re Different

Unlike conventional habit trackers, our AI **learns from your behaviour** and intelligently **adjusts your habits** based on your evolving needs. With:

- ✔️ **AI-powered habit optimisation** – No manual tracking; your routine adapts to you.
- 🔗 **Seamless integration** – Sync with calendars, task managers, and productivity tools.
- 🎮 **Engagement-first design** – Gamification and personalised nudges keep motivation high.
- 🧘 **A holistic approach** – Beyond productivity, we support wellness, focus, and mental well-being.

---

## 💡 Our Mission

We’re on a mission to redefine habit formation by making it **intelligent, adaptive, and accessible** to everyone. Whether you're an individual striving for self-improvement, a company enhancing employee well-being, or a university supporting student success—our AI-driven approach helps build habits that last.

---

## 🌍 Where We’re Headed

We envision AI seamlessly integrating into daily life, proactively helping millions of people form better habits.  
With behavioural science, cutting-edge tech, and a passion for self-improvement, we’re building the next generation of habit tracking—**one that works with you, not against you.**

---

## ⚙️ Project Setup Instructions

### 🔧 Backend Setup (Flask + Python)

1. Open the terminal.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create a virtual environment:
   ```bash
   python3 -m venv myenv
   ```
4. Activate the virtual environment:
   * On macOS/Linux:
     ```bash
     source myenv/bin/activate
     ```
   * On Windows:
     ```bash
     myenv\Scripts\activate
     ```
5. Install dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```
6. Start the backend server:
   ```bash
   python3 run.py
   ```
### 💻 Frontend Setup (Next.js + TypeScript)
1. Open a **new terminal window**.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. (If needed) Grant execution permissions:
   ```bash
   chmod +x node_modules/.bin/next
   ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```
5. Open the application in your browser by copying the URL (it may be different for you): http://localhost:3000

---

## 📁 Folder Structure
```arduino
Rhythm-Habit-Tracker/
├── backend/
│   ├── api/
│   ├── config/
│   ├── middlewares/
│   ├── run.py
│   └── requirements.txt
├── frontend/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── public/
│   └── ...
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

---

## 🔒 Environment Configuration
Make sure to add your .env file in both frontend and backend (not tracked by Git).
```env
# Backend (.env)
GEMINI_API_KEY=your-gemini-api-key
FIREBASE_CREDENTIALS_PATH=path/to/firebase_credentials.json

# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```
