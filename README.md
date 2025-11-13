# Attendance API (Next.js)

Backend API for a multi-role attendance tracking system built with Next.js Route Handlers and MongoDB.

## Environment

Create a `.env.local` file with:

```
MONGODB_URI=mongodb://Toss:Toss@123@103.14.120.163:27017/attendence?authSource=admin
AUTH_SECRET=your-long-random-secret
```

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Run the dev server:

   ```
   npm run dev
   ```

## Authentication

- Register (`POST /api/auth/register`) creates the first user as `admin`; subsequent users default to `employee`.
- Login (`POST /api/auth/login`) returns a JWT token and sets a secure cookie.
- Include `Authorization: Bearer <token>` for authenticated routes, or rely on the cookie.

## Core Endpoints

- `POST /api/auth/register` – Register new users (first becomes admin).
- `POST /api/auth/login` / `POST /api/auth/logout` / `GET /api/auth/me`.
- `GET /api/users` – Admin sees all users, managers see their team.
- `POST /api/users` – Admin/manager creates a user (managers limited to employees).
- `GET|PATCH|DELETE /api/users/:id`.
- `POST /api/attendance/check-in` / `POST /api/attendance/check-out`.
- `GET /api/attendance` – Filter by user and date range.
- `POST /api/attendance` – Manual entry (admin/manager).
- `GET|PATCH|DELETE /api/attendance/:id`.
- `GET /api/attendance/summary` – Aggregated stats.
- `GET|POST /api/leave` – Submit or list leave requests.
- `GET|PATCH|DELETE /api/leave/:id` – Review or remove leave requests.

## MongoDB Models

- `User` – name, email, role (`admin`, `manager`, `employee`), department, status.
- `Attendance` – check-in/out, daily status, notes, work duration.
- `LeaveRequest` – leave period, type, approval status.

## Validation & Errors

- Payload validation handled via Zod schemas in `src/lib/validators.ts`.
- Standard JSON responses with `{ success, data?, message? }`.

## Testing Tips

1. Register an initial admin.
2. Create additional users via admin endpoints.
3. Use `/api/auth/login` to capture the JWT for subsequent requests.
4. Exercise attendance check-in/out then query summaries and reports.



