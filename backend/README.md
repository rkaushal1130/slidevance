# Slidevance Backend API

Node.js, Express, and TypeScript backend service for Slidevance, featuring PostgreSQL with Prisma ORM, JWT authentication, modular Local/S3 file storage, Zod request validation, pluggable email notifications (Console, SMTP, Resend), and complete administrative dashboard & settings APIs.

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/             # Type-safe environment (env.ts) and Prisma connection (db.ts)
│   ├── controllers/        # Request handlers (auth, inquiry, portfolio, service, industry, dashboard, settings, file)
│   ├── middleware/         # Auth (JWT), Upload (Multer), Validation, Rate Limiting, Error Handling
│   ├── routes/             # Express API route modules (public & admin)
│   ├── services/           # Core business logic (auth, email, storage, inquiry, portfolio, service, industry, dashboard, settings)
│   ├── validators/         # Zod schemas for request validation & DTOs
│   ├── utils/              # Logger, JWT signing & verification
│   ├── types/              # TypeScript interfaces and Express extensions
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server bootstrap and lifecycle listener
│
├── prisma/
│   ├── schema.prisma       # Database models (AdminUser, ProjectInquiry, PortfolioProject, Service, Industry, SiteSetting)
│   └── seed.ts             # Initial admin user, services, industries, settings, and sample portfolio seeding
│
├── uploads/                # Local file storage for project briefs & attachments
├── tests/                  # Automated integration, security, and unit tests
├── docs/
│   └── API.md              # Full endpoint specification and error formats
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
- **PostgreSQL**: Local PostgreSQL 14+ or Docker

### 2. Start PostgreSQL with Docker
From the project root:
```bash
docker compose up -d
```
This starts PostgreSQL on `localhost:5432` with user `postgres` and password `postgrespassword`.

---

### 3. Environment Variables

Create or review `backend/.env` (see `backend/.env.example`):

```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/slidevance_db?schema=public"

# Authentication
JWT_SECRET="slidevance_jwt_secret_key_change_in_production_min_32_chars"
JWT_EXPIRES_IN="7d"

# Initial Admin Seeding Credentials
ADMIN_EMAIL="admin@slidevance.com"
ADMIN_PASSWORD="AdminPassword123!"
ADMIN_NAME="Slidevance Administrator"

# File Upload Storage (local or s3)
STORAGE_DRIVER=local
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10

# AWS S3 (Only required if STORAGE_DRIVER=s3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=slidevance-storage

# Email Notification Provider (console, smtp, resend)
EMAIL_PROVIDER=console
EMAIL_FROM="Slidevance <hello@slidevance.com>"
ADMIN_NOTIFICATION_EMAIL="admin@slidevance.com"
```

---

### 4. Installation & Database Migration

From the `backend/` directory:

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Push schema or run migrations
npm run prisma:push
# or for formal migration history:
npm run prisma:migrate

# 4. Seed database with admin user, services, industries, and settings
npm run prisma:seed
```

**Default Seeded Administrator Credentials:**
- **Email:** `admin@slidevance.com`
- **Password:** `AdminPassword123!`

**Default Seeded Site Settings:**
- `company_name`: `Slidevance`
- `tagline`: `Ideas That Slide. Solutions That Advance.`
- `contact_email`: `hello@slidevance.com`

---

### 5. Running in Development

```bash
npm run dev
```
Starts the server with hot-reloading at `http://localhost:5000`.

---

### 6. Automated Testing

Run the full automated test suite:

```bash
npm test
```

Or run targeted test suites:

```bash
# Health endpoint test
npm test tests/health.test.ts

# Authentication & session tests
npm run test:auth

# Inquiries & brief attachment tests
npm run test:inquiry

# Portfolio showcase & filtering tests
npm run test:portfolio

# Services & industries tests
npm run test:services-industries

# Local/S3 storage driver & security tests
npm run test:storage

# Admin Dashboard metrics & analytics tests
npm run test:dashboard

# Public & admin site settings tests
npm run test:settings

# Comprehensive security, rate limiting, and error format tests
npm run test:security
```

---

### 7. Production Build & Deployment

```bash
# Compile TypeScript to dist/
npm run build

# Start production server
npm start
```

---

## 📖 API Documentation

Complete endpoint documentation with request/response schemas, validation rules, and error examples is located in [docs/API.md](docs/API.md).

### Summary of Available Endpoints

#### 🟢 Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and health check |
| `POST` | `/api/v1/auth/login` | Administrator login (sets HTTP-only cookie) |
| `POST` | `/api/v1/auth/logout` | Administrator logout (clears session cookie) |
| `GET` | `/api/v1/portfolio` | List published portfolio projects with filtering |
| `GET` | `/api/v1/portfolio/featured` | Top featured portfolio projects |
| `GET` | `/api/v1/portfolio/:slug` | Get single portfolio project by slug |
| `GET` | `/api/v1/services` | List published services and deliverables |
| `GET` | `/api/v1/services/:slug` | Get service details by slug |
| `GET` | `/api/v1/industries` | List published industry verticals |
| `GET` | `/api/v1/industries/:slug` | Get industry details by slug |
| `POST` | `/api/v1/inquiries` | Submit client inquiry with optional project brief |
| `GET` | `/api/v1/settings/public` | Safe public company branding & contact info |
| `GET` | `/api/files/portfolio/:filename` | Stream public portfolio showcase image |

#### 🔒 Admin Endpoints (Require `requireAuth` & `requireAdmin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/auth/me` | Current authenticated admin profile |
| `GET` | `/api/v1/admin/dashboard` | Unified dashboard stats, recent inquiries & analytics |
| `GET` | `/api/v1/admin/dashboard/stats` | 9-point summary count metrics |
| `GET` | `/api/v1/admin/dashboard/recent-inquiries` | Latest inquiries (strict privacy projection) |
| `GET` | `/api/v1/admin/dashboard/analytics` | Status, project type, and monthly trends |
| `GET` | `/api/v1/admin/inquiries` | List inquiries with filtering, search & pagination |
| `GET` | `/api/v1/admin/inquiries/stats` | Status summary metrics |
| `GET` | `/api/v1/admin/inquiries/:id` | Full inquiry record with attachment metadata |
| `PATCH` | `/api/v1/admin/inquiries/:id/status` | Update inquiry status (`NEW`, `CONTACTED`, etc.) |
| `DELETE` | `/api/v1/admin/inquiries/:id` | Delete inquiry and clean up uploaded files |
| `GET` | `/api/v1/admin/inquiries/:id/attachments/:attachmentId` | Securely download client project brief |
| `GET` | `/api/v1/admin/portfolio` | Admin portfolio list (including drafts) |
| `POST` | `/api/v1/admin/portfolio` | Create portfolio project |
| `PUT` | `/api/v1/admin/portfolio/:id` | Update portfolio project |
| `PATCH` | `/api/v1/admin/portfolio/:id/featured` | Toggle project featured state |
| `PATCH` | `/api/v1/admin/portfolio/:id/publish` | Toggle project published state |
| `DELETE` | `/api/v1/admin/portfolio/:id` | Delete project and remove stored images |
| `GET` | `/api/v1/admin/services` | Admin services list (including drafts) |
| `POST` | `/api/v1/admin/services` | Create service and deliverables |
| `PUT` | `/api/v1/admin/services/:id` | Update service |
| `DELETE` | `/api/v1/admin/services/:id` | Delete service |
| `POST` | `/api/v1/admin/services/:id/items` | Add deliverable item to service |
| `DELETE` | `/api/v1/admin/services/:id/items/:itemId` | Remove deliverable item |
| `GET` | `/api/v1/admin/industries` | Admin industries list (including drafts) |
| `POST` | `/api/v1/admin/industries` | Create industry vertical |
| `PUT` | `/api/v1/admin/industries/:id` | Update industry vertical |
| `DELETE` | `/api/v1/admin/industries/:id` | Delete industry vertical |
| `GET` | `/api/v1/admin/settings` | Retrieve all site settings |
| `PUT` | `/api/v1/admin/settings` | Update site settings (strict predefined whitelist) |

---

## 🛡️ Security Architecture

1. **Authentication & Roles**: Dual HTTP-only Cookie (`slidevance_admin_token`) and `Authorization: Bearer <jwt>` support with database-backed active session verification and `ADMIN` role requirement.
2. **Data Privacy**: Passwords (`passwordHash`), internal storage paths, and secrets are never returned in public or admin API payloads.
3. **File Isolation**: Client inquiry brief attachments are stored in a private directory and cannot be accessed via public `/api/files/` routes; they can only be streamed through authenticated admin endpoints with explicit inquiry verification.
4. **Malicious Upload Protection**: Strict extension, MIME type, double-extension, null-byte, and file signature validation. Executables and scripts are rejected immediately.
5. **Rate Limiting**: IP-based sliding window rate limiters for login attempts (10 per 15 min) and client inquiries (5 per 15 min).
6. **Strict Input Sanitization**: All inputs are validated via Zod schemas. Admin site settings updates forbid arbitrary keys using `.strict()` validation.
7. **Consistent Error Reporting**: All errors conform to `{ success: false, message: string, errors: array }`.
