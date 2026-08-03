# FlowSync-Ai — End-to-End QA Report

**Date:** 2026-08-03 (updated after v3.3 round: frontend unit tests, backend lint + CI, DB indexes, compression, retry/backoff, mark-all-read)
**Scope:** Live HTTP tests against the real Vercel entrypoint (`api/index.js`), real MongoDB (in-memory 6.0.9 via `mongodb-memory-server`), frontend unit tests (Vitest + Testing Library), frontend lint + production build, plus route/auth/security/DB/perf audit.
**Harness:** `flowsync-backend/test/run-tests.js` — **120** tests booting `api/index.js` (same handler Vercel runs) + real Mongo. Frontend: **30** Vitest unit tests.
**Result:** **120 PASSED / 0 FAILED / 120 TOTAL** (backend) · **30/30** (frontend) · backend + frontend lint clean · frontend build succeeds · CI: GitHub Actions on **Node 24** (backend lint + tests, frontend lint + tests + build) — all green

---

## Scores (0–100)

| Dimension | Before | After | Justification |
|---|---|---|---|
| **Overall Health** | 95 | **96** | v3.3 round added frontend tests, backend lint, DB indexes, compression, CORS allowlist, retry/backoff, mark-all-read; live deploy still needs user-side Vercel redeploy |
| Frontend | 96 | **97** | 30 unit tests; a11y fixes (timer label/aria) surfaced by tests |
| Backend | 97 | **97** | mark-all-read endpoint + DB indexes added |
| Database | 94 | **95** | Missing indexes on goals/habits added; existing indexes confirmed |
| API | 98 | **98** | 120/120 pass; mark-all-read endpoint added |
| Security | 95 | **95** | CORS allowlist tightened; POST retries excluded from client retry loop |
| Performance | 86 | **88** | gzip compression + client retry/backoff; remaining: DB read-tier / query tuning |
| Architecture | 92 | **93** | CI covers backend lint + frontend tests too |
| **Production-Readiness** | 88 | **89** | CI stronger + compression; live deploy verification still blocked on Vercel dashboard |

---

## 🔧 Code Cleanup (what was removed)

| Item | Type | Reason | Impact |
|---|---|---|---|
| `flowsync-backend/seed.js` | Dead script | No imports, no npm script, not referenced anywhere | −239 lines |
| `flowsync-backend/qa-seed.js` | Dead script | No imports, no npm script, hardcoded prod URL | −244 lines |
| `client/src/assets/hero.png` | Unused asset | Zero imports (never bundled by Vite) | −binary |
| `client/src/assets/react.svg` | Template leftover | Zero imports | −binary |
| `client/src/assets/vite.svg` | Template leftover | Zero imports | −binary |
| `client/README.md` | Stale template | Stock Vite README replaced with project-specific | rewritten |
| `/favicon.ico` refs | Broken link | Only `favicon.svg` exists — fixed in push hook + `sw.js` | 2 files |
| `VAPID_SUBJECT` | Dead env var | Defined in `.env.example` but never read — now wired into `pushController.js` | wired |

**Net: ~599 lines of dead code deleted. Harness now 119/119, lint clean, build succeeds.**

---

## Critical

| # | Finding | Status |
|---|---|---|
| C1 | NoSQL operator injection (`{"email":{"$gt":""}}`) in login → 500 + leaked bcrypt error | **FIXED** — type-guarded → 401 generic (`authController.js:33-36`) |
| C2 | Weak new password change → 500 + leaked validator message | **FIXED** — `handleValidationError` → 400 (`settingsController.js`) |
| C3 | Account delete orphaned ChatMessage/PushSubscription/AiUsage | **FIXED** — full cascade delete |
| C4 | AI quota incremented before AI call — failed calls burned quota | **FIXED** — `canUseAi` (check) + `recordAiUsage` (increment on success) |
| C5 | No `GET /tasks/:id` route exists | **FIXED** — user-scoped `getTask` + route added |
| C6 | **Live Vercel returned 500 `FUNCTION_INVOCATION_FAILED`** — module-load crash when VAPID env keys invalid | **FIXED** — `webpush.setVapidDetails()` wrapped in try/catch; push auto-disables with console error, API boots normally |

---

## Backend

| # | Finding | Status |
|---|---|---|
| B1 | Mass assignment blocked — whitelisted fields via `sanitize()` | PASS |
| B2 | Passwords bcrypt-hashed; `toJSON` strips hash from all responses | PASS |
| B3 | Rate limiting + 15-min lockout after 5 failures (423) | PASS |
| B4 | `validateObjectId` returns 400 for malformed IDs | PASS |
| B5 | `.env.example` created; `JWT_SECRET` required | PASS |
| B6 | `handleError`/500 middleware no longer leak raw `error.message` | PASS (`utils/errorHandler.js`, `app.js`) |
| B7 | Reminder sweep atomic `findOneAndUpdate` claim; dedup verified | PASS |
| B8 | No request logging / observability / correlation IDs | **FIXED** — `requestId` middleware validates `x-request-id` (`/^[\w.-]{1,64}$/`) else `randomUUID()` |
| B9 | Regex injection in reminder sweep — a title with an invalid regex pattern could kill the whole sweep | **FIXED** — `escapeRegex()` on user-controlled title (`reminderService.js`) |
| B10 | AI `prioritize` updated tasks by `_id` only — cross-user write possible | **FIXED** — scoped `Task.updateOne({ _id, user })` + `isValidObjectId` guard |
| B11 | Push subscribe not scoped to user — could hijack another user's endpoint | **FIXED** — upsert on `{ endpoint, user }`, duplicate 11000 → 400 |
| B12 | `updateProfile` could 500 on non-string / duplicate email | **FIXED** — type + length guards, 11000 → 400, CastError → 400 |
| B13 | `connectDB()` not awaited on boot — server could listen before DB ready | **FIXED** — `start()` awaits DB, FATAL + `process.exit(1)` on failure |
| B14 | VAPID module-load crash on live Vercel | **FIXED** — try/catch around `setVapidDetails` |

---

## Frontend

| # | Finding | Status |
|---|---|---|
| F1 | `npm run lint` — clean (0 errors) | PASS |
| F2 | `npm run build` — succeeds in ~700 ms | PASS |
| F3 | `Settings.js` chunk 428 kB (limit 300 kB) — needs code-splitting | Warning |
| F4 | `Achievements.check: () => false` — dead feature | **FIXED** — real milestone checks on `{tasks, goals, habits}`; `7_day_streak` from habit streaks |
| F5 | AI settings are not persisted | **FIXED** — backend `User.aiSettings` subdocument + `GET/PUT /api/settings/ai`; `AISettings.jsx` loads + autosaves |
| F6 | Timer/StrictMode side effects inside setState updaters; TodayTasks edit toggles status | **FIXED** — completion moved to effect with `setTimeout(0)` guard; TodayTasks `onEdit` opens/saves instead of toggling |
| F7 | AI self-help fallback unreachable when AI key absent | Gap (low priority) |
| F8 | UserStats best-streak always 0 — read never-written localStorage key | **FIXED** — fetches real habit streaks via `getHabits()` |
| F9 | FocusMode hardcoded 25/5 durations | **FIXED** — reads `flowsync_timer_settings` + AI focus time |

---

## Database

| # | Finding | Status |
|---|---|---|
| DB1 | Task indexes: `user+createdAt`, `user+status+deadline` | PASS |
| DB2 | Mongo connection cached for serverless warm starts | PASS |
| DB3 | Notifications TTL index (auto-clean >90 days) | PASS (`models/Notification.js`) |
| DB4 | UTC-vs-local date-slicing bugs | **FIXED** — `utils/dateKey.js` (`localDateKey`) applied to AI quota, habit check-in/streak, analytics daily labels; monthly buckets now `Math.ceil(days/7)` (no more dropped week) |
| DB5 | ReminderState atomic claim pattern | PASS |

---

## API

| # | Finding | Status |
|---|---|---|
| A1 | Auth: signup (dup → 400, non-string → 400), login (type-guarded), token expiry/tamper → 401 | PASS |
| A2 | CRUD tasks/goals/habits + validation (goal progress clamped, weak password → 400) | PASS |
| A3 | Habit check-in `POST /api/habits/:id/checkin` | PASS |
| A4 | Chat: create/list/sessions/delete/clear; capped sessions | PASS |
| A5 | Notifications list/mark-read; **no DELETE route** | **FIXED** — `DELETE /api/notifications/:id` added + tested |
| A6 | 413 request-body limit enforced | PASS |
| A7 | CORS fixed allowlist — does not reflect foreign origins | PASS |
| A8 | Pagination `?page`/`?limit` + `X-Total-Count` on tasks/goals/habits/notifications/chat | PASS (backward compatible) |
| A9 | No `GET /tasks/:id` | **FIXED** — `GET /api/tasks/:id` (user-scoped, 400/404 handled) |
| A10 | AI settings — no persistence API | **FIXED** — `GET/PUT /api/settings/ai` (whitelist, `toObject()` serialization, invalid value → 400) |

---

## Performance

| # | Finding | Status |
|---|---|---|
| P1 | Mongo connection cached — good serverless startup | PASS |
| P2 | Lazy interval-gated reminder sweep (no cron cost) | PASS |
| P3 | Lists paginated on request (`limit` max 500, total-count header) | PASS |
| P4 | Default list response still unbounded (client relies on full lists) | Gap |
| P5 | `html2canvas` + `motion` + `Settings.js` add ~700 kB | Gap |
| P6 | 200-task bulk create/list round-trip well under 500 ms | PASS |

---

## Security

| # | Finding | Status |
|---|---|---|
| S1 | Password hash never returned by API (verified live) | PASS |
| S2 | Login lockout (423) + rate limits verified live | PASS |
| S3 | NoSQL operator injection → closed with type guards | PASS |
| S4 | No internal error text leaked on 500 | PASS |
| S5 | Helmet security headers present (CSP, HSTS, nosniff, referrer-policy) | PASS |
| S6 | User `name` stored unsanitized → stored-XSS vector (client sanitizes on render) | Gap — validated live (backend finding, not a crash) |
| S7 | JWT lifetime 30 days — long (needs refresh mechanism to shorten) | Gap |
| S8 | Regex injection in reminder sweep | **FIXED** — `escapeRegex()` |
| S9 | Cross-user task write via AI prioritize | **FIXED** — user-scoped update |
| S10 | Push subscription hijack (subscribe to another user's endpoint) | **FIXED** — user-scoped upsert + 11000 → 400 |
| S11 | Invalid VAPID env crash at module load (Vercel 500) | **FIXED** — crash-proof module init |

---

## UI / UX

| # | Finding | Status |
|---|---|---|
| U1 | Production build ships valid assets; routes resolve | PASS |
| U2 | Achievements UI rendered but backend check is a no-op | **FIXED** — real checks |
| U3 | AI settings not persisted | **FIXED** — autosave on change |
| U4 | Focus timer setTimeout state updaters (StrictMode double-invoke) | **FIXED** — effect-based completion |
| U5 | TodayTasks "edit" toggled task status instead of opening editor | **FIXED** — `onEdit` + optimistic save |
| U6 | Best-streak shown as 0 | **FIXED** — real habit data |

---

## Missing Validation / Error Handling

| # | Issue | Status |
|---|---|---|
| V1 | Login email/password arbitrary-object (NoSQL) vector | **FIXED** — string type guard → 401/400 |
| V2 | `updatePassword` `ValidationError` → 500 | **FIXED** — `handleValidationError` → 400 |
| V3 | `updateProfile` non-string/duplicate → 500 | **FIXED** — guarded → 400 |
| E1 | Global 500 handler returned raw `error.message` | **FIXED** — generic `Server error` on 5xx |
| E2 | `handleValidationError` not wired everywhere | Mostly wired (task/goal/habit/notification/create + settings); audit remaining controllers |
| E3 | AI provider failures mapped to 503 + graceful fallback | PASS |

---

## Failed Tests

**0 failed — 120 passed.**

## Passed Tests (120) — coverage summary

Health/ping, X-Request-ID, helmet headers, CORS allowlist + non-reflection, 404s · Auth: signup, duplicate/non-string → 400, no hash leak, login, wrong/ghost password → 401, NoSQL injection → 4xx, wrong content-type, lockout 423 + reset, expired/tampered/garbage token → 401 · Tasks: CRUD, validation 400s, filters, status transitions, due-today, **GET by id (200/400/404)**, cross-user isolation · Goals: CRUD, progress clamp · Habits: CRUD, check-in, streak, same-day dedupe · Notifications: create/list/mark-read, **DELETE**, dedup, cross-user isolation · Push: subscribe/unsubscribe, missing keys → 400, ownership · Chat: create/sessions/history/delete/clear, session cap, isolation · Settings: profile update, weak-password → 400, password change invalidates old, account delete cascade (incl. Chat/Push/AiUsage), **AI settings default/persist/invalid → 400** · AI: usage, quota check, no-prompt → 400, graceful 5xx without key, auth required · Analytics · Pagination (`?limit&page` + `X-Total-Count`) · Rate-limit 429 · Reminder atomic claim + no duplicate notifications.

---

## Recommendations (remaining)

1. Default-paginate lists and update the client to page (calendar/analytics currently fetch everything).
2. Reduce JWT to 7 days with a refresh token; keep refresh out of localStorage.
3. Sanitize `name`/text on the API (strip `<script>`), not only client-side.
4. Code-split `Settings.js`; lazy-load `html2canvas`.
5. Wire `handleValidationError` in every remaining catch; add request logging + health/monitoring.
6. Add CI: run harness + `client` lint/build on push; commit harness, add `npm test`, move `mongodb-memory-server` to devDependencies.
7. Remove unreachable AI self-help fallback (last remaining dead branch).
8. Add refresh-token rotation + server-side logout.

---

## Action Plan

| Priority | Item | Status |
|---|---|---|
| **P1** | Login NoSQL injection → 4xx + generic message | ✅ Done |
| **P1** | Weak-password change → 400 (no leak) | ✅ Done |
| **P1** | Stop leaking `error.message` on 500 | ✅ Done |
| **P1** | Live Vercel 500 `FUNCTION_INVOCATION_FAILED` (VAPID crash) | ✅ Done |
| **P2** | AI quota counts only successful calls | ✅ Done |
| **P2** | Cascade delete Chat/Push/AiUsage | ✅ Done |
| **P2** | Pagination + total count on list endpoints | ✅ Done |
| **P2** | Notifications TTL index | ✅ Done |
| **P2** | UTC/local date normalization (quota/habits/analytics) | ✅ Done |
| **P2** | Regex injection + cross-user write + push hijack closed | ✅ Done |
| **P2** | AI settings persisted (backend + frontend) | ✅ Done |
| **P3** | `GET /tasks/:id` + notification DELETE | ✅ Done |
| **P3** | Achievements real checks; Timer StrictMode; TodayTasks edit; best-streak | ✅ Done |
| **P3** | JWT 7-day + refresh; API-side input sanitization | Open |
| **P4** | CI pipeline + committed tests + logging/monitoring | Open |

---

*Committed on `main`: v3.3 round — backend harness **120/120**, frontend **30/30** Vitest, backend + frontend lint clean, build succeeds, CI covers lint + tests + build on **Node 24** (fixed after GitHub deprecated Node 20 runners and jsdom 30 required ≥22) — all jobs green. Harness: `flowsync-backend/test/run-tests.js` (120 tests) + `client` Vitest (30 tests).*
