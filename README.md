# AI Resume Analyzer SaaS

A production-grade, full-stack AI Resume Analyzer platform with a premium, cinematic UI and modular backend architecture.

## Product Highlights

- Unique premium SaaS interface (asymmetric layouts, layered depth, animated grid, restrained motion)
- Full authentication with JWT and protected API routes
- Resume upload and parsing for PDF/DOCX
- AI-assisted ATS analysis, missing keyword detection, role matching, suggestions, and skill gap insights
- Dashboard analytics with trend chart, activity timeline, quick actions, command palette, and expandable AI panels
- Resume comparison workflow
- Export analysis as PDF
- AI chat assistant for iterative resume improvement
- Recruiter mode insight endpoint for shortlist confidence

## Tech Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- React Query

### Backend

- FastAPI (async)
- PostgreSQL
- SQLAlchemy 2.x
- Alembic
- JWT authentication

### AI

- OpenAI API integration (with fallback behavior when key is missing)

### Deployment

- Docker + docker-compose
- Nginx reverse proxy
- GitHub Actions CI workflow
- Frontend ready for Vercel deployment
- Backend ready for Render/AWS deployment

## Monorepo Structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── deps.py
│   │   │   │   ├── router.py
│   │   │   │   └── routes/
│   │   │   │       ├── analysis.py
│   │   │   │       ├── auth.py
│   │   │   │       ├── chat.py
│   │   │   │       ├── dashboard.py
│   │   │   │       ├── profile.py
│   │   │   │       └── resumes.py
│   │   │   ├── core/
│   │   │   ├── db/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── main.py
│   │   ├── alembic/
│   │   │   └── versions/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── .env.example
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── lib/
│       │   └── store/
│       ├── Dockerfile
│       └── .env.example
├── docker/
│   └── nginx.conf
└── docker-compose.yml
```

## Database Schema

Main tables:

1. users
2. resumes
3. analysis_results
4. subscriptions
5. activity_logs

Implemented through SQLAlchemy models and Alembic migration:

- `apps/api/app/models/*.py`
- `apps/api/alembic/versions/20260531_0001_initial.py`

## API Endpoints

Base: `/api/v1`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Resumes

- `POST /resumes/upload`
- `GET /resumes`
- `POST /resumes/compare`

### Analysis

- `POST /analysis`
- `GET /analysis/{resume_id}`
- `GET /analysis/{analysis_id}/recruiter`
- `GET /analysis/{resume_id}/export`

### Dashboard

- `GET /dashboard/overview`

### Profile

- `GET /profile`
- `PATCH /profile`

### AI Chat

- `POST /chat`

## Environment Variables

### Backend (`apps/api/.env`)

Use `apps/api/.env.example`:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- `JWT_EXPIRE_MINUTES`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CORS_ORIGINS`
- `RATE_LIMIT_PER_MINUTE`
- `MAX_UPLOAD_SIZE_MB`

### Frontend (`apps/web/.env.local`)

Use `apps/web/.env.example`:

- `NEXT_PUBLIC_API_URL`

## Local Development

### Option 1: Docker Compose

```bash
docker compose up --build
```

Services:

- Web: http://localhost:3000
- API: http://localhost:8000
- Nginx entrypoint: http://localhost:80
- Postgres: localhost:5432

### Option 2: Run Services Manually

Backend:

```bash
cd apps/api
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

## Deployment Guide

### Frontend (Vercel)

1. Import `apps/web` project in Vercel.
2. Set `NEXT_PUBLIC_API_URL` to your backend URL.
3. Build command: `npm run build`.
4. Output is handled by Next.js.

### Backend (Render/AWS)

1. Deploy `apps/api` as a Docker service.
2. Set environment variables from `.env.example`.
3. Ensure managed PostgreSQL is available.
4. Run startup command in container:
   - `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Nginx

- Reverse proxy config at `docker/nginx.conf`.
- Proxies `/api/*` to FastAPI and `/` to Next.js.

## Architecture Notes

- Clean backend boundaries: routes -> schemas -> services -> models/utils
- Async SQLAlchemy sessions for scalable API IO
- Middleware layer for centralized rate limiting and error responses
- Typed frontend API client with snake_case -> camelCase mapping
- React Query for server state and optimistic dashboard refreshes
- Zustand for UI state (theme + command palette)
- Framer Motion for page reveal and staggered interaction patterns

## CI/CD

GitHub Actions workflow:

- Frontend build check (`apps/web`)
- Backend syntax compilation check (`apps/api`)

See `.github/workflows/ci.yml`.

## Future Enhancements

- Stripe subscription webhooks and entitlement checks
- Vector-based job matching and recruiter ranking
- Multi-tenant organization workspaces
- Audit trails and SIEM-friendly event forwarding
- Full integration test suite with seeded fixtures
