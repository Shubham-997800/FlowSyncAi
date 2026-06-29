<div align="center">
  <h1>FlowSync AI</h1>
  <p><strong>AI-Powered Productivity Suite</strong></p>
  <p>Smart Tasks &bull; Goals &bull; Habits &bull; Focus Timer &bull; AI Planner</p>
  <p>
    <a href="https://flowsyncai30.vercel.app" target="_blank">Live Demo</a>
    &nbsp;&bull;&nbsp;
    <a href="https://flowsync-ai-production.up.railway.app" target="_blank">API Status</a>
  </p>
</div>

---

## About

FlowSync AI is a full-stack productivity app powered by Google Gemini 2.0 Flash. It helps you manage tasks, track goals, build habits, stay focused with a Pomodoro timer, and get AI-driven scheduling — all in one place.

Built with React 19 + Vite 8 on the frontend, Express 4 + Mongoose 9 on the backend, and hosted on Vercel + Railway.

---

## Features

- **AI Chat Planner** — Create tasks from natural language via Gemini AI chat
- **Tasks & Goals** — Full CRUD with priorities, status tracking, progress bars
- **Analytics Dashboard** — Productivity score, weekly/monthly trends, AI report
- **Focus Mode** — Pomodoro timer with custom focus/break times, ambient sounds
- **Habits & Streaks** — Daily/weekly tracking with auto-calculated streaks
- **Smart Calendar** — Monthly/weekly/daily views with AI schedule optimization
- **Notifications** — Real-time notification center with popup drawer
- **Profile & Settings** — Avatar upload, theme toggle, password change, account management
- **AI Rescue Mode** — Emergency replanning when you fall behind on deadlines
- **Dark Mode** — Light/dark/system theme support

---

## Tech Stack

**Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, Lucide Icons

**Backend:** Node.js, Express 4, Mongoose 9, MongoDB Atlas, JWT, bcryptjs

**AI:** Google Gemini 2.0 Flash (via @google/genai SDK)

**Infrastructure:** Vercel (frontend), Railway (backend)

---

## Quick Start

```bash
git clone https://github.com/Shubham-997800/FlowSync-Ai.git
cd FlowSync-Ai

# Backend
cd flowsync-backend
npm install
# Edit .env — set MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, CLIENT_URL
npm run dev

# Frontend (separate terminal)
cd client
npm install
# Edit .env — set VITE_API_URL=http://localhost:5000
npm run dev
```

---

## API

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/signup` | Create account |
| `POST /api/auth/login` | Sign in → JWT token |
| `GET/POST /api/tasks` | CRUD tasks |
| `GET/POST /api/goals` | CRUD goals |
| `GET/POST /api/habits` | CRUD habits + check-in |
| `GET /api/analytics/*` | Stats, weekly, monthly |
| `GET/POST /api/notifications` | Notifications |
| `GET/PUT /api/settings/*` | Profile, avatar, password |
| `POST /api/ai/*` | Chat, plan, prioritize, rescue |

All protected routes require `Authorization: Bearer <token>` header.

---

## Project Structure

```
client/               # React frontend
  src/
    pages/            # Dashboard, Tasks, Calendar, Focus, Habits, Analytics, etc.
    context/          # AuthContext, ThemeContext
    services/         # Axios API layer
    components/       # Shared UI components
    routes/           # Lazy-loaded routing

flowsync-backend/     # Express API
  controllers/        # Auth, Task, Goal, Habit, Analytics, etc.
  models/             # User, Task, Goal, Habit, Notification
  middleware/         # JWT auth, rate limiting
  routes/             # Express routers
  services/           # Gemini AI integration
```

---

## Links

- **Live App:** https://flowsyncai30.vercel.app
- **Backend API:** https://flowsync-ai-production.up.railway.app
- **GitHub:** https://github.com/Shubham-997800/FlowSync-Ai
- **Author:** Shubham Dangi

---

<sub>&copy; 2026 FlowSync AI</sub>
