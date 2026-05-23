# OS Legal CRM + AI — Role Based Version

This is the newer version requested.

## Included features

- Manager user login
- Law firm user login
- Client user login
- Role-based dashboards and menus
- Client portal showing only that client's matters
- Leads
- Matters
- Documents
- Tasks
- Updates
- Calendar
- Phonebook
- User management
- Document templates:
  - Contracts
  - Engagement letters
  - Legal notices
  - Client update emails
  - Arabic update template
- AI assistant:
  - Draft client update
  - Draft legal notice
  - Draft engagement letter
  - Summarize matter
  - Translate English/Arabic
  - Draft contract clause
- Vercel API route for AI:
  - `/api/ai`
  - Uses server-side `OPENAI_API_KEY`
  - Falls back to demo AI if no API key is configured

## Demo users

Manager:
- username: `manager`
- password: `Manager@123`

Law firm user:
- username: `lawyer`
- password: `Lawyer@123`

Client user:
- username: `client`
- password: `Client@123`

## Important security note

The demo login stores usernames/passwords in browser storage so you can test quickly.
Do not use this for real client data until proper authentication is connected.

Production authentication should use:
- Supabase Auth
- Firebase Auth
- Auth0
- Clerk
- or a custom secure backend

## Install locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Upload this folder to GitHub.
2. Import into Vercel.
3. Settings:
   - Framework: Vite
   - Build command: npm run build
   - Output directory: dist
4. Deploy.

## Enable real AI

In Vercel:

1. Project Settings
2. Environment Variables
3. Add:

```text
OPENAI_API_KEY=your_api_key
```

4. Redeploy.

The AI key is used only in `/api/ai.js`, never in frontend browser code.
