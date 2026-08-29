# ProjectMT

A full-stack project management application — projects, role-based team members, tasks with subtasks, file attachments, progress tracking, and project notes.

The repo has two parts:

```
ProjectMT/
├── Backend/    Node.js + Express + MongoDB REST API
└── Frontend/   React + Vite SPA
```

---

## Features

- **Auth** — register/login with JWT (access + refresh tokens), email verification, forgot/reset password, change password
- **Projects** — create, update, delete; role-based access per project
- **Team members** — invite by email, assign roles (`admin`, `project_admin`, `member`), update or remove members
- **Tasks** — create, update, delete, assign to a member, file attachments, status (`todo` / `in_progress` / `done`)
- **Task self-service** — the member a task is assigned to can, on their own:
  - change the task status
  - upload attachments
  - set a progress percentage (0–100)
  - post short progress notes/comments
- **Subtasks** — create, update, delete, mark complete
- **Project notes** — admin-authored notes scoped to a project
- **Profile settings** — update avatar/photo, verify email, change password

---

## Tech Stack

**Backend**
- Node.js, Express 5
- MongoDB with Mongoose
- JWT auth (`jsonwebtoken`), `bcrypt` for password hashing
- `express-validator` for request validation
- `multer` for file uploads (served from `/public`)
- `nodemailer` + `mailgen` for transactional email

**Frontend**
- React 19, Vite
- React Router
- TanStack Query (React Query) for data fetching/caching
- Axios (with an auth-refresh interceptor)
- React Hook Form + Zod
- Tailwind CSS
- `react-hot-toast` for notifications

---

## High-Level Architecture

```
┌─────────────────────┐         HTTPS / JSON          ┌──────────────────────────┐
│                      │  ────────────────────────▶   │                          │
│   React SPA (Vite)   │                                │   Express REST API       │
│   Frontend/          │  ◀────────────────────────    │   Backend/               │
│                      │        Axios + cookies         │                          │
└─────────┬────────────┘                                └────────────┬─────────────┘
          │                                                            │
          │ TanStack Query cache                                       │ Mongoose ODM
          │ (client-side state)                                        │
          │                                                            ▼
          │                                              ┌──────────────────────────┐
          │                                              │        MongoDB           │
          │                                              │  users, projects,        │
          │                                              │  projectMembers, tasks,   │
          │                                              │  subtasks, notes,         │
          │                                              │  taskComments,            │
          │                                              │  pendingInvitations       │
          │                                              └──────────────────────────┘
          │
          │ static file requests (/images/...)
          ▼
┌──────────────────────┐
│  Backend/public/      │  ◀── multer writes uploaded avatars & task attachments here
│  images/               │       served back via express.static
└──────────────────────┘

                     ┌──────────────────────────┐
                     │   SMTP (Mailtrap/etc.)    │  ◀── nodemailer + mailgen
                     │   verification & reset     │       (registration, resend-verify,
                     │   emails                    │        forgot-password)
                     └──────────────────────────┘
```

**Backend layering** (`Backend/src/`):

```
routes/          → defines URL + HTTP method → which middleware chain → which controller
  │
  ▼
middlewares/     → verifyJwt (auth) → ValidateProjectPermission / ValidateTaskAssignee (authz) → validator (input validation) → multer (file uploads)
  │
  ▼
controllers/     → business logic, talks to models, builds ApiResponse / throws ApiError
  │
  ▼
models/          → Mongoose schemas — the only layer that talks to MongoDB
```

Every protected route follows the same chain: **authenticate → authorize → validate → handle**. This is why, for example, the task self-service routes (`/status`, `/progress`, `/attachments`, `/comments`) stack `verifyJwt` → `ValidateProjectPermission` (confirms project membership) → `ValidateTaskAssignee` (confirms it's *their* task) → the input validator → the controller.

**Frontend layering** (`Frontend/src/`):

```
pages/            → route-level screens, composed from components + hooks
  │
  ▼
hooks/            → TanStack Query hooks per resource (fetching, caching, mutations, invalidation)
  │
  ▼
services/         → thin functions that call the Axios instance with the right URL/payload
  │
  ▼
lib/axios.js      → single Axios instance: attaches JWT, auto-refreshes on 401, redirects to /login on refresh failure
```

`context/AuthContext.jsx` holds the logged-in user and session tokens (persisted to `localStorage`); `context/ToastContext.jsx` provides app-wide notifications. `constants/roles.js` and `constants/permissions.js` mirror the backend's role rules so the UI can hide/show controls — but the backend middleware is what actually enforces them.

---

## Project Flow

### 1. Onboarding
1. A user **registers** (`POST /auth/register`) → account created with `isEmailVerfied: false`, a verification email is sent.
2. User **logs in** (`POST /auth/login`) → receives an access token + refresh token (also set as HTTP-only cookies).
3. User can click the emailed link to **verify their email** (`GET /auth/verify-email/:token`), or trigger it later from **Settings → Profile → Verify email**, which calls `POST /auth/resend-email-verification`.
4. From Profile settings, the user can also **upload/change their avatar** (`PATCH /auth/avatar`) and **change their password** (`POST /auth/change-password`).

### 2. Setting up a project
1. An **admin** creates a project (`POST /projects`) — they become the project's owner/admin member implicitly.
2. The admin **invites or adds members** (`POST /projects/:id/members/invite` or `/members`) and assigns each a project-scoped role: `admin`, `project_admin`, or `member`.
3. Admins/project_admins **create tasks** (`POST /tasks/:projectId`) with a title, description, optional attachments, and optionally assign it to a member.

### 3. Working a task (the day-to-day loop)
1. A **member** opens a task assigned to them and sees status, progress, attachments, and subtasks.
2. Because they're the **assignee**, they can, without needing admin rights:
   - flip the **status** between `todo` → `in_progress` → `done`
   - bump the **progress %**
   - **upload attachments** (screenshots, files, etc.)
   - post a short **progress note** so admins/teammates can follow along without a status meeting
3. Admins/project_admins can see all of this update live (React Query invalidates and refetches the task after every mutation), and can still fully edit/reassign/delete the task themselves if needed.
4. Subtasks can be checked off by any project member; only admins/project_admins can add or delete subtasks.

### 4. Project-level communication
- Admins can post **project notes** — announcements or context visible to the whole project, separate from per-task progress notes.

### 5. Auth session lifecycle
- Access tokens are short-lived. When one expires, the Axios interceptor automatically calls `/auth/refresh-token` using the stored refresh token and retries the original request — the user never sees a failed request because of an expired token, unless the refresh token itself is invalid/expired, in which case they're redirected to `/login`.

---

## Project Structure

```
Backend/
├── src/
│   ├── controllers/     # route handlers (auth, project, task, subtask, notes, taskComment, healthCheck)
│   ├── models/           # Mongoose schemas (user, project, projectMember, task, subtask, note, taskComment, pendingInvitation)
│   ├── routes/           # Express routers, mounted in app.js
│   ├── middlewares/      # auth (JWT), role/permission checks, validation, multer
│   ├── validators/       # express-validator chains
│   ├── utils/            # ApiResponse, ApiError, asyncHandler, mail, constants
│   ├── db/                # Mongo connection
│   ├── app.js             # Express app + route mounting + error handler
│   └── index.js           # entrypoint
└── public/images/         # uploaded files (avatars, task attachments) served statically

Frontend/
├── src/
│   ├── pages/             # route-level views (auth, dashboard, projects, tasks, notes, members, settings)
│   ├── components/        # ui/, layout/, auth/, workspace/ building blocks
│   ├── hooks/              # React Query hooks (useProjects, useTasks, useTaskComments, useMembers, ...)
│   ├── services/           # API call definitions per resource (taskApi, authApi, ...)
│   ├── context/             # AuthContext, ToastContext
│   ├── layouts/             # AppLayout, AuthLayout, SettingsLayout
│   ├── constants/           # roles, permissions, task status
│   └── lib/axios.js          # axios instance + token refresh interceptor
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- An SMTP provider for email (the project is set up for [Mailtrap](https://mailtrap.io) sandbox by default — fine for local dev)

### 1. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` (see [Environment Variables](#environment-variables) below), then:

```bash
npm run dev     # starts with nodemon on http://localhost:8000
# or
npm start       # plain node
```

### 2. Frontend setup

```bash
cd Frontend
npm install
cp .env.example .env   # then edit VITE_API_URL if needed
npm run dev             # starts Vite dev server (default http://localhost:5173)
```

The frontend expects the backend API at `VITE_API_URL` (default `http://localhost:8000/api/v1`).

---

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the API server listens on (default `8000`) |
| `NODE_ENV` | `development` or `production` (controls whether stack traces are sent in error responses) |
| `MONGO_URI` | MongoDB connection string |
| `CORS_ORIGIN` | Allowed origin for CORS (e.g. your frontend URL, or `*` for dev) |
| `ACCESS_TOKEN_SECRET` | Secret used to sign JWT access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime (e.g. `1d`) |
| `REFRESH_TOKEN_SECRET` | Secret used to sign JWT refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime (e.g. `10d`) |
| `MAILTRAP_SMTP_HOST` | SMTP host for outgoing email |
| `MAILTRAP_SMTP_PORT` | SMTP port |
| `MAILTRAP_SMTP_USER` | SMTP username |
| `MAILTRAP_SMTP_PASSWORD` | SMTP password |
| `FRONTEND_URL` | Base URL of the deployed/running frontend |
| `FORGOT_PASSWORD_REDIRECT_URL` | Frontend URL the "reset password" email links to (token is appended) |



### Frontend (`Frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:8000/api/v1` |

---

## Roles & Permissions

Every project member has one project-scoped role:

| Role | Can do |
|---|---|
| `admin` | Full control: manage the project, members, notes, and all tasks |
| `project_admin` | Manage tasks and subtasks within the project |
| `member` | View project/tasks; manage subtask completion; and — **only for tasks assigned to them** — change status, upload attachments, set progress %, and post progress notes |

Role checks are enforced server-side via `ValidateProjectPermission` (project membership + role) and `ValidateTaskAssignee` (must be the task's `assignedTo` user) middleware — the frontend UI reflects these but the API is the source of truth.

---

## API Overview

Base URL: `/api/v1`

### Auth (`/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | – | Register a new user |
| POST | `/login` | – | Log in, returns access/refresh tokens |
| POST | `/logout` | ✓ | Log out (clears cookies) |
| POST | `/refresh-token` | – | Exchange a refresh token for a new access token |
| GET | `/verify-email/:verificationToken` | – | Verify email via emailed token |
| POST | `/resend-email-verification` | ✓ | Resend the verification email |
| POST | `/forgot-password` | – | Request a password-reset email |
| POST | `/reset-password/:resetToken` | – | Reset password via emailed token |
| POST | `/change-password` | ✓ | Change password (requires current password) |
| POST | `/current-user` | ✓ | Get the logged-in user |
| PATCH | `/avatar` | ✓ | Upload/update profile photo (`multipart/form-data`, field `avatar`) |

### Projects (`/projects`)
| Method | Path | Auth/Role | Description |
|---|---|---|---|
| GET | `/` | ✓ | List projects the user belongs to |
| POST | `/` | ✓ | Create a project |
| GET | `/:projectId` | any member | Get project details |
| PUT | `/:projectId` | admin | Update a project |
| DELETE | `/:projectId` | admin | Delete a project |
| GET | `/:projectId/members` | any member | List members |
| POST | `/:projectId/members` | admin | Add a member directly |
| POST | `/:projectId/members/invite` | admin, project_admin | Invite a member by email |
| PUT | `/:projectId/members/:userId` | admin | Update a member's role |
| DELETE | `/:projectId/members/:userId` | admin | Remove a member |

### Tasks (`/tasks`)
| Method | Path | Auth/Role | Description |
|---|---|---|---|
| GET | `/:projectId` | any member | List tasks in a project |
| POST | `/:projectId` | admin, project_admin | Create a task (with attachments) |
| GET | `/:projectId/t/:taskId` | any member | Get a task (with subtasks) |
| PUT | `/:projectId/t/:taskId` | admin, project_admin | Update a task (title, description, assignee, status, attachments) |
| DELETE | `/:projectId/t/:taskId` | admin, project_admin | Delete a task (and its subtasks) |
| PATCH | `/:projectId/t/:taskId/status` | **assignee only** | Update just the status |
| PATCH | `/:projectId/t/:taskId/progress` | **assignee only** | Update the progress % (0–100) |
| POST | `/:projectId/t/:taskId/attachments` | **assignee only** | Upload additional attachments |
| GET | `/:projectId/t/:taskId/comments` | any member | List progress notes on a task |
| POST | `/:projectId/t/:taskId/comments` | **assignee only** | Post a progress note |
| POST | `/:projectId/t/:taskId/subtasks` | admin, project_admin | Create a subtask |
| PUT | `/:projectId/st/:subTaskId` | any member | Update a subtask (e.g. mark complete) |
| DELETE | `/:projectId/st/:subTaskId` | admin, project_admin | Delete a subtask |

### Notes (`/notes`)
| Method | Path | Auth/Role | Description |
|---|---|---|---|
| GET | `/:projectId` | any member | List project notes |
| POST | `/:projectId` | admin | Create a note |
| GET | `/:projectId/n/:noteId` | any member | Get a note |
| PUT | `/:projectId/n/:noteId` | admin | Update a note |
| DELETE | `/:projectId/n/:noteId` | admin | Delete a note |

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/healthcheck` | Basic liveness check |

All responses follow the shape:
```json
{
  "StatusCode": 200,
  "data": { "...": "..." },
  "message": " success message"
}
```
Errors follow:
```json
{
  "success": false,
  "statusCode": 400,
  "message": " error message",
  "errors": []
}
```

---

