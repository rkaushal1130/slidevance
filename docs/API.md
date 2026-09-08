# Slidevance REST API Specification

Complete documentation for the Slidevance Backend API.

- **Base URL**: `http://localhost:5000/api`
- **Current Version**: `v1` (endpoints are mounted at both `/api/v1/...` and `/api/...` for compatibility)
- **Data Format**: `application/json` (or `multipart/form-data` for file uploads)
- **Security Headers**: CORS enabled with credentials, Helmet HTTP headers, strict rate limiters, input sanitization.

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

---

## Table of Contents

1. [Standard Response & Error Formats](#standard-response--error-formats)
2. [Health](#1-health)
3. [Authentication](#2-authentication)
4. [Public Portfolio](#3-public-portfolio)
5. [Admin Portfolio](#4-admin-portfolio)
6. [Public Services](#5-public-services)
7. [Admin Services](#6-admin-services)
8. [Public Industries](#7-public-industries)
9. [Admin Industries](#8-admin-industries)
10. [Contact / Inquiries](#9-contact--inquiries)
11. [Admin Inquiries](#10-admin-inquiries)
12. [File Downloads](#11-file-downloads)
13. [Dashboard](#12-dashboard)
14. [Settings](#13-settings)

---

## Standard Response & Error Formats

### Successful Response (`200`, `201`)
```json
{
  "success": true,
  "message": "Optional human-readable confirmation",
  "data": {}
}
```

### Error Response (`400`, `401`, `403`, `404`, `429`, `500`)
```json
{
  "success": false,
  "message": "Detailed description of the error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address."
    }
  ]
}
```

---

## 1. Health

### `GET /api/health`
Checks server availability, uptime, and system timestamp.

- **Method**: `GET`
- **URL**: `/api/health`
- **Authentication**: None (Public)
- **Request**: None
- **Response** (`200 OK`):
  ```json
  {
    "status": "ok",
    "uptime": 128.45,
    "timestamp": "2026-09-08T08:30:00.000Z"
  }
  ```
- **Validation**: None
- **Possible Errors**:
  - `500 Internal Server Error`: Server unavailable.

---

## 2. Authentication

### `POST /api/v1/auth/login`
Authenticates administrator credentials, issues an HTTP-only JWT cookie (`slidevance_admin_token`), and returns admin user details.

- **Method**: `POST`
- **URL**: `/api/v1/auth/login` (also `/api/auth/login`)
- **Authentication**: None (Rate limited to 10 attempts per 15 minutes)
- **Request Body**:
  ```json
  {
    "email": "admin@slidevance.com",
    "password": "AdminPassword123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "c1f7b8...-uuid",
        "email": "admin@slidevance.com",
        "name": "Slidevance Administrator",
        "role": "ADMIN",
        "lastLoginAt": "2026-09-08T08:30:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
  }
  ```
  *Sets HTTP-only cookie:* `slidevance_admin_token=<token>; Path=/; HttpOnly; SameSite=Lax`
- **Validation**:
  - `email`: valid email string required.
  - `password`: string, minimum 6 characters.
- **Possible Errors**:
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid email/password combination or inactive account.
  - `429 Too Many Requests`: Exceeded 10 failed login attempts in 15 minutes.

---

### `POST /api/v1/auth/logout`
Clears the administrator session cookie.

- **Method**: `POST`
- **URL**: `/api/v1/auth/logout` (also `/api/auth/logout`)
- **Authentication**: None
- **Request**: None
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```
- **Validation**: None
- **Possible Errors**: None

---

### `GET /api/v1/auth/me`
Retrieves the profile of the currently authenticated administrator.

- **Method**: `GET`
- **URL**: `/api/v1/auth/me` (also `/api/auth/me`)
- **Authentication**: Required (`requireAuth`, `requireAdmin`). Bearer token or HTTP-only cookie.
- **Request**: None
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "c1f7b8...-uuid",
        "email": "admin@slidevance.com",
        "name": "Slidevance Administrator",
        "role": "ADMIN"
      }
    }
  }
  ```
- **Validation**: None
- **Possible Errors**:
  - `401 Unauthorized`: Token missing, expired, or user deactivated.
  - `403 Forbidden`: Authenticated user is not an `ADMIN`.

---

## 3. Public Portfolio

### `GET /api/v1/portfolio`
List published portfolio case studies with optional filtering, sorting, and pagination.

- **Method**: `GET`
- **URL**: `/api/v1/portfolio` (also `/api/portfolio`)
- **Authentication**: None (Public)
- **Query Parameters**:
  - `page`: integer (default: 1)
  - `limit`: integer (default: 12, max: 100)
  - `category`: string (e.g. `Presentation Design`, `RFP & Proposals`, `Data Storytelling`, `all`)
  - `featured`: boolean (`true` | `false`)
  - `search`: string (searches title and description)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "proj-uuid-1",
        "title": "Investor Presentation & Capital Raise",
        "slug": "investor-presentation-capital-raise",
        "category": "Presentation Design",
        "shortDescription": "Comprehensive investor deck transformation...",
        "featured": true,
        "published": true,
        "sortOrder": 1,
        "images": [
          {
            "id": "img-uuid-1",
            "imageUrl": "/api/files/portfolio/slide1.webp",
            "altText": "Title Slide",
            "sortOrder": 0
          }
        ],
        "createdAt": "2026-09-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 5,
      "totalPages": 1
    }
  }
  ```
- **Validation**:
  - Query parameters sanitized and coerced. Only published items are returned.
- **Possible Errors**:
  - `500 Internal Server Error`: Database connection issue.

---

### `GET /api/v1/portfolio/featured`
Returns top featured published portfolio projects for homepage spotlights.

- **Method**: `GET`
- **URL**: `/api/v1/portfolio/featured`
- **Authentication**: None (Public)
- **Query Parameters**:
  - `limit`: integer (default: 6)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [ /* Array of featured projects */ ]
  }
  ```

---

### `GET /api/v1/portfolio/:slug`
Fetches a single published portfolio case study by its URL slug.

- **Method**: `GET`
- **URL**: `/api/v1/portfolio/:slug`
- **Authentication**: None (Public)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "id": "proj-uuid-1",
      "title": "Investor Presentation & Capital Raise",
      "slug": "investor-presentation-capital-raise",
      "category": "Presentation Design",
      "shortDescription": "...",
      "description": "Full case study narrative...",
      "challenge": "Disorganized spreadsheet data...",
      "approach": "Structured high-conviction narrative...",
      "outcome": "Secured $25M Series B funding...",
      "featured": true,
      "published": true,
      "images": []
    }
  }
  ```
- **Possible Errors**:
  - `404 Not Found`: Project slug does not exist or is not published.

---

## 4. Admin Portfolio

All Admin Portfolio routes require `requireAuth` and `requireAdmin`.

### `GET /api/v1/admin/portfolio`
List all portfolio projects, including drafts and unpublished items.

- **Method**: `GET`
- **URL**: `/api/v1/admin/portfolio`
- **Query Parameters**: `page`, `limit`, `category`, `published`, `featured`, `search`
- **Response** (`200 OK`): Paginated array of projects.

---

### `GET /api/v1/admin/portfolio/:id`
Fetch single project by UUID (admin view).

- **Method**: `GET`
- **URL**: `/api/v1/admin/portfolio/:id`
- **Response** (`200 OK`): Project record.
- **Possible Errors**: `404 Not Found`.

---

### `POST /api/v1/admin/portfolio`
Create a new portfolio project.

- **Method**: `POST`
- **URL**: `/api/v1/admin/portfolio`
- **Request Body**:
  ```json
  {
    "title": "New Pitch Deck Project",
    "category": "Presentation Design",
    "shortDescription": "Brief summary",
    "description": "Full narrative description",
    "challenge": "Client challenge",
    "approach": "Our methodology",
    "outcome": "Measurable business result",
    "featured": false,
    "published": true,
    "sortOrder": 1,
    "images": [
      {
        "imageUrl": "/api/files/portfolio/preview.webp",
        "altText": "Preview image",
        "sortOrder": 0
      }
    ]
  }
  ```
- **Response** (`201 Created`): Created project record.
- **Possible Errors**: `400 Bad Request` (Validation errors).

---

### `PUT /api/v1/admin/portfolio/:id`
Update an existing portfolio project.

- **Method**: `PUT`
- **URL**: `/api/v1/admin/portfolio/:id`
- **Request Body**: Partial or full fields from project schema.
- **Response** (`200 OK`): Updated project record.

---

### `PATCH /api/v1/admin/portfolio/:id/featured`
Toggle or set the featured status of a project.

- **Method**: `PATCH`
- **URL**: `/api/v1/admin/portfolio/:id/featured`
- **Request Body**: `{ "featured": true }` (optional, toggles if omitted)
- **Response** (`200 OK`): Updated project record.

---

### `PATCH /api/v1/admin/portfolio/:id/publish`
Toggle or set the published status of a project.

- **Method**: `PATCH`
- **URL**: `/api/v1/admin/portfolio/:id/publish`
- **Request Body**: `{ "published": false }`
- **Response** (`200 OK`): Updated project record.

---

### `DELETE /api/v1/admin/portfolio/:id`
Delete a portfolio project and clean up any stored image files.

- **Method**: `DELETE`
- **URL**: `/api/v1/admin/portfolio/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Portfolio project deleted successfully."
  }
  ```

---

## 5. Public Services

### `GET /api/v1/services`
List all published service offerings and their nested deliverable items ordered by `sortOrder ASC`.

- **Method**: `GET`
- **URL**: `/api/v1/services`
- **Authentication**: None (Public)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "srv-uuid-1",
        "number": "01",
        "title": "Presentation Design & Interactive Decks",
        "slug": "presentation-design-interactive-decks",
        "shortDescription": "Create high-impact executive presentations...",
        "description": "Full service scope...",
        "icon": "Presentation",
        "sortOrder": 1,
        "items": [
          {
            "id": "item-uuid-1",
            "title": "Pitch Decks & Fundraise Stories",
            "description": "Narrative-driven Series A through C funding presentations.",
            "sortOrder": 1
          }
        ]
      }
    ]
  }
  ```

---

### `GET /api/v1/services/:slug`
Fetch a single service by slug.

- **Method**: `GET`
- **URL**: `/api/v1/services/:slug`
- **Authentication**: None (Public)
- **Possible Errors**: `404 Not Found` if nonexistent or unpublished.

---

## 6. Admin Services

All Admin Service routes require `requireAuth` and `requireAdmin`.

### `GET /api/v1/admin/services`
List all services (including drafts and unpublished services).

- **Method**: `GET`
- **URL**: `/api/v1/admin/services`
- **Response** (`200 OK`): Array of services with nested deliverable items.

---

### `POST /api/v1/admin/services`
Create a service with deliverable items.

- **Method**: `POST`
- **URL**: `/api/v1/admin/services`
- **Request Body**:
  ```json
  {
    "number": "07",
    "title": "Executive Speechwriting & Keynote Visuals",
    "shortDescription": "Script-to-stage visual alignment.",
    "description": "Full description of service scope.",
    "icon": "Mic",
    "published": true,
    "sortOrder": 7,
    "items": [
      { "title": "Keynote Deck", "description": "High-res stage graphics", "sortOrder": 1 }
    ]
  }
  ```
- **Response** (`201 Created`): Created service record.

---

### `PUT /api/v1/admin/services/:id`
Update service attributes and deliverable items.

- **Method**: `PUT`
- **URL**: `/api/v1/admin/services/:id`
- **Response** (`200 OK`): Updated service record.

---

### `PATCH /api/v1/admin/services/:id/publish`
Toggle or set publish status for a service.

- **Method**: `PATCH`
- **URL**: `/api/v1/admin/services/:id/publish`
- **Request Body**: `{ "published": true }`

---

### `DELETE /api/v1/admin/services/:id`
Delete a service and cascade delete its items.

- **Method**: `DELETE`
- **URL**: `/api/v1/admin/services/:id`

---

### `POST /api/v1/admin/services/:id/items`
Add an item to a service.

- **Method**: `POST`
- **URL**: `/api/v1/admin/services/:id/items`
- **Request Body**: `{ "title": "Item Name", "description": "Item details", "sortOrder": 1 }`

---

### `DELETE /api/v1/admin/services/:id/items/:itemId`
Remove an item from a service.

- **Method**: `DELETE`
- **URL**: `/api/v1/admin/services/:id/items/:itemId`

---

## 7. Public Industries

### `GET /api/v1/industries`
List all published industry verticals.

- **Method**: `GET`
- **URL**: `/api/v1/industries`
- **Authentication**: None (Public)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "ind-uuid-1",
        "name": "Technology & SaaS",
        "slug": "technology-saas",
        "description": "Translating multi-layered technical architectures...",
        "challenges": "Complex products, multi-tier technical architectures...",
        "capabilities": ["Presentation Design", "Data Storytelling", "Sales Enablement"],
        "icon": "Cpu",
        "sortOrder": 1
      }
    ]
  }
  ```

---

### `GET /api/v1/industries/:slug`
Fetch single industry vertical by slug.

- **Method**: `GET`
- **URL**: `/api/v1/industries/:slug`
- **Authentication**: None (Public)
- **Possible Errors**: `404 Not Found`.

---

## 8. Admin Industries

All Admin Industry routes require `requireAuth` and `requireAdmin`.

### `GET /api/v1/admin/industries`
List all industries (including unpublished).

### `POST /api/v1/admin/industries`
Create a new industry vertical.

- **Request Body**:
  ```json
  {
    "name": "Defense & Aerospace",
    "description": "Specialized procurement defense decks.",
    "challenges": "Stringent clearance compliance.",
    "capabilities": ["RFP Engineering", "Executive Summaries"],
    "icon": "Shield",
    "published": true,
    "sortOrder": 5
  }
  ```

### `PUT /api/v1/admin/industries/:id`
Update an industry.

### `PATCH /api/v1/admin/industries/:id/publish`
Toggle publish status.

### `DELETE /api/v1/admin/industries/:id`
Delete an industry.

---

## 9. Contact / Inquiries

### `POST /api/v1/inquiries`
Submits a client project inquiry with optional project brief document attachment.

- **Method**: `POST`
- **URL**: `/api/v1/inquiries` (also `/api/inquiries`)
- **Authentication**: None (Rate limited: 5 submissions per 15 min per IP)
- **Content-Type**: `multipart/form-data`
- **Request Fields**:
  - `fullName`: string (required, 2-100 characters)
  - `email`: string (required, valid email address)
  - `companyName`: string (optional, up to 100 characters)
  - `phone`: string (optional, up to 30 characters)
  - `projectType`: enum (required: `PRESENTATION_DESIGN` | `PROPOSAL_RFP` | `BUSINESS_DOCUMENTS` | `DATA_STORYTELLING` | `SALES_ENABLEMENT` | `RESEARCH` | `OTHER`)
  - `budgetRange`: string (optional)
  - `timeline`: string (optional)
  - `description`: string (required, 10-5000 characters)
  - `file`: binary file (optional, max 10MB; allowed extensions: `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.png`, `.jpg`, `.jpeg`, `.webp`)
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Your project inquiry has been submitted successfully.",
    "data": {
      "id": "inq-uuid-generated"
    }
  }
  ```
- **Validation & Security**:
  - Executable scripts (`.exe`, `.sh`, `.php`, `.js`, `.py`, `.svg`) are rejected with `400 Bad Request`.
  - Mismatched extension/MIME types are rejected.
  - Path traversal and null bytes are rejected.
  - Storage path is never exposed in response.
- **Possible Errors**:
  - `400 Bad Request`: Validation failure or invalid/oversized file attachment.
  - `429 Too Many Requests`: Rate limit exceeded.

---

## 10. Admin Inquiries

All Admin Inquiry routes require `requireAuth` and `requireAdmin`.

### `GET /api/v1/admin/inquiries`
List inquiries with filtering, search, and pagination.

- **Method**: `GET`
- **URL**: `/api/v1/admin/inquiries`
- **Query Parameters**:
  - `page`: integer (default: 1)
  - `limit`: integer (default: 20)
  - `status`: `NEW` | `CONTACTED` | `IN_PROGRESS` | `COMPLETED` | `ARCHIVED`
  - `projectType`: enum value
  - `search`: string (matches fullName, email, companyName)
- **Response** (`200 OK`): Paginated inquiry list.

---

### `GET /api/v1/admin/inquiries/stats`
Returns counts grouped by inquiry status.

- **Method**: `GET`
- **URL**: `/api/v1/admin/inquiries/stats`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "total": 24,
      "new": 8,
      "contacted": 6,
      "inProgress": 4,
      "completed": 4,
      "archived": 2
    }
  }
  ```

---

### `GET /api/v1/admin/inquiries/:id`
Detailed single inquiry record with attachment metadata.

- **Method**: `GET`
- **URL**: `/api/v1/admin/inquiries/:id`

---

### `PATCH /api/v1/admin/inquiries/:id/status`
Update the status of an inquiry.

- **Method**: `PATCH`
- **URL**: `/api/v1/admin/inquiries/:id/status`
- **Request Body**:
  ```json
  {
    "status": "CONTACTED"
  }
  ```
- **Possible Errors**: `400 Bad Request` if status value is invalid.

---

### `GET /api/v1/admin/inquiries/:id/attachments/:attachmentId`
Securely download an attachment associated with an inquiry.

- **Method**: `GET`
- **URL**: `/api/v1/admin/inquiries/:id/attachments/:attachmentId`
- **Response**: File binary stream with `Content-Disposition: attachment; filename="..."`.
- **Security**: Validates inquiry ownership and requires admin privileges. Public route `/api/files/:filename` will return 404 for inquiry files.

---

### `DELETE /api/v1/admin/inquiries/:id`
Delete an inquiry and physically remove all uploaded attachments from disk/S3.

- **Method**: `DELETE`
- **URL**: `/api/v1/admin/inquiries/:id`

---

## 11. File Downloads

### `GET /api/files/portfolio/:filename`
Serves public portfolio showcase images.

- **Method**: `GET`
- **URL**: `/api/files/portfolio/:filename`
- **Authentication**: None (Public)
- **Response**: Image stream (`image/webp`, `image/png`, `image/jpeg`).

### `GET /api/files/:filename`
Public file route fallback.
- **Security**: Inquiry attachments are strictly isolated and return `404 Not Found`.

---

## 12. Dashboard

All Dashboard routes require `requireAuth` and `requireAdmin`.

### `GET /api/v1/admin/dashboard`
Unified administrative dashboard endpoint providing summary stats, recent inquiries, and analytics in a single round-trip.

- **Method**: `GET`
- **URL**: `/api/v1/admin/dashboard` (also `/api/admin/dashboard`)
- **Query Parameters**:
  - `months`: integer (default: 6, min: 1, max: 24)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "stats": {
        "totalInquiries": 15,
        "newInquiries": 5,
        "contactedInquiries": 3,
        "inProgressInquiries": 4,
        "completedInquiries": 3,
        "totalPortfolioProjects": 12,
        "publishedPortfolioProjects": 10,
        "totalServices": 6,
        "totalIndustries": 4
      },
      "recentInquiries": [
        {
          "id": "inq-uuid-1",
          "fullName": "Alice Walker",
          "companyName": "TechCorp Global",
          "email": "alice@techcorp.com",
          "projectType": "PRESENTATION_DESIGN",
          "status": "NEW",
          "createdAt": "2026-09-08T08:15:00.000Z"
        }
      ],
      "inquiriesByStatus": [
        { "status": "NEW", "count": 5 },
        { "status": "CONTACTED", "count": 3 },
        { "status": "IN_PROGRESS", "count": 4 },
        { "status": "COMPLETED", "count": 3 },
        { "status": "ARCHIVED", "count": 0 }
      ],
      "inquiriesByProjectType": [
        { "projectType": "PRESENTATION_DESIGN", "count": 5 },
        { "projectType": "PROPOSAL_RFP", "count": 3 },
        { "projectType": "BUSINESS_DOCUMENTS", "count": 2 },
        { "projectType": "DATA_STORYTELLING", "count": 2 },
        { "projectType": "SALES_ENABLEMENT", "count": 2 },
        { "projectType": "RESEARCH", "count": 1 },
        { "projectType": "OTHER", "count": 0 }
      ],
      "inquiriesByMonth": [
        { "month": "2026-04", "label": "Apr 2026", "count": 1 },
        { "month": "2026-05", "label": "May 2026", "count": 2 },
        { "month": "2026-06", "label": "Jun 2026", "count": 3 },
        { "month": "2026-07", "label": "Jul 2026", "count": 4 },
        { "month": "2026-08", "label": "Aug 2026", "count": 2 },
        { "month": "2026-09", "label": "Sep 2026", "count": 3 }
      ]
    }
  }
  ```
- **Performance & Security**:
  - `recentInquiries` only selects 7 required fields (`id`, `fullName`, `companyName`, `email`, `projectType`, `status`, `createdAt`).
  - Passwords, internal storage paths, and full descriptions are never loaded or exposed.

---

### `GET /api/v1/admin/dashboard/stats`
Isolate retrieval of the 9 summary count metrics.

- **Method**: `GET`
- **URL**: `/api/v1/admin/dashboard/stats`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "totalInquiries": 15,
      "newInquiries": 5,
      "contactedInquiries": 3,
      "inProgressInquiries": 4,
      "completedInquiries": 3,
      "totalPortfolioProjects": 12,
      "publishedPortfolioProjects": 10,
      "totalServices": 6,
      "totalIndustries": 4
    }
  }
  ```

---

### `GET /api/v1/admin/dashboard/recent-inquiries`
Returns the latest inquiries (supports `?limit=` query parameter).

- **Method**: `GET`
- **URL**: `/api/v1/admin/dashboard/recent-inquiries?limit=5`

---

### `GET /api/v1/admin/dashboard/analytics`
Returns status breakdown, project type breakdown, and time-series monthly trend.

- **Method**: `GET`
- **URL**: `/api/v1/admin/dashboard/analytics?months=6`

---

## 13. Settings

### `GET /api/v1/settings/public`
Public endpoint returning verified company branding, contact information, and social links. Allows React frontend components to dynamically render company information without hardcoding.

- **Method**: `GET`
- **URL**: `/api/v1/settings/public` (also `/api/settings/public`)
- **Authentication**: None (Public)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "companyName": "Slidevance",
      "tagline": "Ideas That Slide. Solutions That Advance.",
      "contactEmail": "hello@slidevance.com",
      "company_name": "Slidevance",
      "contact_email": "hello@slidevance.com",
      "positioning": "Creative Presentation & Business Communication Studio",
      "contactPhone": "+1 (555) 019-2834",
      "address": "San Francisco, CA & Remote Worldwide",
      "location": "San Francisco, CA & Remote Worldwide",
      "socialLinkedin": "https://linkedin.com/company/slidevance",
      "socialTwitter": "https://twitter.com/slidevance",
      "socialInstagram": "https://instagram.com/slidevance"
    }
  }
  ```
- **Security**: Only safe public keys are returned. Environment variables and secrets are never exposed.

---

### `GET /api/v1/admin/settings`
Fetch all configurable settings for administrator management.

- **Method**: `GET`
- **URL**: `/api/v1/admin/settings` (also `/api/admin/settings`)
- **Authentication**: Required (`requireAuth`, `requireAdmin`)
- **Response** (`200 OK`): Full settings object with canonical keys and camelCase aliases.

---

### `PUT /api/v1/admin/settings`
Updates site settings. Strictly validates input against predefined allowed keys.

- **Method**: `PUT`
- **URL**: `/api/v1/admin/settings` (also `/api/admin/settings`)
- **Authentication**: Required (`requireAuth`, `requireAdmin`)
- **Request Body**:
  ```json
  {
    "companyName": "Slidevance Studio",
    "tagline": "Ideas That Slide. Solutions That Advance.",
    "contactEmail": "contact@slidevance.com"
  }
  ```
  *(Accepts camelCase or snake_case for allowed keys)*
- **Validation**:
  - Only predefined keys allowed: `company_name`/`companyName`, `tagline`, `contact_email`/`contactEmail`, `contact_phone`/`contactPhone`, `address`/`location`, `positioning`, `social_linkedin`/`linkedinUrl`, `social_twitter`/`twitterUrl`, `social_instagram`/`instagramUrl`.
  - Rejects arbitrary keys (e.g. `DATABASE_URL`, `JWT_SECRET`) with `400 Bad Request`.
  - Rejects empty payload with `400 Bad Request`.
  - Validates email format for contact email fields.
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Site settings updated successfully.",
    "data": {
      "companyName": "Slidevance Studio",
      "tagline": "Ideas That Slide. Solutions That Advance.",
      "contactEmail": "contact@slidevance.com",
      "company_name": "Slidevance Studio",
      "contact_email": "contact@slidevance.com"
    }
  }
  ```
- **Possible Errors**:
  - `400 Bad Request`: Unrecognized key, invalid email format, or empty payload.
  - `401 Unauthorized`: Unauthenticated request.
  - `403 Forbidden`: Non-admin user.
