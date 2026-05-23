# Start From Scratch — OS Legal CRM + AI

## 1. Create new GitHub repo

Name:

os-legal-crm-ai

## 2. Upload files

Upload the contents of this folder, not the ZIP itself.

Correct:

os-legal-crm-ai/
  package.json
  index.html
  src/
  api/
  vercel.json

## 3. Deploy on Vercel

Framework: Vite
Build command: npm run build
Output directory: dist

## 4. Login

Manager:
manager / Manager@123

Law firm:
lawyer / Lawyer@123

Client:
client / Client@123

## 5. AI

Without OPENAI_API_KEY, AI page works in demo fallback mode.
With OPENAI_API_KEY added to Vercel environment variables, `/api/ai` will use the OpenAI API.

## 6. Production hardening before real use

- Replace demo passwords with Supabase Auth or another authentication provider.
- Add row-level permissions per role.
- Add encrypted document storage.
- Add audit logs.
- Add daily database backup.
- Restrict client users to their matters only at database level, not only UI level.
