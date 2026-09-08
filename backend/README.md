# Slidevance Backend API

Node.js, Express, and TypeScript backend service for Slidevance, featuring PostgreSQL with Prisma ORM, JWT authentication, modular Local/S3 file storage, Zod request validation, and pluggable email notifications (Console, SMTP, Resend).

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/             # Type-safe environment (env.ts) and Prisma connection (db.ts)
│   ├── controllers/        # Request handlers (auth, inquiry, file)
│   ├── middleware/         # Auth (JWT), Upload (Multer), Validation, Global Error
│   ├── routes/             # Express API route modules
│   ├── services/           # Core business logic (auth, email, storage, inquiry)
│   ├── validators/         # Zod schemas for input validation & DTOs
│   ├── utils/              # Logger, JWT signing & verification
│   ├── types/              # TypeScript interfaces and Express extensions
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server bootstrap and lifecycle listener
│
├── prisma/
│   ├── schema.prisma       # Database models (User, Inquiry, Attachment, AuditLog)
│   └── seed.ts             # Initial admin user & sample inquiry seeding
│
├── uploads/                # Local file storage for project briefs & attachments
├── tests/                  # Automated integration and health check tests
├── .env                    # Active environment variables
├── .env.example            # Environment configuration template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Backend documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **PostgreSQL**: Local PostgreSQL or Docker

### 2. Start PostgreSQL with Docker
From the project root:
```bash
docker compose up -d
```
This boots PostgreSQL on `localhost:5432` with user `postgres` and password `postgrespassword`.

### 3. Environment Variables
Check `backend/.env` (pre-configured for local dev):
```ini
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/slidevance_db?schema=public"
JWT_SECRET="slidevance_jwt_secret_key_change_in_production_min_32_chars"
PORT=5000
STORAGE_DRIVER=local
EMAIL_PROVIDER=console
```

### 4. Install Dependencies & Initialize Database
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

**Default Admin Credentials:**
- **Email:** `admin@slidevance.com`
- **Password:** `AdminPassword123!`

### 5. Run Server
```bash
# Development mode with hot-reloading
npm run dev

# Run integration tests
npm test

# Production build & start
npm run build
npm start
```

---

## 🔌 API Reference

### 🟢 Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Admin login; validates credentials, sets HTTP-only cookie, updates `lastLoginAt` | Rate limited, generic error message |
| `POST` | `/api/v1/auth/logout` | Clears authentication cookie | Public |
| `GET` | `/api/v1/auth/me` | Fetch authenticated admin profile | `requireAuth` + `requireAdmin` (Cookie / Bearer) |

### 🟢 Public Endpoints

| Method | Endpoint | Description | Content-Type |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health & uptime status | `application/json` |
| `POST` | `/api/inquiries` | Submit client inquiry + attachment | `multipart/form-data` |

### 🔒 Protected Admin Endpoints
*Requires:* HTTP-only cookie or `Authorization: Bearer <jwt_token>`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/auth/me` | Current authenticated admin profile |
| `GET` | `/api/inquiries/admin` | List inquiries (pagination, filter by status, search) |
| `GET` | `/api/inquiries/admin/stats` | Status summary metrics (total, new, in-review, won) |
| `GET` | `/api/inquiries/admin/:id` | Detailed inquiry record with attachments & audit log |
| `PATCH` | `/api/inquiries/admin/:id` | Update inquiry status & internal notes |
| `DELETE` | `/api/inquiries/admin/:id` | Delete inquiry & cleanup storage files |
| `GET` | `/api/files/:filenameOrId` | Stream or download attachment file |
