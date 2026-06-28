<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <br/>
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

<br/>

<div align="center">
  <h1>🚀 FlowSync AI</h1>
  <p><strong>AI-Powered Productivity Suite</strong></p>
  <p>Manage tasks, goals, habits, and focus time with intelligent planning powered by Google Gemini AI.</p>
  
  <p>
    <a href="https://flowsyncai30.vercel.app" target="_blank">🌐 Live Demo</a> •
    <a href="https://flowsync-ai-production.up.railway.app" target="_blank">⚡ API Status</a> •
    <a href="#-features">📋 Features</a> •
    <a href="#-local-development">🛠️ Setup</a>
  </p>
</div>

<br/>

---

## ✨ Features

<table>
  <tr>
    <td width="50%" align="center">
      <h3>🤖 AI Chat Planner</h3>
      <p>Conversational AI assistant that creates tasks from natural language. Powered by <strong>Gemini 2.0 Flash</strong>.</p>
      <p><em>"Schedule a meeting for tomorrow at 3pm" → Task created automatically</em></p>
    </td>
    <td width="50%" align="center">
      <h3>📋 Smart Task Manager</h3>
      <p>Full CRUD with priorities (high/medium/low), deadlines, status tracking (todo/in-progress/done), and AI risk scoring.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <h3>🎯 Goals & Habits</h3>
      <p>Track long-term goals with progress bars. Build daily/weekly habits with streak monitoring and visual calendar.</p>
    </td>
    <td width="50%" align="center">
      <h3>📊 Analytics Dashboard</h3>
      <p>Productivity score with animated ring chart, weekly trends, deadline risk assessment, and AI-generated reports.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <h3>⏱️ Focus Mode</h3>
      <p>Pomodoro-style timer with task integration. Track focus sessions and minutes.</p>
    </td>
    <td width="50%" align="center">
      <h3>📅 Calendar</h3>
      <p>Visual task calendar with deadline overview and drag-and-drop scheduling.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <h3>👤 User Profile</h3>
      <p>Avatar upload (persistent), personal info (bio, location, job title), password management.</p>
    </td>
    <td width="50%" align="center">
      <h3>🔔 Notifications</h3>
      <p>Real-time notification bell with popup drawer, deadline alerts, and achievement badges.</p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   🌐 Vercel                         │
│              React + Vite + Tailwind                │
│           flowsyncai30.vercel.app                   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / JSON
                       │ JWT Auth
┌──────────────────────▼──────────────────────────────┐
│                   ⚡ Railway                         │
│           Node.js + Express + Mongoose              │
│     flowsync-ai-production.up.railway.app           │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                  🗄️ MongoDB Atlas                    │
│            Users | Tasks | Goals | Habits           │
└─────────────────────────────────────────────────────┘
```

## 📂 Project Structure

```
flowsync-ai/
├── 📁 client/                       # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/           # Reusable UI (Navbar, Sidebar, StatCard, etc.)
│   │   ├── 📁 pages/
│   │   │   ├── 📁 Dashboard/        # Cards, Charts, Risk Analysis
│   │   │   ├── 📁 TaskManager/      # Full task CRUD
│   │   │   ├── 📁 Calendar/         # Task calendar view
│   │   │   ├── 📁 Goals/            # Goal tracking
│   │   │   ├── 📁 Habits/           # Habit streaks
│   │   │   ├── 📁 Profile/          # Avatar, Info, Password
│   │   │   ├── 📁 Analytics/        # Charts & Reports
│   │   │   ├── 📁 FocusMode/        # Pomodoro timer
│   │   │   ├── 📁 Notifications/    # Notification center
│   │   │   ├── 📁 Settings/         # Account & preferences
│   │   │   ├── 📁 AIPlanner/        # AI Chat Assistant
│   │   │   └── 📁 Authentication/   # Login, Register, Forgot Password
│   │   ├── 📁 services/             # API layer (axios)
│   │   ├── 📁 context/              # AuthContext (React Context + useReducer)
│   │   └── 📁 hooks/                # Custom hooks
│   ├── ⚡ vercel.json
│   └── 📦 package.json
│
├── 📁 flowsync-backend/             # Express Backend
│   ├── 📁 controllers/              # Route handlers
│   ├── 📁 models/                   # Mongoose schemas
│   ├── 📁 routes/                   # Express routers
│   ├── 📁 middleware/               # Auth middleware (JWT)
│   ├── 📁 services/                 # AI service (Gemini)
│   ├── 📁 config/                   # Database connection
│   ├── 🚀 server.js                 # Entry point
│   └── 📦 package.json
│
├── 📄 README.md
└── 📄 .gitignore
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 8 | UI framework & build tool |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Icons** | Lucide React | Icon library |
| **Routing** | React Router 7 | Client-side routing |
| **Charts** | Recharts | Analytics visualizations |
| **Notifications** | React Hot Toast | Toast notifications |
| **Backend** | Node.js + Express 5 | REST API server |
| **Database** | MongoDB + Mongoose 9 | NoSQL database & ODM |
| **Auth** | JWT + bcryptjs | Token-based auth |
| **AI** | Google Gemini 2.0 Flash | AI chat & task planning |
| **Hosting** | Railway (backend) | Auto-deploy from GitHub |
| **Hosting** | Vercel (frontend) | Auto-deploy from GitHub |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Shubham-997800/FlowSync-Ai.git
cd flowsync-ai

# Install backend
cd flowsync-backend
npm install

# Install frontend
cd ../client
npm install
```

### 2️⃣ Environment Variables

**Backend** — `flowsync-backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/flowsync
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**Frontend** — `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3️⃣ Run

```bash
# Terminal 1 — Backend
cd flowsync-backend
npm run dev   # → http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev   # → http://localhost:5173
```

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Sign in |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List all tasks |
| `POST` | `/api/tasks` | Create task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/goals` | List all goals |
| `POST` | `/api/goals` | Create goal |
| `PUT` | `/api/goals/:id` | Update goal |
| `DELETE` | `/api/goals/:id` | Delete goal |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/habits` | List all habits |
| `POST` | `/api/habits` | Create habit |
| `PUT` | `/api/habits/:id` | Update habit |
| `DELETE` | `/api/habits/:id` | Delete habit |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings/profile` | Get profile |
| `PUT` | `/api/settings/profile` | Update profile |
| `PUT` | `/api/settings/avatar` | Upload photo |
| `PUT` | `/api/settings/password` | Change password |
| `DELETE` | `/api/settings/account` | Delete account |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | AI chat & task creation |
| `POST` | `/api/ai/plan` | Get task plan |
| `POST` | `/api/ai/prioritize` | AI task prioritization |

## 🌍 Deployment

### Backend → Railway
1. Push code to GitHub
2. Create new project on [Railway](https://railway.app)
3. Connect GitHub repo → Railway auto-deploys on push
4. Add environment variables in Railway dashboard

### Frontend → Vercel
1. Push code to GitHub
2. Create new project on [Vercel](https://vercel.com)
3. Import GitHub repo → **Root Directory:** `client`
4. Add env var: `VITE_API_URL` = your Railway URL
5. Vercel auto-deploys on push to `main`

## 📸 Screenshots

| Dashboard | Task Manager |
|-----------|-------------|
| Productivity score, today's tasks, risk analysis | Full CRUD with priorities & deadlines |
| AI Chat | Analytics |
| Conversational task creation | Charts, trends, AI reports |

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Shubham-997800">Shubham Dangi</a></p>
  <p>
    <a href="https://github.com/Shubham-997800/FlowSync-Ai/issues">🐛 Report Bug</a> •
    <a href="https://github.com/Shubham-997800/FlowSync-Ai/issues">✨ Request Feature</a>
  </p>
</div>
