# WellNedd - Wellness Management Platform

Production-style full-stack wellness app for physical and mental wellbeing tracking, self-care programs, content discovery, coaching workflows, rewards, and admin analytics.

This project is a **general wellness demo** with dummy data only. It is **not** a medical device and does not provide clinical diagnosis or treatment.

## Features

- Daily wellness check-ins (mood, stress, sleep, activity)
- Habits and goals tracking
- Structured programs with enrollment/progress
- Content library (articles/video/audio/exercises)
- Coaching appointments and messaging (dummy data)
- Engagement + points + rewards redemption
- RBAC across `USER`, `COACH`, `ADMIN`
- Admin users/content/program/analytics pages

## Tech Stack

- Next.js (App Router) + TypeScript
- Prisma ORM + SQLite
- NextAuth/Auth.js (credentials provider)
- Tailwind CSS + Recharts
- Vitest

## Setup

1. Install dependencies:
   - `npm install`
2. Copy env:
   - `cp .env.example .env`
3. Run migration:
   - `npx prisma migrate dev --name init`
4. Seed dummy data:
   - `npm run seed`
5. Start local app:
   - `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

- Admin: `admin@wellnedd.local` / `password123`
- Coach: `coach1@wellnedd.local` / `password123`
- User: `user1@wellnedd.local` / `password123`

## Architecture

- `prisma/schema.prisma`: full wellness domain model
- `app/api/*`: route handlers for each domain
- `lib/prisma.ts`: Prisma singleton
- `auth.ts` + `lib/auth.ts`: auth setup and helpers
- `lib/engagement.ts`: event tracking and points
- `lib/permissions.ts`: RBAC checks

## Notes

- Use HTTPS in production.
- Do not store real PHI in this demo app.
