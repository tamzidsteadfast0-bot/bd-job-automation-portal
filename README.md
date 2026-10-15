# BD Job Automation Portal — MVP Starter

This is a starter scaffold for a multi-user Bangladesh job portal. It is not a deployed service yet.

## Included
- Next.js + TypeScript starter dashboard
- Supabase PostgreSQL schema with row-level security (RLS)
- Tables for profiles, job sources, jobs, CV metadata, matches, email drafts and application logs
- Human approval workflow: email drafts must be approved before sending
- Source registry starter and implementation checklist

## Stack
- Next.js (web app)
- Supabase Auth + PostgreSQL + private Storage
- Gmail API OAuth for sending approved emails (to be configured)
- Scheduled job collector (to be deployed separately or as a scheduled function)

## Run locally
1. Install Node.js LTS.
2. Create a Supabase project at https://supabase.com/ and open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy `.env.example` to `.env.local` and fill in your Supabase project values.
5. Run:
   ```bash
   npm install
   npm run dev
   ```
6. Open http://localhost:3000

## Important setup still required
- Configure Supabase Auth providers and email verification.
- Configure private CV storage bucket and upload policies.
- Implement server-side CV parsing and job matching.
- Add approved source adapters; do not scrape sites in violation of their terms.
- Configure Gmail OAuth and request the minimum scopes needed.
- Configure scheduled collection and error monitoring.
- Before production, add rate limits, audit logs, abuse reporting, privacy/retention controls and security review.

## Job-source policy
Prefer official career pages, government recruitment portals, official RSS/feeds, and APIs or data access that the source explicitly permits. Store source URL and date collected. LinkedIn/Bdjobs access must follow each provider's current terms and permitted integrations. Do not bypass login, CAPTCHA, paywalls, or anti-bot controls.

## Email safety
The app must show the recipient, subject, body, and attached CV before sending. Only send after an explicit user approval. Verify recipient addresses and prevent duplicate applications. Never ask users for their Gmail password; use OAuth.
