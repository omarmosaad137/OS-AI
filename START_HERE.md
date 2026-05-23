# Start Here — Module 1

## Order of work

1. Create Supabase project.
2. Run `supabase/schema.sql`.
3. Create `.env.local` from `.env.local.example`.
4. Add the manager/lawfirm passwords in `.env.local`.
5. Run:

```bash
npm install
npm run seed:users
npm run dev
```

6. Login as Omar.
7. Open Users page.
8. Create additional law firm users and client users.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import GitHub repo to Vercel.
3. Add environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
4. Deploy.
