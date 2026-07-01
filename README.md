<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=32&duration=3200&pause=600&color=818CF8&center=true&vCenter=true&width=580&height=80&lines=FlowSync+AI;AI-Powered+Productivity+OS;Plan+Smarter+%E2%80%A2+Focus+Better;Never+Miss+a+Deadline+Again">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=32&duration=3200&pause=600&color=6366F1&center=true&vCenter=true&width=580&height=80&lines=FlowSync+AI;AI-Powered+Productivity+OS;Plan+Smarter+%E2%80%A2+Focus+Better;Never+Miss+a+Deadline+Again" alt="FlowSync AI">
  </picture>
</p>

<p align="center">
  <b>An AI-Powered Productivity Operating System</b><br>
  <i>Proactively analyze, prioritize, and execute — before deadlines become crises.</i>
</p>

<p align="center">
  <a href="https://flowsyncai30.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white" /></a>
  <a href="https://github.com/Shubham-997800/FlowSync-Ai"><img src="https://img.shields.io/badge/Source_Code-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://github.com/Shubham-997800/FlowSync-Ai/stargazers"><img src="https://img.shields.io/github/stars/Shubham-997800/FlowSync-Ai?style=for-the-badge&logo=github&color=yellow" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-FF6600?style=flat-square&logo=openrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT_Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Build-Passing-22c55e?style=flat-square" />
  <img src="https://img.shields.io/badge/License-Proprietary-FF6600?style=flat-square" />
  <img src="https://img.shields.io/github/commit-activity/m/Shubham-997800/FlowSync-Ai?style=flat-square" />
  <img src="https://img.shields.io/badge/Author-Shubham-6366F1?style=flat-square" />
</p>

<br>

---

## 📦 Table of Contents

- [Problem Statement](#-problem-statement)
- [Why FlowSync AI?](#-why-flowsync-ai)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Workflow](#-project-workflow)
- [Folder Structure](#-folder-structure)
- [Database Schema](#-database-schema)
- [API Architecture](#-api-architecture)
- [AI Architecture](#-ai-architecture)
- [Request Lifecycle](#-request-lifecycle)
- [Authentication Flow](#-authentication-flow)
- [Recent Improvements](#-recent-improvements)
- [License & Usage](#-license--usage)
- [Author](#-author)
- [Acknowledgements](#-acknowledgements)

---

## 🧠 Problem Statement

### The Productivity Paradox

The average professional uses **3.1 task management tools** simultaneously. Yet **41% of all tasks** remain incomplete. Deadlines slip. Priorities shift. Burnout rises.

Traditional to-do apps fail because they treat productivity as **data entry** — you input tasks, the app stores them, and then sends a passive reminder that you ignore.

```
Current tools:    Input → Store → Remind → Ignore ✓
What we need:     Input → Analyze → Prioritize → Execute
```

### Why Reminders Fail

```mermaid
graph LR
    A[Alert sounds] --> B[You glance]
    B --> C[13 unread tasks]
    C --> D["I'll do it later"]
    D --> A
    style A fill:#991b1b,stroke:#fca5a5,color:#fff
    style D fill:#991b1b,stroke:#fca5a5,color:#fff
```

Reminders treat the symptom (forgetting) without addressing the root cause: **overwhelm and lack of intelligent prioritization**.

### How FlowSync AI Solves This

FlowSync AI replaces passive storage with **active intelligence**. Instead of asking "what's due?", it asks "what matters most right now?" and reshapes your day accordingly.

```
FlowSync AI:  Input → AI Analysis → Priority Engine → Rescue Mode → Execute → Adapt
```

> [!NOTE]
> FlowSync AI is not a to-do list. It is a **decision engine** that uses AI (OpenRouter + Qwen 2.5 7B) to understand context, predict risk, and optimize every minute of your day.

---

## 🚀 Why FlowSync AI?

### The Vision

We believe productivity tools should work **for** you, not the other way around. The future of task management is **proactive**, not reactive. FlowSync AI was built on three core principles:

| Principle | What It Means |
|-----------|---------------|
| **AI-First, Not AI-Wrapped** | AI isn't a chatbot bolted onto a to-do list. It's the core engine that analyzes, prioritizes, and replans every task in real time. |
| **Proactive > Reactive** | Instead of waiting for you to miss a deadline, FlowSync predicts the risk and suggests corrective action before it's too late. |
| **Context-Aware Execution** | The system understands your workload, your deadlines, your priorities, and your capacity — then builds a schedule that fits. |

### What Makes It Different

| Feature | Traditional To-Do Apps | FlowSync AI |
|---------|----------------------|-------------|
| Task Creation | Manual only | Natural language via AI chat |
| Prioritization | User-defined (static) | AI-driven urgency scores + risk analysis |
| Daily Planning | None or manual | AI-generated optimized time blocks |
| Overload Handling | "You have 12 tasks due" | Rescue Mode — AI replans and compresses |
| Focus Integration | Separate app | Built-in Pomodoro with task sync |
| Habit Tracking | Standalone | Unified with tasks and goals |
| Analytics | Completion % | AI productivity coach with trends |
| Deadline Risk | None | Predictive risk scoring |

---

## ✨ Key Features

### 🤖 AI Capabilities

| Feature | Description |
|---------|-------------|
| **AI Chat Assistant** | Conversational interface — say "Schedule a standup at 10am tomorrow" and the task is created, prioritized, and slotted into your calendar. Chat history is persisted to the database across sessions. |
| **AI Chat History** | Every conversation is saved to MongoDB — browse past chats, delete individual messages, or clear entire history with "New Chat" button. |
| **Multilingual AI Chat** | Auto-detects user language (Hindi, Hinglish, English, Spanish, etc.) and responds in the same language — including Hinglish (Devanagari + English mix). |
| **Smart Daily Planning** | AI analyzes all pending tasks, deadlines, and priorities to generate an optimal day schedule with focused work blocks, breaks, and buffers. |
| **Task Prioritization Engine** | Every task receives a dynamic urgency score (0–100) and risk score (0–100) based on deadline proximity, dependencies, and current workload. |
| **Rescue Mode** | When the day is overloaded, AI identifies what's critical, what can be dropped, and compresses the remaining work into a survivable plan. |
| **AI Task Suggestions** | While typing a task title, AI suggests optimal priority, estimated time, and relevant tags in real-time. |
| **AI Dashboard Coach** | AI-powered productivity recommendations on the dashboard based on actual task data, urgency scores, and risk analysis. |
| **AI Calendar Preview** | Shows AI-priority-ranked tasks per day with risk scores for smarter scheduling. |
| **AI Focus Mode** | Context-aware break timing suggestions based on task priority and overdue status (shorter blocks for urgent tasks, longer for deep work). |
| **Productivity Coach** | AI-generated reports that highlight patterns, strengths, weaknesses, and actionable recommendations via the analytics-insights API. |
| **AI Consent System** | Privacy-first opt-in for AI features, managed from Settings with full visibility. |
| **200/day Usage Limit** | Per-user daily AI call quota with usage tracking via `/api/ai/usage` endpoint. |
| **Voice Input** | Speech-to-text via Web Speech API in the AI chat interface for hands-free task creation. |

### 📋 Core Features

| Category | Feature | Details |
|----------|---------|---------|
| 🔐 **Auth** | Login / Signup / Forgot / Reset / 401 / 404 | JWT-based with bcrypt hashing, forgot/reset password via email, inline validation, password strength meter (5 levels + colored bars), requirement checklist, framer-motion animations + Helmet SEO |
| 📝 **Tasks** | Full CRUD + Goals | Priority levels, status tracking, deadlines, descriptions, field sanitization, AI suggested priority/estimate/tags, framer-motion staggered list + Helmet SEO |
| 🎯 **Goals** | Milestone Tracking | Target dates, progress percentage, aligned with tasks, animated progress bars |
| 🔄 **Habits** | Streak Tracking | Daily/weekly frequency, auto-calculated streaks, visual weekly grid, framer-motion card animations + Helmet SEO |
| 📅 **Calendar** | Multi-View | Monthly, weekly, and daily views with AI-priority-ranked task suggestions, framer-motion page animation + Helmet SEO |
| ⏱️ **Focus Mode** | Pomodoro Timer | Configurable focus/break durations, task integration, AI break timing suggestions, framer-motion entrance + Helmet SEO |
| 📊 **Analytics** | Deep Insights | Productivity score (animated ring chart), completion rates, weekly/monthly trends, focus session stats, AI-generated report, framer-motion staggered cards + Helmet SEO |
| 🏆 **Achievements** | Gamification | Milestone-based achievements (tasks, goals, focus) with MongoDB persistence |
| 🔔 **Notifications** | Real-Time Drawer | All/Unread filters, grouped by Today / This Week / Earlier, auto deadline reminders, framer-motion list + Helmet SEO |
| 🏠 **Dashboard** | Command Center | Task stats, AI priority cards (live API), productivity score, deadline risk indicators, animated counters with mini sparkline charts + trend indicators, inline task editing, bulk select/complete, collapse completed tasks, quick focus button, AI recommendation refresh + skeleton + error retry + sessionStorage cache (5 min), deadline risk pulse animation + inline mark-done + view all, recent activity grouped by Today/Yesterday/This Week, widget visibility toggle persisted to localStorage, date range filter (All/Week/Month), onboarding empty state with CTAs, ErrorBoundary for resilience, last sync timestamp, AnimatePresence page transitions |
| ⚙️ **Settings** | Full Control | Theme toggle (light/dark/system), AI consent toggle, profile editing, account deletion, framer-motion sidebar stagger + Helmet SEO |
| 👤 **Profile** | Customizable | Avatar upload, bio, phone, location, job title, password change, framer-motion tab animations + Helmet SEO |
| 🎤 **Voice Input** | Speech-to-Text | Browser-native Web Speech API for AI chat and task creation |
| 🌙 **Dark Mode** | Three Themes | Light, dark, and system-follow with smooth CSS transitions |
| 📧 **Email Reminders** | Auto Notifications | Scheduled service that generates deadline alerts every 30 minutes |

---

## 📸 Screenshots

> *Live demo available at [flowsyncai30.vercel.app](https://flowsyncai30.vercel.app)*

| Page | Preview |
|------|---------|
| **Landing Page** | `_Coming Soon_` |
| **Dashboard** | `_Coming Soon_` |
| **Task Manager** | `_Coming Soon_` |
| **AI Planner** | `_Coming Soon_` |
| **Calendar** | `_Coming Soon_` |
| **Focus Mode** | `_Coming Soon_` |
| **Analytics** | `_Coming Soon_` |
| **Settings** | `_Coming Soon_` |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose | Why We Chose It |
|------------|---------|---------|-----------------|
| **React** | 19 | UI component library | Mature ecosystem, concurrent features, server components |
| **Vite** | 8 | Build tool & dev server | Sub-second HMR, native ESM, optimized production builds |
| **Tailwind CSS** | 4 | Utility-first styling | Rapid prototyping, consistent design system, dark mode |
| **Framer Motion** | Latest | Animation library | Declarative animations, gesture support, layout transitions |
| **React Router** | 7 | Client-side routing | Lazy loading, nested routes, data loading patterns |
| **Axios** | 1 | HTTP client | Interceptors for JWT, request/response transformations |
| **Lucide React** | Latest | Icon library | Consistent, tree-shakeable SVG icon set |
| **React Hot Toast** | 2 | Toast notifications | Lightweight, customizable, promise-based API |
| **React Helmet Async** | Latest | SEO & meta tags | Sets title, OG tags, Twitter cards dynamically |

### Backend

| Technology | Version | Purpose | Why We Chose It |
|------------|---------|---------|-----------------|
| **Node.js** | 24+ | JavaScript runtime | Non-blocking I/O, vast ecosystem, modern JS features |
| **Express** | 4 | Web framework | Minimal, flexible, extensive middleware ecosystem |
| **Mongoose** | 9 | MongoDB ODM | Schema validation, middleware hooks, population queries |
| **MongoDB Atlas** | — | Cloud database | Free tier, auto-scaling, global replication, built-in monitoring |
| **jsonwebtoken** | 9 | JWT auth | Stateless authentication, industry standard |
| **bcryptjs** | 3 | Password hashing | 10 salt rounds, constant-time comparison |
| **Helmet** | 8 | Security headers | XSS, clickjacking, MIME sniffing protection |
| **express-rate-limit** | 8 | Rate limiting | Per-endpoint configurable limits |
| **nodemailer** | Latest | Email service | Password reset emails, HTML templates |

### AI & Infrastructure

| Technology | Purpose |
|------------|---------|
| **OpenRouter** | AI chat, planning, prioritization, rescue mode — Qwen 2.5 7B via OpenAI-compatible SDK |
| **Vercel** | Frontend hosting with auto-deploy from GitHub, edge CDN |
| **Railway** | Backend hosting with auto-deploy from GitHub, HTTPS, zero-downtime deploys |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        🌐 DNS (Vercel CDN)                             │
│                      flowsyncai30.vercel.app                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────── FRONTEND (Vercel) ───────────────────────────┐  │
│  │                                                                   │  │
│  │  React 19 + Vite 8 + Tailwind 4 + Framer Motion                  │  │
│  │                                                                   │  │
│  │  ┌─────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │ Landing │ │ Dashboard │ │  Tasks   │ │ Calendar │            │  │
│  │  │  Page   │ │  + Stats  │ │ + Goals  │ │ + Views  │            │  │
│  │  ├─────────┤ ├───────────┤ ├──────────┤ ├──────────┤            │  │
│  │  │AI Plan. │ │  Focus    │ │ Analytics│ │  Habits  │            │  │
│  │  │Chat+Plan│ │  Timer    │ │ + Reports│ │ + Streaks│            │  │
│  │  ├─────────┤ ├───────────┤ ├──────────┤ ├──────────┤            │  │
│  │  │Settings │ │  Profile  │ │Notificat.│ │   Auth   │            │  │
│  │  │+ Theme  │ │ + Avatar  │ │ + Filters│ │ + JWT    │            │  │
│  │  └─────────┘ └───────────┘ └──────────┘ └──────────┘            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                  │                                       │
│                    HTTPS + JSON + JWT Bearer Token                       │
│                                  ▼                                       │
│  ┌───────────────────── BACKEND (Railway) ───────────────────────────┐  │
│  │                                                                   │  │
│  │  Express 4 + Mongoose 9 + Helmet 8 + Rate Limiter                │  │
│  │                                                                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │  Auth    │  │  Tasks   │  │  Goals   │  │  Habits  │         │  │
│  │  │  Ctrl    │  │  Ctrl    │  │  Ctrl    │  │  Ctrl    │         │  │
│  │  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤         │  │
│  │  │Analytics │  │ Settings │  │Notificat.│  │   AI     │         │  │
│  │  │  Ctrl    │  │  Ctrl    │  │  Ctrl    │  │  Ctrl    │         │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │  │
│  │                                                                   │  │
│  │  Middleware: JWT Auth → Rate Limiter → Helmet → CORS → Morgan    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                  │                                       │
│                     ┌────────────┴────────────┐                         │
│                     ▼                         ▼                         │
│  ┌────────────────────────┐    ┌────────────────────────┐               │
│  │   🗄️ MongoDB Atlas     │    │   🤖 OpenRouter AI    │               │
│  │                        │    │                        │               │
│  │   Users    Tasks       │    │  OpenAI-compatible     │               │
│  │   Goals    Habits      │    │  chat.completions      │               │
│  │   Notifications        │    │  Structured JSON       │               │
│  └────────────────────────┘    └────────────────────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Project Workflow

```
                    ┌─────────────┐
                    │  👤 User    │
                    │  Arrives    │
                    └──────┬──────┘
                           ▼
                    ┌─────────────┐
                    │  🔐 Auth    │
                    │  Login/Sign │
                    └──────┬──────┘
                           ▼ (JWT Issued)
              ┌──────────────────────────┐
              │      🏠 Dashboard        │
              │  Task Stats  │  AI Cards │
              │  Calendar   │  Focus     │
              │  Risk Alerts│  Score     │
              └──────┬───────────────────┘
                     │
      ┌──────────────┼──────────────┬──────────────┐
      ▼              ▼              ▼              ▼
┌──────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────┐
│ 📝 Tasks │ │ 🎯 Goals   │ │ 🔄 Habits│ │ 📅 Calendar  │
│ Create   │ │ Set Target │ │ Check In │ │ View Tasks   │
│ Edit     │ │ Track %    │ │ Streak   │ │ Filter by    │
│ Priorit. │ │ Align Tasks│ │ Weekly   │ │ Month/Week   │
└────┬─────┘ └──────┬─────┘ └────┬─────┘ └──────┬───────┘
     │              │            │              │
     └──────────────┴─────┬──────┘              │
                          ▼                     │
              ┌─────────────────────┐            │
              │  🤖 AI Service      │            │
              │                     │            │
              │  Prompt Engineering │            │
              │         ▼           │            │
               │  OpenRouter API     │            │
              │         ▼           │            │
              │  Structured JSON    │            │
              │         ▼           │            │
              │  Response Parser    │            │
              └──────────┬──────────┘            │
                         ▼                       │
              ┌─────────────────────┐            │
              │  AI Outputs         │            │
              │                     │            │
              │  • Priority Scores  │            │
              │  • Daily Schedule   │            │
              │  • Rescue Plan      │            │
              │  • Chat Reply       │            │
              └──────────┬──────────┘            │
                         │                       │
                         ▼                       ▼
              ┌──────────────────────────────────────┐
              │         📊 Analytics Engine          │
              │                                      │
              │  Stats → Weekly → Monthly → Trends   │
              │  Focus Sessions → Completion Rates   │
              └──────────────────┬───────────────────┘
                                 ▼
                    ┌─────────────────────┐
                    │  🔔 Notifications    │
                    │  Real-time updates   │
                    │  Deadline alerts     │
                    └─────────────────────┘
```

---

## 📁 Folder Structure

```
flowsync-ai/
│
├── client/                                # 🎨 React Frontend
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── main.jsx                       # Entry point
│   │   ├── App.jsx                        # Root component
│   │   ├── index.css                      # Tailwind v4 config (import + dark variant + font)
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx              # Lazy-loaded route definitions
│   │   │
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx             # Sidebar + header + theme wrapper
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx            # Auth state (useReducer-based)
│   │   │   └── ThemeContext.jsx           # Dark/light/system theme
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                     # Axios instance + JWT interceptor
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   ├── goalService.js
│   │   │   ├── habitService.js
│   │   │   ├── analyticsService.js
│   │   │   ├── notificationService.js
│   │   │   ├── settingsService.js
│   │   │   ├── aiService.js
│   │   │   ├── pushService.js
│   │   │   └── chatService.js               # Chat history API layer
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.jsx                # Navigation sidebar
│   │   │   ├── NotificationPopup.jsx      # Real-time notification drawer
│   │   │   ├── LegalModal.jsx             # Terms & Privacy popup (framer-motion)
│   │   │   ├── AuthLayout.jsx             # Shared auth sidebar layout (Login/Register)
│   │   │   └── ui/                        # Reusable primitives
│   │   │       ├── Card.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── StatCard.jsx
│   │   │       ├── ProgressBar.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing/                   # Hero, Features, HowItWorks, CTA, Footer (popup modals for legal)
│   │   │   ├── Authentication/            # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── Dashboard/                 # Stats, AI cards, calendar, focus, risk
│   │   │   ├── TaskManager/               # Task list + Goal manager
│   │   │   ├── Calendar/                  # Monthly/weekly/daily views
│   │   │   ├── FocusMode/                 # Pomodoro timer + settings
│   │   │   ├── Habits/                    # Weekly tracker + streaks
│   │   │   ├── AIPlanner/                 # AI chat, schedule, priority, rescue
│   │   │   ├── Analytics/                 # Charts, trends, AI report
│   │   │   ├── Notifications/             # Notification center
│   │   │   ├── Settings/                  # Theme, AI prefs, danger zone
│   │   │   ├── Profile/                   # Avatar, personal info, password
│   │   │   ├── Legal/                     # Terms of Service, Privacy Policy
│   │   │   └── Error/                     # 404, 401 pages
│   │   │
│   │   └── hooks/                         # Custom React hooks
│   │       ├── useTheme.js
│   │       ├── useAuth.js
│   │       └── useMediaQuery.js
│   │
│   ├── vercel.json                        # SPA routing for Vercel
│   └── package.json
│
├── flowsync-backend/                      # ⚙️ Express API Server
│   ├── server.js                          # Entry point, middleware, route mounting
│   │
│   ├── config/
│   │   ├── db.js                          # Mongoose connection with retry logic
│   │   └── aiConfig.js                    # OpenRouter client (OpenAI SDK)
│   │
│   ├── middleware/
│   │   ├── auth.js                        # JWT verification
│   │   └── rateLimiter.js                 # Rate limiting strategies
│   │
│   ├── models/
│   │   ├── User.js                        # name, email, hashed password, profile, resetToken, achievements[], aiConsent
│   │   ├── Task.js                        # title, priority, status, deadline, description
│   │   ├── Goal.js                        # title, targetDate, progress
│   │   ├── Habit.js                       # title, frequency, streak, logs[]
│   │   ├── Notification.js                # type, title, message, status, userId
│   │   ├── PushSubscription.js            # endpoint, keys for web push
│   │   ├── ChatMessage.js                 # role, text, tasks[], createdTasks[]
│   │   └── AiUsage.js                     # user, date, count (200/day limit)
│   │
│   ├── controllers/
│   │   ├── authController.js              # signup, login, forgotPassword, resetPassword
│   │   ├── taskController.js              # CRUD with sanitization
│   │   ├── goalController.js              # CRUD with sanitization
│   │   ├── habitController.js             # CRUD + check-in + streak calculation
│   │   ├── analyticsController.js         # Stats, weekly, monthly aggregation
│   │   ├── notificationController.js      # Create, list, mark-read
│   │   ├── settingsController.js          # Profile, avatar, password, delete account, achievements, AI consent
│   │   ├── aiController.js               # Chat, plan, prioritize, rescue, suggest-task, usage, analytics-insights
│   │   ├── pushController.js             # Web push subscribe/unsubscribe
│   │   └── chatController.js             # Chat history get/save/delete/clear
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── habitRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── pushRoutes.js
│   │   └── chatRoutes.js                 # Chat history CRUD
│   │
│   ├── services/
│   │   ├── aiService.js                   # Prompt engineering + JSON parsing (7 models, multilingual, failover)
│   │   ├── emailService.js                # Nodemailer — password reset
│   │   └── reminderService.js             # Auto deadline alerts every 30 minutes
│   │
│   │
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🗄️ Database Schema

### Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Task : creates
    User ||--o{ Goal : sets
    User ||--o{ Habit : tracks
    User ||--o{ Notification : receives

    User {
        ObjectId _id PK
        string name "required"
        string email "unique, lowercase"
        string password "bcrypt hashed"
        string profilePicture "avatar URL"
        string bio
        string phone
        string location
        string jobTitle
        string resetPasswordToken "password reset"
        date resetPasswordExpire "1 hour expiry"
        date createdAt
        date updatedAt
    }

    Task {
        ObjectId _id PK
        ObjectId userId FK "ref User"
        string title "required"
        string description
        string priority "enum: high, medium, low"
        string status "enum: pending, in_progress, completed"
        date deadline
        date createdAt
        date updatedAt
    }

    Goal {
        ObjectId _id PK
        ObjectId userId FK "ref User"
        string title "required"
        string description
        date targetDate
        number progress "0-100"
        date createdAt
        date updatedAt
    }

    Habit {
        ObjectId _id PK
        ObjectId userId FK "ref User"
        string title "required"
        string frequency "enum: daily, weekly"
        number streak "auto-calculated"
        array logs "check-in dates"
        date createdAt
        date updatedAt
    }

    Notification {
        ObjectId _id PK
        ObjectId userId FK "ref User"
        string type "enum: deadline, achievement, system"
        string title
        string message
        boolean read "default: false"
        date createdAt
    }

    AiUsage {
        ObjectId _id PK
        ObjectId userId FK "ref User"
        string date "YYYY-MM-DD"
        number count "daily AI call count"
    }

    ChatMessage {
        ObjectId _id PK
        ObjectId userId FK "ref User"
        string sessionId "chat session grouping"
        string role "enum: user, assistant"
        string text
        array tasks "extracted tasks"
        date createdAt
    }
```

### Relationship Details

| Entity | Relation | Cardinality | Description |
|--------|----------|-------------|-------------|
| **User → Task** | One-to-Many | `1 : N` | A user can create unlimited tasks. Each task belongs to exactly one user. |
| **User → Goal** | One-to-Many | `1 : N` | Goals are user-scoped. Tasks can optionally align to goals via title matching. |
| **User → Habit** | One-to-Many | `1 : N` | Each habit is tracked independently per user. Streaks auto-calculate from log dates. |
| **User → Notification** | One-to-Many | `1 : N` | Notifications are generated by the system (deadline alerts, achievement unlocks). |
| **User → AiUsage** | One-to-Many | `1 : N` | Daily AI usage counters reset each day. |
| **User → ChatMessage** | One-to-Many | `1 : N` | Chat history persisted per user session. |

> [!NOTE]
> The `password` field is excluded from all API responses via Mongoose's `toJSON` transform. The `resetPasswordToken` and `resetPasswordExpire` fields are cleared after a successful password reset.

---

## 🌐 API Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         📱 CLIENT (React)                           │
│                                                                      │
│   ┌────────────┐   ┌────────────┐   ┌────────────┐                  │
│   │  Auth Page  │   │ Dashboard  │   │ AI Planner │    ...           │
│   └──────┬─────┘   └──────┬─────┘   └──────┬─────┘                  │
│          │                │                │                         │
│          └────────────────┼────────────────┘                         │
│                           │                                          │
│                    ┌──────▼──────┐                                    │
│                    │  Axios API  │                                    │
│                    │  Service    │                                    │
│                    │  + JWT      │                                    │
│                    └──────┬──────┘                                    │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                      HTTPS / JSON
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│                         🖥️ EXPRESS SERVER (Railway)                   │
│                                                                      │
│   ┌──────────────────────────────────────────────────────┐          │
│   │                 MIDDLEWARE PIPELINE                   │          │
│   │                                                       │          │
│   │   Helmet → CORS → Morgan → Rate Limiter → JSON Parse │          │
│   └──────────────────────┬───────────────────────────────┘          │
│                          │                                           │
│                    ┌─────▼──────┐                                    │
│                    │   Router   │                                    │
│                    └──┬──┬──┬──┘                                    │
│          ┌────────────┘  │  └────────────┐                          │
│          ▼               ▼               ▼                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │  Auth      │  │  Tasks     │  │    AI      │    ...              │
│  │  Routes    │  │  Routes    │  │  Routes    │                     │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘                    │
│         │               │               │                            │
│         ▼               ▼               ▼                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │  Auth      │  │  Task      │  │    AI      │                     │
│  │Controller  │  │Controller  │  │Controller  │                     │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘                    │
│         │               │               │                            │
│         ▼               ▼               ▼                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │  Services  │  │  Mongoose  │  │  AI        │                     │
│  │  (Email)   │  │  Models    │  │  Service   │                     │
│  └────────────┘  └──────┬─────┘  └──────┬─────┘                    │
│                         │               │                            │
└─────────────────────────┼───────────────┼──────────────────────────┘
                          ▼               ▼
              ┌────────────────────┐  ┌────────────────────┐
               │   🗄️ MongoDB Atlas │  │  🤖 OpenRouter AI │
              │                    │  │                    │
              │  5 Collections    │  │  OpenAI SDK        │
              │  Indexed Queries  │  │  Structured JSON   │
              └────────────────────┘  └────────────────────┘
```

---

## 🤖 AI Architecture

FlowSync AI's intelligence is powered by **OpenRouter** with **7 AI models** in a failover chain (Llama 3.3 70B, GPT-4o-mini, Claude 3 Haiku, Gemini 2.0 Flash, Mistral 7B, DeepSeek V3, Qwen 2.5 7B), accessed through the **OpenAI-compatible SDK**. The AI layer is designed for reliability, structured output, graceful fallbacks, and multilingual support.

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         AI SERVICE LAYER                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐        │
│  │                    SYSTEM PROMPT                          │        │
│  │                                                            │        │
│  │  "You are FlowSync AI, a productivity engine. Always       │        │
│  │   respond with valid JSON only. No markdown, no            │        │
│  │   explanations."                                           │        │
│  └──────────────────────────┬───────────────────────────────┘        │
│                             │                                         │
│  ┌──────────────────────────▼───────────────────────────────┐        │
│  │                   PROMPT BUILDER                          │        │
│  │                                                            │        │
│  │  Injects: user message + current tasks + context           │        │
│  │                                                            │        │
│  │  Output: fully constructed prompt ready for API call       │        │
│  └──────────────────────────┬───────────────────────────────┘        │
│                             │                                         │
│  ┌──────────────────────────▼───────────────────────────────┐        │
│  │              OpenRouter API (via OpenAI SDK)               │        │
│  │                                                            │        │
│  │  Endpoint: https://openrouter.ai/api/v1                    │        │
│  │  Model:    qwen/qwen-2.5-7b-instruct                      │        │
│  │  Temp:     0.3 (deterministic output)                     │        │
│  │                                                            │        │
│  │  Response: structured JSON string                          │        │
│  └──────────────────────────┬───────────────────────────────┘        │
│                             │                                         │
│  ┌──────────────────────────▼───────────────────────────────┐        │
│  │                  JSON RESPONSE PARSER                     │        │
│  │                                                            │        │
│  │  1. Strip markdown code fences (```json ... ```)           │        │
│  │  2. Attempt JSON.parse()                                   │        │
│  │  3. If fails → find first { and last } -> slice + parse   │        │
│  │  4. If all fails → return default fallback structure       │        │
│  │                                                            │        │
│  │  Output: validated JSON object                             │        │
│  └──────────────────────────┬───────────────────────────────┘        │
│                             │                                         │
│  ┌──────────────────────────▼───────────────────────────────┐        │
│  │               ERROR HANDLING & FALLBACKS                  │        │
│  │                                                            │        │
│  │  • 429 Rate Limit: return AI_SERVICE_UNAVAILABLE           │        │
│  │  • Parse failure: return sensible defaults                 │        │
│  │  • Network error: return cached last response (future)     │        │
│  └──────────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────────┘
```

### AI Capabilities Breakdown

| Capability | Prompt Strategy | Response Format | Fallback |
|------------|----------------|----------------|---------|
| **Chat** | User message + current tasks context | `{ reply, tasks[], suggestions[] }` | Default polite response |
| **Multilingual Chat** | Language detection from user input, responds in same language (Hinglish, Hindi, English, Spanish, etc.) | Same as Chat | Default English |
| **Daily Plan** | User prompt + task list with deadlines | `{ priority[], schedule[], suggestions[], confidence }` | Empty plan |
| **Prioritize** | Task list with IDs, titles, priorities | `{ rankings[], suggestedOrder[], summary }` | Equal scores |
| **Rescue Mode** | Overloaded task list, 48h window | `{ criticalTasks[], compressedSchedule[], dropRecommendations[] }` | Empty arrays |
| **Suggest Task** | Task title + existing tasks context | `{ suggestedPriority, suggestedEstimatedTime, suggestedTags[], reason }` | Medium priority defaults |
| **Analytics Insights** | Full task/habit/goal data | `{ strengths[], weaknesses[], recommendations[], productivityScore, predictedCompletionRate }` | Static fallback |
| **Voice Input** | Web Speech API → text → AI chat | Same as Chat | Text input fallback |

---

## ⚡ Request Lifecycle

```
                      ┌────────────────┐
                      │  🌐 Browser    │
                      │  HTTP Request  │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │  React Router  │
                      │  (Lazy Load)   │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │  Axios Call    │
                      │  + JWT Header  │
                      └───────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
        │  Auth     │  │  Rate     │  │  Helmet   │
        │  Middle.  │  │  Limiter  │  │  Security │
        └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                      ┌───────▼────────┐
                      │  Express Route │
                      │  (Router)      │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │  Controller    │
                      │  (Validation)  │
                      └───────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
         │  MongoDB  │  │ OpenRouter│  │  Email    │
        │  Query    │  │  API Call │  │  Service  │
        └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                      ┌───────▼────────┐
                      │  JSON Response │
                      │  + Status Code │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │  Axios Res.    │
                      │  Interceptor   │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │  React State   │
                      │  Update + UI   │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │  🎨 Render    │
                      └────────────────┘
```

---

## ⚡ Performance & Build Optimizations

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUNDLE BREAKDOWN (Code Splitting)             │
├─────────────────────────────────────────────────────────────────┤
│  vendor (React 19)     181 kB  │  motion (Framer Motion) 125 kB│
│  utils (Axios, etc.)    73 kB  │  router (React Router)   42 kB│
│  icons (Lucide)         25 kB  │  app code                56 kB│
└─────────────────────────────────────────────────────────────────┘
```

| Optimization | Implementation |
|-------------|---------------|
| **Code Splitting** | `manualChunks` splits vendor (181 kB), router (42 kB), motion (125 kB), icons (26 kB), utils (73 kB), app (57 kB). Dashboard chunk: 41.6 kB (9.9 kB gzip) — all features included |
| **Lazy Loading** | All pages loaded via `React.lazy()` + `Suspense` — only requested code loads (auth pages ~2-3 kB gzip each) |
| **Skeleton Loading** | `LoadingSpinner` with `page` prop renders full skeleton layout (pulse animation) instead of basic spinner |
| **Font Loading** | Google Fonts (Inter) loaded via `<link preload>` + `preconnect` — no render blocking |
| **Scroll Performance** | `will-change-transform` on animated elements, passive scroll listeners, `content-visibility` via framer-motion |
| **Animation Performance** | All animations handled by framer-motion (GPU-accelerated) — zero CSS `@keyframes` |
| **React.memo** | Dashboard sub-components wrapped with `React.memo` — prevent unnecessary re-renders |
| **CSS Size** | Minimal CSS — Tailwind v4 purges unused styles; only ~63 kB (10.5 kB gzip) |
| **Animated Counters** | Dashboard stat cards count up from 0 → value with cubic ease-out animation via requestAnimationFrame |
| **Mini Sparkline Charts** | Each stat card shows a 7-day completion trend as an inline SVG sparkline (no extra libraries) |
| **Trend Indicators** | Today's Tasks card shows ↑/↓ % change comparing first 3 vs last 3 days of weekly data |
| **Inline Task Editing** | Click task title → inline input appears; Enter/Blur saves, Escape cancels — no modal needed |
| **Bulk Actions** | Multi-select checkbox on Today's Tasks → "Complete N" button for batch operations |
| **Collapse Completed** | Toggle to show/hide completed tasks below remaining tasks with AnimatePresence |
| **Widget Customization** | Settings dropdown lets users toggle visibility of 7 dashboard sections, persisted to localStorage |
| **Date Range Filter** | "All Time" / "This Week" / "This Month" toggle filters all dashboard data by task deadline |
| **Error Resilience** | React ErrorBoundary wraps entire dashboard — one widget failure doesn't crash the page |
| **Onboarding Empty State** | First-time users see welcome card with "Create Task" and "Talk to AI" CTAs instead of empty stats |
| **AI Recommendation Caching** | sessionStorage caches AI responses for 5 minutes — no redundant API calls on tab switch |
| **Deadline Risk Pulse** | Overdue items get red glow shadow + animated progress bars for urgency attention |
| **Time-Grouped Activity** | Recent Activity grouped by "Today" / "Yesterday" / "This Week" with click-to-navigate |
| **Last Sync Timestamp** | Header shows "Last updated 30s ago" with auto-updating counter |
| **Auto-Refresh** | Dashboard auto-fetches tasks every 60s + on tab visibility change + manual refresh button — AI-created tasks appear instantly |
| **SEO** | Dynamic `<title>`, meta description, OG tags, Twitter cards via `react-helmet-async` on all pages (landing, auth, legal, error, dashboard) |

---

## 🔐 Authentication Flow

```
                        ┌─────────────────────┐
                        │  📝 SIGNUP           │
                        │                     │
                        │  name + email + pw  │
                        │  pw strength meter  │
                        │  inline validation  │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │  bcrypt.hash(pw,10) │
                        │  Save to MongoDB    │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │  jwt.sign({ id })   │
                        │  Expires: 30 days   │
                        └──────────┬──────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │  Response: { token, user }  │
                    │  (password excluded via     │
                    │   Mongoose toJSON transform) │
                    └──────────┬──────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
  ┌──────────────┐   ┌────────────────┐   ┌──────────────┐
  │  🔐 LOGIN    │   │  🔄 FORGOT PW  │   │  🚪 LOGOUT   │
  │              │   │                │   │              │
  │ email + pw   │   │ email → token  │   │ Clear token  │
  │ inline valid │   │  inline valid  │   │ from client  │
  │      ▼       │   │      ▼         │   │              │
  │ bcrypt.check │   │ send email     │   │              │
  │      ▼       │   │      ▼         │   │              │
  │ jwt.sign()   │   │ verify token   │   │              │
  │      ▼       │   │      ▼         │   │              │
  │ return token │   │ set new pw     │   │              │
  └──────────────┘   │ pw strength    │   └──────────────┘
                     │ meter + valid  │
                     └────────────────┘

                    ┌─────────────────────────────┐
                    │  🛡️ PROTECTED ROUTES        │
                    │                              │
                    │  Request → Authorization:    │
                    │  Bearer <token>              │
                    │         ↓                    │
                    │  jwt.verify(token)           │
                    │         ↓                    │
                    │  Pass or 401 Unauthorized    │
                    └──────────────────────────────┘
```

---

## 🆕 Recent Improvements

### Responsive Design Audit (8 Breakpoints)

Every page in FlowSync AI has been audited and hardened against **8 viewport widths** (320px, 375px, 425px, 768px, 1024px, 1280px, 1440px, 1920px+) using **Tailwind CSS v4 responsive utilities only** — zero custom CSS, zero inline pixel values.

| Fix | Screens Affected | Description |
|-----|-----------------|-------------|
| **Header Overflow Prevention** | 320px–425px | Added `truncate`, `min-w-0`, `flex-shrink-0`, and tighter `gap-1 sm:gap-2` to prevent icon/text overflow in the main header |
| **Sidebar Predictable Width** | All | Auth sidebar changed from `w-[40%]` to fixed `w-80 xl:w-96` for consistent layout |
| **Auth Card Padding** | 320px–425px | Form cards changed from `p-8` to `p-6 sm:p-8` — gains 16px+ of content width on small screens |
| **Notification Drawer Overflow** | 320px | Dropdown constrained with `max-w-[calc(100vw-24px)]` — no more off-screen overflow |
| **Habit Weekly Grid** | 320px–425px | 7-column grid uses responsive cell sizes (`w-5 h-5 sm:w-6 sm:h-6`), gaps (`gap-1 sm:gap-1.5`), smaller icons on mobile |
| **Forgot/Reset Password Cards** | 320px–425px | Responsive `p-6 sm:p-8` padding on success states and form containers |

All pages remain fully functional across every breakpoint with no overflow, no horizontal scroll, and no broken layouts.

### Dashboard Overhaul (Industry-Level)

The Dashboard received a complete rewrite with production-grade features:

| Feature | Description |
|---------|-------------|
| **Animated Counters** | Stat cards count up from 0 to final value using requestAnimationFrame with cubic ease-out — no external libraries |
| **Mini Sparkline Charts** | Each stat card shows a 7-day completion trend as inline SVG sparkline — zero dependencies |
| **Trend Indicators** | Today's Tasks card shows ↑/↓ % change comparing first 3 vs last 3 days of weekly data |
| **Inline Task Editing** | Click any task title → inline input appears; Enter or blur saves, Escape cancels — no modal required |
| **Bulk Select & Complete** | Multi-select checkboxes + "Complete N" batch action button for efficient task management |
| **Collapse Completed Tasks** | Toggle to show/hide completed tasks below remaining tasks with AnimatePresence transitions |
| **Quick Focus Button** | Play icon appears on hover over any task — one click navigates to Focus Mode with that task pre-selected |
| **AI Recommendation Caching** | sessionStorage stores AI responses for 5 minutes — avoids redundant API calls on tab switch |
| **Deadline Risk Pulse Animation** | Overdue items get a red glow shadow animation + animated progress bars for urgency attention |
| **Time-Grouped Activity** | Recent Activity grouped by Today / Yesterday / This Week — click any item to navigate to its page |
| **Widget Visibility Toggle** | Settings dropdown lets users show/hide 7 dashboard sections, persisted to localStorage |
| **Date Range Filter** | All Time / This Week / This Month toggle filters all dashboard data by task deadline |
| **ErrorBoundary Resilience** | React ErrorBoundary wraps the entire dashboard — one widget failure doesn't crash the whole page |
| **Onboarding Empty State** | New users see a welcome card with "Create Task" and "Talk to AI" CTAs instead of empty zeroes |
| **Auto-Refresh & Sync** | Dashboard auto-fetches tasks every 60s + on tab visibility change + manual refresh button |

### Accessibility Improvements

| Fix | Description |
|-----|-------------|
| **Skip-to-Content Link** | Hidden link visible on keyboard focus (Tab) — bypasses sidebar navigation, jumps directly to main content |
| **Focus Trap in Modals** | Modal component traps keyboard focus: Tab/Shift+Tab cycles through focusable elements, auto-focuses close button on open, Escape to close |
| **prefers-reduced-motion** | Entire app wrapped in `<MotionConfig reducedMotion="user">` — framer-motion automatically respects OS accessibility settings, disabling non-essential animations |
| **Screen Reader Support** | `aria-live` regions for dynamic content updates (toast notifications, loading states) |

### UX Quality Fixes

| Fix | Description |
|-----|-------------|
| **Native confirm() Replaced** | Calendar delete action now uses a styled framer-motion confirmation modal instead of the browser-native `confirm()` dialog, maintaining UX consistency |
| **Silent Error Handling** | 14+ API catch blocks across Dashboard, Analytics, Habits, FocusMode, Notifications, Profile, Settings, MainLayout now show proper `toast.error()` messages instead of silently swallowing failures |
| **FocusMode Loading State** | Shows a skeleton spinner during initial data fetch instead of misleading "No active tasks" message |
| **Polling Intervals Optimized** | Calendar: 10s → 30s, Analytics: 10s → 30s, FocusMode: 5s → 30s, UserStats: 2s → 30s — reducing network spam while maintaining responsiveness |
| **AI Planner Mobile Layout** | Fixed `calc(100vh)` overflow with negative margins on mobile — now uses proper viewport handling |
| **Undo Toast on Delete** | Delete actions show a toast with "Undo" button that restores the deleted item within 4 seconds |

### Task & Goal Management UX

| Feature | Description |
|---------|-------------|
| **Task Sorting** | New dropdown with 4 sort modes: Priority (high first), Deadline (nearest first), Title (A-Z), Newest first |
| **Goal Progress Slider** | Replaced rigid preset buttons (0/25/50/75/100) with a custom range slider (0-100, step 5) for precise progress tracking |
| **Notification Badge** | Sidebar Bell icon now shows a real-time unread count badge, auto-polling every 30 seconds |

---

## 📄 License & Usage

### Proprietary License — All Rights Reserved

**Copyright © 2024-2026 Shubham Dangi. All rights reserved.**

This software and its source code are the intellectual property of **Shubham Dangi**. It is **not** open-source software. A [`LICENSE`](./LICENSE) file is included in the repository.

| Right | Allowed? | Details |
|-------|----------|---------|
| View Code | ✅ Yes | Public on GitHub for portfolio/reference |
| Use Live App | ✅ Yes | You may use the hosted version at [flowsyncai30.vercel.app](https://flowsyncai30.vercel.app) |
| Copy / Download | ❌ No | Requires written permission from the author |
| Clone / Fork | ❌ No | Requires written permission from the author |
| Modify / Redistribute | ❌ No | Requires written permission from the author |
| Commercial Use | ❌ No | Requires a separate commercial license |

### How to Get Permission

If you want to use, copy, or reference any part of this code, simply contact me:

| Method | Contact |
|--------|---------|
| 📧 Email | [shubhamkumar997800@gmail.com](mailto:shubhamkumar997800@gmail.com) |
| 💼 LinkedIn | [Shubham Dangi](https://linkedin.com/in/shubham997800) |
| 🐙 GitHub | [Shubham-997800](https://github.com/Shubham-997800) |

I'm happy to discuss collaboration, licensing, or any other use — just ask.

> [!IMPORTANT]
> This repository is shared publicly for **portfolio and demonstration purposes only**. Viewing is free. Everything else requires my permission. Unauthorized copying, forking, or distribution will be considered a violation of intellectual property rights.

---

## 👤 Author

<p align="center">
  <img src="https://img.shields.io/badge/Author-Shubham_Dangi-6366F1?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://github.com/Shubham-997800">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://linkedin.com/in/shubham997800">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:shubhamkumar997800@gmail.com">
    <img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>

---

## 🙏 Acknowledgements

- **[OpenRouter](https://openrouter.ai)** — For the AI API gateway powering our engine (Llama 3.3 70B, GPT-4o-mini, Claude 3 Haiku, and more)
- **[Vercel](https://vercel.com)** — For frontend deployment platform
- **[Railway](https://railway.com)** — For reliable backend hosting with zero-downtime deploys
- **[MongoDB Atlas](https://mongodb.com/atlas)** — For the generous free tier and global database infrastructure
- **[Tailwind CSS](https://tailwindcss.com)** — For the most productive CSS framework ever built
- **[Lucide](https://lucide.dev)** — For the beautiful, consistent icon set

Inspired by the next generation of AI-first productivity tools that are redefining how humans interact with their work.

---

<p align="center">
  <b>FlowSync AI</b> — <i>Never Miss a Deadline Again</i><br>
  <a href="https://flowsyncai30.vercel.app">🌐 Live App</a>
  ·
  <a href="https://github.com/Shubham-997800/FlowSync-Ai/issues">🐛 Report Bug</a>
  ·
  <a href="https://github.com/Shubham-997800/FlowSync-Ai/issues">💡 Request Feature</a>
  ·
  <a href="https://github.com/Shubham-997800/FlowSync-Ai/stargazers">⭐ Star on GitHub</a>
</p>

<p align="center">
  <sub>© 2024-2026 Shubham Dangi. Proprietary software. All rights reserved.</sub>
</p>
