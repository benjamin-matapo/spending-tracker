# Spending Tracker (Go + Next.js + Tailwind)

A production-ready spending tracker with a Go REST API backend and a Next.js (React) frontend styled with Tailwind and shadcn-style components. Mobile-first UI with a bottom navigation on mobile and a top bar on desktop. Charts powered by Recharts.

- Backend: Go (chi), in-memory storage, clean modular packages, handler unit tests
- Frontend: Next.js (App Router) + Tailwind + shadcn-style components + Recharts
- Deployment: Backend on Render (free tier), Frontend on Vercel


## Project Structure

```
spending-tracker/
├── backend/
│   ├── go.mod
│   ├── main.go
│   ├── internal/
│   │   ├── models/
│   │   │   ├── errors.go
│   │   │   └── transaction.go
│   │   ├── server/
│   │   │   ├── router.go
│   │   │   └── router_test.go
│   │   └── storage/
│   │       └── memory_store.go
│   └── render.yaml
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── next.config.js
    ├── next-env.d.ts
    ├── .env.example
    └── src/
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx (redirects to /add)
        │   ├── add/page.tsx
        │   ├── transactions/page.tsx
        │   └── summary/page.tsx
        ├── components/
        │   ├── navbar.tsx
        │   └── ui/ (button, input, select, card, label)
        └── lib/
            ├── api.ts
            └── utils.ts
```


## Local Development

### 1) Backend

Requirements: Go 1.22+

- Install dependencies and run:

```bash
# from repo root
cd backend

# (Optional) download deps
go mod download

# run server
go run main.go
```

- The API will start on http://localhost:8080
- Health check: GET http://localhost:8080/healthz
- Endpoints:
  - POST `/api/transactions` { amount, category, date (YYYY-MM-DD), description }
  - GET `/api/transactions`
  - GET `/api/transactions/category/{category}`
  - GET `/api/summary/category`

- Run unit tests:

```bash
# from repo root
cd backend
go test ./...
```

### 2) Frontend

Requirements: Node 18+ (Vercel/Next recommends 18+)

- Configure environment variables:

```bash
# from repo root
cd frontend
cp .env.example .env.local
# If your backend runs locally on port 8080, the default in .env.example is fine:
# NEXT_PUBLIC_API_BASE=http://localhost:8080
```

- Install deps and run dev server:

```bash
npm install
npm run dev
```

- Open http://localhost:3000
- Navigation:
  - Add Transaction (/add)
  - Transaction List (/transactions)
  - Spending Summary (/summary)


## Production Deployment

### A) Deploy Backend to Render (Free Tier)

Option 1 (Recommended): Create a Web Service from the `backend` directory in your Git repository.

1. Push this repository to GitHub/GitLab.
2. Go to https://dashboard.render.com and click "New +" → "Web Service".
3. Connect your repo and select the `backend/` directory as the root for the service.
4. Use these settings:
   - Environment: Go
   - Build Command: `go build -o server main.go`
   - Start Command: `./server`
   - Health Check Path: `/healthz`
   - Region/Plan: any Free region + Free plan
5. Create the service. Render will provision a public URL like `https://spending-tracker-backend.onrender.com`.

Option 2: Use the provided `backend/render.yaml` as a starting point for a Blueprint. If you prefer Blueprints, move `render.yaml` to the repo root and create via "New +" → "Blueprint" in Render. The current file is scoped for a single service and is also documentation for the settings above.

After deploy, note your public Backend URL.


### B) Deploy Frontend to Vercel

1. Push the repo to GitHub/GitLab if you haven't already.
2. Go to https://vercel.com → "New Project" and import the repo.
3. Select the `frontend` directory as the project root.
4. Framework Preset: Next.js (detected automatically).
5. Set Environment Variables:
   - `NEXT_PUBLIC_API_BASE` = your Render backend URL (e.g., `https://spending-tracker-backend.onrender.com`)
6. Click Deploy. Vercel will give you a production URL like `https://spending-tracker-frontend.vercel.app`.

No special `vercel.json` is required; Next.js defaults are fine.


## API Contract

- Add Transaction

```http
POST /api/transactions
Content-Type: application/json

{
  "amount": 12.34,
  "category": "Food",
  "date": "2024-01-10",
  "description": "Lunch"
}
```

- List all transactions

```http
GET /api/transactions
```

- List by category

```http
GET /api/transactions/category/Food
```

- Totals by category

```http
GET /api/summary/category
```


## Environment Variables

- Frontend (`frontend/.env.local`):
  - `NEXT_PUBLIC_API_BASE` — Base URL for backend API.
    - Local dev default: `http://localhost:8080`
    - Production (Vercel): Render backend URL

- Backend: none required. Server listens on `PORT` if provided by the platform, otherwise `8080` locally.


## Production-Quality Notes

- Clean Go packages: `models`, `storage`, and `server` for maintainability.
- In-memory store is concurrency-safe; consider swapping to a database later (Postgres) by implementing a new storage layer.
- CORS is open (`*`) for simplicity across dev and deploy targets. Restrict `AllowedOrigins` in `internal/server/router.go` for stricter security in production.
- Mobile-first UI with shadcn-like primitives and a bottom nav on small screens.
- Charts via Recharts for bar and pie summaries.


## Quick Start (TL;DR)

- Backend:
  - `cd backend && go run main.go` → http://localhost:8080
- Frontend:
  - `cd frontend && cp .env.example .env.local && npm install && npm run dev` → http://localhost:3000
- Deploy:
  - Render: Create Web Service from `backend/`, build `go build -o server main.go`, start `./server`
  - Vercel: Create project from `frontend/`, set `NEXT_PUBLIC_API_BASE` to the Render URL

If you want any enhancements (auth, categories CRUD, persistent DB, budgets, export CSV), let me know and I’ll extend this foundation.
