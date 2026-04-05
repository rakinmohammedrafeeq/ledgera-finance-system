# Ledgera — Finance Data Processing & Access Control System

A full-stack finance management application with role-based access control, JWT authentication, financial records management, and analytics dashboard.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 17+, Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Frontend** | React 18, Vite 5, Recharts, React Router, Axios |
| **Database** | PostgreSQL (primary), H2 (optional dev profile) |
| **Auth** | JWT (jjwt 0.12.x), BCrypt password hashing |

## Project Structure

```
ledgera-finance-system/
├── backend/                          # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/ledgera/
│       ├── config/                   # Security, CORS, DataInitializer
│       ├── controller/               # REST controllers
│       ├── dto/                      # Request/Response DTOs
│       ├── entity/                   # JPA entities
│       ├── enums/                    # Role, TransactionType
│       ├── exception/                # Custom exceptions + global handler
│       ├── repository/               # JPA repositories + specifications
│       ├── security/                 # JWT provider, filter, UserDetails
│       └── service/                  # Business logic
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── api/                      # Axios instance
│   │   ├── components/               # Reusable UI components
│   │   ├── context/                  # Auth context
│   │   └── pages/                    # Page components
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- **Java 17+** (JDK installed and `JAVA_HOME` set)
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **PostgreSQL** running locally

### 1. Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE ledgera_db;
```

The default connection settings in `application.properties`:
- URL: `jdbc:postgresql://localhost:5432/ledgera_db`
- Username: `postgres`
- Password: `postgres`

Update credentials in `backend/src/main/resources/application.properties` if yours differ.

### 2. Start Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

On first startup, a default admin user is created:
- **Email:** `admin@ledgera.com`
- **Password:** `Admin@123`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4. Using H2 (Optional)

To use H2 in-memory database instead of PostgreSQL:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

H2 Console: `http://localhost:8080/h2-console`

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ledgera.com | Admin@123 |

> Admin is auto-created on startup and cannot be registered manually.

---

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/register` | Register (ANALYST/VIEWER only) |
| POST | `/api/auth/forgot-password` | Generate reset token |
| POST | `/api/auth/reset-password` | Reset password with token |

### Users (ADMIN only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| PUT | `/api/users/{id}/toggle-status` | Activate/deactivate user |

### Financial Records

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/records` | ADMIN | Create record |
| PUT | `/api/records/{id}` | ADMIN | Update record |
| DELETE | `/api/records/{id}` | ADMIN | Delete record |
| GET | `/api/records` | ADMIN, ANALYST | List with filters & pagination |
| GET | `/api/records/{id}` | ADMIN, ANALYST | Get single record |

**Query Parameters for GET /api/records:**
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `category` (string)
- `type` (INCOME/EXPENSE)
- `page` (default: 0)
- `size` (default: 20)
- `sortBy` (default: date)
- `direction` (asc/desc, default: desc)

### Dashboard (All Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Aggregated analytics data |

---

## Roles & Permissions

| Feature | ADMIN | ANALYST | VIEWER |
|---------|-------|---------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| View Records | ✅ | ✅ | ❌ |
| Create/Edit/Delete Records | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ |

---

## Features

- 🔐 **JWT Authentication** with secure token management
- 👥 **Role-Based Access Control** (ADMIN, ANALYST, VIEWER)
- 📊 **Dashboard** with summary cards, charts, and recent transactions
- 📋 **Financial Records** with CRUD, filtering, and pagination
- 🔄 **Forgot Password** flow with UUID reset tokens (15-min expiry)
- 🎨 **Premium Dark UI** with navy blue, gold, and white theme
- 📱 **Responsive Design** for desktop and mobile

---

## License

MIT
