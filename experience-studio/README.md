# Experience & Social Growth Studio

A production-grade all-in-one operating system for creators and product teams.

## Features

- **Social Command Center**: Planning, calendar, and analytics for social media.
- **Experience Lab**: Product analytics, funnel tracking, and A/B experiments.
- **Surveys & Feedback**: Built-in tools to capture user sentiment.
- **Workflow & Collaboration**: Workspaces, tasks, and team management.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Prisma with PostgreSQL
- **Auth**: Auth.js (NextAuth v5)
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Configure `DATABASE_URL` in `.env` and run:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## Project Structure

- `app/`: Next.js App Router routes and pages.
- `components/`: Reusable React components.
- `lib/`: Shared utilities and Prisma client.
- `prisma/`: Database schema and migrations.
- `api/`: Backend API endpoints.
