# IEEE One Minute Talk (OMT) Portal

A complete, production-ready web application built for the **IEEE Student Branch** to manage monthly One Minute Talk speech competitions, student registrations, advisor evaluations, and live leaderboards.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom IEEE Blue (`#00629B`) design system & Lucide Icons
- **Backend / Database**: Supabase PostgreSQL & Row Level Security (RLS)
- **Auth**: Supabase Auth (integrated with `profiles` table)
- **Validation**: Zod & Server Actions

---

## Key Features

### Student Portal
- **Dashboard**: Welcome banner, performance cards (Best Score, Average Score, Total Sessions), active session registration status button (`Register` -> `Registered ✓`).
- **Leaderboard**: Real-time rankings with top 3 badges (🥇, 🥈, 🥉), highlighting logged-in student.
- **My Sessions**: Card overview of attended sessions; details modal with breakdown across 4 criteria (Communication, Confidence, Content, Time Management) and Advisor Remarks Card.
- **Profile**: Student information display, statistics (Total sessions, Best score, Highest rank), and editable contact/academic fields (Phone, Department, Year of study).

### Admin Portal
- **Dashboard**: High-level platform statistics (Total Students, Registrants in Active Session, Completed/Pending Evaluations, Active Session summary).
- **Session Management**: Full CRUD for sessions with strict constraint enforcing ONLY ONE active session at a time (`idx_single_active_session`).
- **Participants**: Searchable, filterable, and sortable participant roster.
- **Score Entry**: Evaluation form with slider controls for Communication (0-10), Confidence (0-10), Content (0-10), Time Management (0-10), auto-calculated total score, and advisor remarks.
- **Leaderboard Management**: Live rank display, single-click CSV export report.
- **User Management**: Role management table to toggle student/admin permissions.

---

## Supabase Database Setup

1. Log into your [Supabase Dashboard](https://app.supabase.com) and create a new project.
2. Navigate to the **SQL Editor**.
3. Run the schema creation script from [`supabase/schema.sql`](./supabase/schema.sql).
4. Run the RLS policy script from [`supabase/rls.sql`](./supabase/rls.sql).

---

## Environment Variables Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment to Vercel

1. Push code repository to GitHub/GitLab.
2. Import project into Vercel.
3. Set the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
4. Deploy!
