# FlowSync AI — Client

React 19 + Vite 8 + Tailwind 4 frontend for [FlowSync AI](https://flowsyncai30.vercel.app).

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run build
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint check |

API calls go through `src/services/api.js` (axios + JWT interceptor). In development the Vite proxy forwards `/api` to the local backend; in production it points at the deployed backend.

See the repository root [`README.md`](../README.md) for architecture, features, and deployment.
