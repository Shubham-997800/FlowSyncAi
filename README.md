# FlowSync AI 🚀

AI-powered productivity suite to manage tasks, goals, habits, and focus time with intelligent planning.

## Features

- **AI Chat Planner** – Conversational AI that creates tasks from natural language (Gemini 2.0 Flash)
- **Task Manager** – Full CRUD with priorities, deadlines, status tracking
- **Goals & Habits** – Track long-term goals and daily habits with streak monitoring
- **Dashboard** – Productivity score, deadline risk, today's tasks overview
- **Calendar** – Visual task calendar with drag-and-drop
- **Focus Mode** – Pomodoro-style timer with task integration
- **Analytics** – Weekly/monthly charts, completion rates, AI reports
- **Profile** – Avatar upload, personal info, password management
- **Notifications** – Real-time notifications with bell popup

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend  | Node.js + Express + Mongoose |
| Database | MongoDB Atlas |
| Auth     | JWT (JSON Web Tokens) |
| AI       | Google Gemini 2.0 Flash |
| Hosting  | Railway (backend) + Vercel (frontend) |

## Live Demo

- **Frontend:** [flowsyncai30.vercel.app](https://flowsyncai30.vercel.app)
- **Backend API:** [flowsync-ai-production.up.railway.app](https://flowsync-ai-production.up.railway.app)

## Project Structure

```
FlowSync-AI/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── TaskManager/
│   │   │   ├── Calendar/
│   │   │   ├── Goals/
│   │   │   ├── Habits/
│   │   │   ├── Profile/
│   │   │   ├── Analytics/
│   │   │   ├── FocusMode/
│   │   │   ├── Notifications/
│   │   │   ├── Settings/
│   │   │   ├── AIPlanner/
│   │   │   └── Authentication/
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context (auth)
│   │   └── hooks/           # Custom hooks
│   └── ...
├── flowsync-backend/        # Node.js + Express backend
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── middleware/          # Auth middleware
│   ├── services/            # Business logic (AI, etc.)
│   └── server.js            # Entry point
└── ...
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string
- Google Gemini API key

### Setup

```bash
# Clone the repo
git clone https://github.com/Shubham-997800/FlowSync-Ai.git
cd FlowSync-Ai

# Backend
cd flowsync-backend
cp .env.example .env   # Fill in your MongoDB URI, JWT secret, Gemini key
npm install
npm run dev

# Frontend (new terminal)
cd client
cp .env.example .env   # Set VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

### Environment Variables

**Backend** (`flowsync-backend/.env`):
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**Frontend** (`client/.env`):
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/goals` | Get all goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |
| GET | `/api/habits` | Get all habits |
| POST | `/api/habits` | Create habit |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit |
| PUT | `/api/settings/profile` | Update profile |
| PUT | `/api/settings/avatar` | Upload profile picture |
| PUT | `/api/settings/password` | Change password |
| DELETE | `/api/settings/account` | Delete account |
| POST | `/api/ai/chat` | AI chat planner |

## Deployment

### Backend (Railway)
1. Push code to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Set environment variables in Railway dashboard
4. Railway auto-deploys on push to `main`

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Set `VITE_API_URL` environment variable
5. Vercel auto-deploys on push to `main`

## License

MIT
