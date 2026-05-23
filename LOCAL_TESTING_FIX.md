# Local Testing Fix

## Why the Create Client button did not work

The old button called:

/api/admin/create-client

That works on Vercel, but it does not run under normal Vite local development:

npm run dev

## What changed

Create Client now inserts directly into Supabase from the logged-in manager session. This works locally and is still protected by RLS.

## Create User

Create User still uses:

/api/admin/create-user

because creating Supabase Auth users requires the service role key. This must remain server-side.

To test Create User locally:

npm install -g vercel
vercel dev

Or deploy to Vercel and test there.
