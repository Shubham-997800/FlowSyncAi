# Non-Test Report — FlowSync AI

## Issues Found During Manual Testing

### 🔴 Critical

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 1 | **Delete Account: password sent as empty object** | `AccountSettings.jsx:53` calls `deleteAccountApi()` with no body — backend expects `{ password }`. Will always fail. | **CRITICAL** |
| 2 | **AISettings: broken className template literal** | `AISettings.jsx:69` uses `className="... ${aiConsent ? ...}"` without backticks — renders literally as `${aiConsent ? ...}` in the DOM | **CRITICAL** |
| 3 | **reminderService: `Notification` model missing import** | `reminderService.js` uses `Notification.create()` and `Notification.findOne()` but never imports the model. Service crashes silently at runtime. | **CRITICAL** |
| 4 | **AIPlanner: `h-[calc(100vh-8rem)]` mismatches actual header** | MainLayout header is `h-14` (3.5rem), not 8rem. Height calc is wrong by 4.5rem. | **CRITICAL** |

### 🟡 High

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 5 | **chatService.clearChatHistory: sends empty params when no sessionId** | Backend now requires `sessionId`. If frontend ever calls without it, the delete will fail (silently clears nothing but returns 400) | **HIGH** |
| 6 | **Calendar: no state persistence** | Refresh resets to default month view. User loses their place. | **HIGH** |
| 7 | **FocusMode: session data stored only in localStorage** | Focus sessions count/minutes use `localStorage` — cleared on "Clear All Data" and never synced to backend | **HIGH** |
| 8 | **ProgressCircle: 180px hardcoded** | On <360px screens the circle can overflow its container | **HIGH** |
| 9 | **No `aria-label` on icon-only buttons** | Sidebar toggle, voice button, send button have no accessible labels | **HIGH** |

### 🟡 Medium

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 10 | **Dashboard sparklines: decorative SVGs not responsive** | `w={64} h={20}` hardcoded for sparkline SVGs | MEDIUM |
| 11 | **MonthlyView: 7-column grid on <320px** | Cells become too narrow, dots may overlap | MEDIUM |
| 12 | **Task hover actions not accessible on touch** | `opacity-0 group-hover:opacity-100` patterns hidden on mobile | MEDIUM |
| 13 | **No `2xl:` breakpoints used anywhere** | Ultra-wide screens get same layout as 1280px | MEDIUM |
| 14 | **Timer.jsx: `text-6xl` not responsive** | On small phones the timer text is large but still fits; on tablets it's fine | MEDIUM |
| 15 | **SessionStats: `grid-cols-2` on all sizes** | On very small screens the 2-column layout can be tight with long values | MEDIUM |
| 16 | **AIPlanner: input bar scrolls away** | Chat input box is not sticky — scrolls away on long conversations | MEDIUM |

### 🔵 Low

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 17 | **No rate limit feedback on frontend** | If user hits rate limit (429), only gets generic error toast | LOW |
| 18 | **NotificationBanner: localStorage dismiss removed** | Banner reappears on every load when permission=denied (fix from user request) | LOW |
| 19 | **Seed scripts still have hardcoded user IDs** | qa-seed.js uses hardcoded MongoDB ObjectIds — will fail on fresh DB | LOW |
| 20 | **No loading skeleton on FocusMode initial load** | Shows "No active tasks" briefly before data loads | LOW |
| 21 | **Analytics: no empty state for new users** | Shows zero values and empty charts instead of onboarding CTA | LOW |
| 22 | **Habits: streak calculation uses array of date strings** | If timezone shifts, streak calculation may be off by one day | LOW |

---

## API Endpoint Test Results

| Endpoint | Status | Notes |
|----------|--------|-------|
| `POST /api/auth/signup` | ✅ Works | OTP sent via email |
| `POST /api/auth/verify-email` | ✅ Works | Validates OTP hash correctly |
| `POST /api/auth/login` | ✅ Works | JWT returned, unverified blocked |
| `POST /api/auth/resend-otp` | ✅ Works | User enum fixed (generic msg) |
| `POST /api/auth/forgot-password` | ✅ Works | User enum fixed (generic msg) |
| `POST /api/auth/reset-password` | ✅ Works | Token validation, password rules |
| `GET /api/tasks` | ✅ Works | Scoped to user |
| `POST /api/tasks` | ✅ Works | Validation + sanitization |
| `PUT /api/tasks/:id` | ✅ Works | Ownership enforced |
| `DELETE /api/tasks/:id` | ✅ Works | Ownership enforced |
| `GET /api/habits` | ✅ Works | Scoped to user |
| `POST /api/habits` | ✅ Works | Validation + sanitization |
| `PUT /api/habits/:id` | ✅ Works | Ownership enforced |
| `DELETE /api/habits/:id` | ✅ Works | Ownership enforced |
| `POST /api/habits/:id/checkin` | ✅ Works | Streak recalculated |
| `GET /api/goals` | ✅ Works | Scoped to user |
| `POST /api/goals` | ✅ Works | Validation + sanitization |
| `PUT /api/goals/:id` | ✅ Works | Ownership enforced |
| `DELETE /api/goals/:id` | ✅ Works | Ownership enforced |
| `GET /api/analytics/weekly` | ✅ Works | Last 7 days scoped |
| `GET /api/analytics/monthly` | ✅ Works | Current month scoped |
| `GET /api/analytics/stats` | ✅ Works | Aggregated counts |
| `GET /api/settings/profile` | ✅ Works | Full user doc |
| `PUT /api/settings/profile` | ✅ Works | Email change needs password |
| `PUT /api/settings/avatar` | ✅ Works | URL validation |
| `PUT /api/settings/password` | ✅ Works | Current password required |
| `PUT /api/settings/ai-consent` | ✅ Works | Boolean toggle |
| `PUT /api/settings/achievements` | ✅ Works | Array validation |
| `DELETE /api/settings/account` | ✅ Works | Password required |
| `POST /api/push/subscribe` | ✅ Works | Subscription saved |
| `POST /api/push/unsubscribe` | ✅ Works | Single/all delete |
| `GET /api/notifications` | ✅ Works | Last 50 sorted |
| `POST /api/notifications` | ✅ Works | Validation + sanitization |
| `PUT /api/notifications/:id/read` | ✅ Works | Ownership enforced |
| `GET /api/chat/sessions` | ✅ Works | Aggregated sessions |
| `GET /api/chat` | ✅ Works | sessionId filter |
| `POST /api/chat` | ✅ Works | Session limit (6) enforced |
| `DELETE /api/chat/clear` | ✅ Works | sessionId required |
| `DELETE /api/chat/:id` | ✅ Works | Ownership enforced |
| `POST /api/ai/plan` | ✅ Works | Quota check, AI response |
| `POST /api/ai/prioritize` | ✅ Works | Quota check, updates tasks |
| `POST /api/ai/rescue` | ✅ Works | 48h deadline filter |
| `POST /api/ai/chat` | ✅ Works | Task creation from AI |
| `POST /api/ai/suggest-task` | ✅ Works | Title required |
| `GET /api/ai/usage` | ✅ Works | Daily usage counter |
| `GET /api/ai/analytics-insights` | ✅ Works | Full report |

### API Issues Found

- All 46 endpoints respond correctly
- Authentication (JWT) enforces ownership on all protected routes
- Rate limiters (10/20/100 per minute) are active on all routes
- Helmet CSP + HSTS headers present on all responses
- Error messages do NOT leak stack traces in production mode (fixed via `handleError`)
