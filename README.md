# Ledgera Finance System

Ledgera is a full-stack finance tracking and analytics app with role-based access control, JWT authentication, and dashboard visualizations.

## Checklist
- [x] Project overview
- [x] Accurate monorepo structure
- [x] Local setup for backend + frontend
- [x] Environment variable expectations
- [x] Available scripts and commands
- [x] Deployment docs index (Render/Vercel + Docker)
- [x] Known current build note

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.x, Spring Security, Spring Data JPA, Flyway
- **Frontend:** React 18, Vite 5, React Router, Axios, Recharts
- **Database:** PostgreSQL (default), H2 profile for local testing
- **Auth:** JWT

## Repository Structure

```text
ledgera-finance-system/
├─ backend/                     # Spring Boot API
│  ├─ src/main/java/com/ledgera/
│  │  ├─ config/
│  │  ├─ controller/
│  │  ├─ dto/
│  │  ├─ entity/
│  │  ├─ enums/
│  │  ├─ exception/
│  │  ├─ repository/
│  │  ├─ security/
│  │  └─ service/
│  ├─ src/main/resources/
│  │  ├─ application.properties
│  │  ├─ application-h2.properties
│  │  └─ db/migration/
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  └─ pom.xml
├─ frontend/                    # React + Vite SPA
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ context/
│  │  └─ pages/
│  ├─ public/
│  ├─ package.json
│  ├─ vite.config.js
│  └─ vercel.json
├─ FULL_DEPLOYMENT.md
├─ DEPLOYMENT_CHECKLIST.md
└─ README.md
```

## Prerequisites

- **Java 17+**
- **Node.js 18+** (frontend includes `.nvmrc` with `18`)
- **npm**
- **PostgreSQL** (for default backend profile)

## Environment Configuration

### Backend

`backend/src/main/resources/application.properties` uses environment-based values (via dotenv support):

- `PORT` (default `8080`)
- JDBC settings expected for PostgreSQL (URL/user/password)
- Flyway enabled by default

You can use `backend/.env.example` as reference for local variables.

### Frontend

Use `frontend/.env.local` for local API target if needed:

```env
VITE_API_URL=http://localhost:8080
```

For cloud deployments, `VITE_API_URL` is set in platform env vars (Vercel/Render).

## Local Development

### 1) Start Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

Backend runs on:

- `http://localhost:8080`

Optional H2 profile:

```bash
cd backend
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
```

### 2) Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

## Build Commands

### Backend

```bash
cd backend
mvnw.cmd clean package
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Scripts

### Frontend (`frontend/package.json`)

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## API Surface (High-Level)

- `/api/auth/*` — authentication and password reset
- `/api/users/*` — user management (role-restricted)
- `/api/records/*` — financial records CRUD/filtering
- `/api/dashboard` — summary metrics and charts data

## Deployment

### Quick Index

- Full stack: `FULL_DEPLOYMENT.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- Backend Docker: `backend/DOCKER.md`, `backend/DOCKER-QUICKSTART.md`
- Frontend Vercel: `frontend/VERCEL.md`
- Frontend Render: `frontend/render.md`
- Frontend quick start: `frontend/QUICK-DEPLOY.md`

### Typical Setup

- **Backend:** Render (Docker) or any container host
- **Frontend:** Vercel (Vite static build)

### Vercel Frontend Notes

- `VITE_API_URL` should point to your backend (e.g. `https://ledgera-backend.onrender.com`).
- If `VITE_API_URL` is not set, `/api/*` requests are proxied via Vercel rewrites.

### Render Backend Notes

- Health check path: `/healthz` (fast, unauthenticated).
- Ensure `PORT` is provided by Render (no hardcoding needed).
- Optional: disable admin seeding in production with `LEDGERA_SEED_ADMIN=false`.

## Known Note (Current Repository State)

A backend compile issue is currently present in `LedgeraApplication.java` due to a `dotenv` import mismatch (`io.github.cdimascio.dotenv` not found at compile time). This is independent of this README update, but worth fixing before CI/CD hardening.

## License

MIT
