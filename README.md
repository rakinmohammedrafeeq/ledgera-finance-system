<p align="center">
  <img src="https://raw.githubusercontent.com/rakinmohammedrafeeq/ledgera/main/frontend/public/gold-logo.png" alt="Ledgera Logo" width="200">
</p>

# Ledgera — Full-Stack Finance Tracking System

Ledgera is a full-stack finance tracking and analytics app with role-based access control, JWT authentication, and dashboard visualizations.

## Features

- Secure JWT-based authentication and authorization  
- Role-Based Access Control (Admin/User)  
- Financial records management (income and expenses)  
- Dashboard with analytics and visualizations  
- Filtering and search functionality  
- RESTful API with Spring Boot  
- Scalable layered architecture (Controller → Service → Repository)  

## Why Ledgera?

Ledgera is designed to simulate a real-world financial system with secure authentication, modular backend architecture, and interactive data visualization. The goal is to reflect production-level design practices used in modern full-stack applications.

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

## License

This project is licensed under the [MIT License](LICENSE).

## Contact  

**For any questions or suggestions, feel free to reach out:**   
- **Email:** rakinmohammedrafeeq@gmail.com  
- **LinkedIn:** https://www.linkedin.com/in/rakinmohammedrafeeq  
- **GitHub:** https://github.com/rakinmohammedrafeeq

## Support  

If you find this project useful, consider giving it a ⭐ on GitHub or supporting my work:  

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/rakinmohammedrafeeq)
