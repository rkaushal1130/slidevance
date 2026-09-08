# Slidevance

Slidevance is an executive presentation and business communication studio platform featuring a React + Vite frontend and a secure Node.js, Express, TypeScript, and PostgreSQL backend powered by Prisma ORM.

---

## 🏗️ Architecture Overview

```text
                    SLIDEVANCE WEBSITE
                           │
                           ▼
                    React Frontend
                           │
                     REST API /api/v1
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Public Website              Admin System
              │                         │
       ┌──────┼──────┐          ┌───────┼────────┐
       │      │      │          │       │        │
    Services Portfolio Industries  Auth  CMS  Dashboard
       │      │      │                  │
       └──────┼──────┘                  │
              │                         │
              ▼                         ▼
          PostgreSQL  ◄────────────── Prisma
              │
              ├── AdminUser
              ├── ProjectInquiry
              ├── InquiryAttachment
              ├── PortfolioProject
              ├── PortfolioImage
              ├── Service
              ├── ServiceItem
              ├── Industry
              └── SiteSetting
```

- **Frontend**: React 19, React Router v7, Vite, Lucide Icons, Vanilla CSS Modules
- **Backend** (`backend/`): Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT Authentication, Multer file processing, Local/S3 storage drivers, Nodemailer
- **API Documentation**: [`docs/API.md`](docs/API.md)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **PostgreSQL**: Local instance or Docker Compose

### 2. Start PostgreSQL
```bash
docker compose up -d
```
Runs PostgreSQL at `localhost:5432` (database: `slidevance_db`, user: `postgres`, password: `postgrespassword`).

---

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client & push schema to database
npm run prisma:generate
npm run prisma:push

# Seed database with initial admin user, services, industries, and settings
npm run prisma:seed

# Run tests
npm test

# Start development server (http://localhost:5000)
npm run dev
```

**Default Admin Credentials:**
- **Email:** `admin@slidevance.com`
- **Password:** `AdminPassword123!`

---

### 4. Frontend Setup

From the root directory:

```bash
# Install frontend dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev
```

---

## 🧪 Testing

The backend includes a comprehensive TypeScript test suite running via Node.js native test runner and `tsx`:

```bash
cd backend

# Run all test suites
npm test

# Run individual test suites
npm run test:auth
npm run test:inquiry
npm run test:portfolio
npm run test:services-industries
npm run test:storage
npm run test:dashboard
npm run test:settings
npm run test:security
```

---

## 📦 Production Build

```bash
# Frontend production build
npm run build

# Backend production build
cd backend
npm run build
npm start
```

---

## 📚 API Documentation

Detailed specifications for every endpoint, request and response schemas, validation rules, and error handling are documented in:

👉 **[docs/API.md](docs/API.md)**
