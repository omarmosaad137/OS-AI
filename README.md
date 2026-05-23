# OS Legal v3 — Module 1: Production Authentication and Roles

This module starts the final production version.

## What this module includes

- Supabase Auth login
- Manager role
- Law firm user role
- Client user role
- Manager can create:
  - manager users
  - law firm users
  - client users
- Manager can create clients
- Client users are linked to client records
- Row Level Security starter policies
- Vercel API routes with service-role key, never exposed to browser
- No demo passwords stored in frontend code

## Initial users requested

Create these through the seed script, not in frontend code:

Manager:
- Omar Mosaad
- omar@os-legal.net
- password: use the password Omar provided

Law firm user:
- zeyad sameh
- zeyad@os-legal.net
- password: use the password Omar provided

## Setup steps

### 1. Create Supabase project

Create a new Supabase project.

### 2. Run SQL schema

Open Supabase SQL Editor and run:

```text
supabase/schema.sql
```

### 3. Prepare local environment

Copy:

```text
.env.local.example
```

to:

```text
.env.local
```

Fill:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MANAGER_EMAIL=omar@os-legal.net
MANAGER_PASSWORD=
MANAGER_FULL_NAME=Omar Mosaad
LAWFIRM_EMAIL=zeyad@os-legal.net
LAWFIRM_PASSWORD=
LAWFIRM_FULL_NAME=zeyad sameh
```

The passwords must be placed only in `.env.local`, not committed to GitHub.

### 4. Seed initial users

Run:

```bash
npm install
npm run seed:users
```

### 5. Add Vercel environment variables

In Vercel Project Settings > Environment Variables add:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Then redeploy.

### 6. Login

Use:

```text
omar@os-legal.net
```

and the password you placed in `.env.local`.

## Important security notes

- Do not commit `.env.local`.
- Do not put passwords inside React code.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Client access must be enforced by RLS, not just the interface.


## v1.1 local testing fix

Client creation now works locally with:

```bash
npm run dev
```

The old client button used `/api/admin/create-client`, which is a Vercel serverless API route. Vite does not run Vercel API routes during normal local development.

User creation still uses `/api/admin/create-user` because creating Supabase Auth users requires the service role key. Do not expose the service role key in browser code.

To test user creation locally, run:

```bash
npm install -g vercel
vercel dev
```

Or deploy to Vercel and add the server-side environment variables.


## Module 2 — Law Firm User Permissions + Invoice Requests

This module changes the law firm user role as requested.

### Law firm user CAN see

- Dashboard
- Clients list
- All matters
- Invoice Requests page

### Law firm user CANNOT see

- Leads
- Professional fee / finance dashboards
- Engagement letters
- User management
- Audit log
- Manager-only finance controls

### Law firm user CAN request invoice/disbursement for

- Court fee
- Translation
- Expert fee
- Government fee
- Courier / service fee
- Notary fee
- Other disbursement

### Manager CAN

- See all invoice requests
- Approve or reject invoice requests
- Create clients
- Create users

### If Module 1 is already installed

Run this SQL file in Supabase SQL Editor:

```text
supabase/migrations/module2_permissions_invoice_requests.sql
```

Then restart local app or redeploy Vercel.


## Module 2.1 — Finance User Role

This package adds a dedicated `finance` role.

### Finance user can access

- Dashboard
- Clients
- All matters
- Invoice requests
- Finance overview
- Pending invoice requests

### Finance user can do

- View all invoice/disbursement requests
- Approve or reject invoice requests
- View clients and matters
- Create invoice/disbursement requests if needed

### Finance user does not do

- Create users
- Manage manager/lawfirm/client accounts
- Access manager-only audit controls

### To update an existing Module 2 database

Run this SQL file in Supabase SQL Editor:

```text
supabase/migrations/module2_1_finance_role.sql
```

### To create a finance user

Login as manager, open Users, create user with role:

```text
Finance User
```

Example:
- Full name: Accounts / Finance
- Email: accounts@os-legal.net
- Temporary password: ChangeMe@123
- Role: Finance User


## Module 3 — Finance Operations

This module adds a full finance workflow.

### Finance user tools added

- Finance overview
- Internal invoice/disbursement request queue
- Engagement letter records
- Invoice creation linked to:
  - Matter
  - Client
  - Engagement letter
- Manager approval queue for invoices
- Payment calendar
- Payment reminder schedule
- Payment reminder email drafting
- Mark reminder as sent
- Mark invoice approved / sent / paid

### Workflow

1. Law firm user submits internal invoice/disbursement request.
2. Finance user reviews the request.
3. Finance creates invoice linked to the matter and engagement letter.
4. Invoice starts as `pending_approval`.
5. Manager approves invoice.
6. Finance marks invoice as sent and contacts client.
7. Payment reminders are automatically scheduled around the due date.
8. Finance opens reminder email and marks reminder as sent.
9. Finance marks invoice as paid once payment is received.

### Automatic reminders

The system now automatically creates reminder records for:

- 7 days before due date
- 3 days before due date
- due date
- 3 days after due date

Actual background email sending requires a later email provider module such as SendGrid, Mailgun, Microsoft Graph, Gmail API, or SMTP through a secure server route.

### Database migration

If you already installed Module 2.1, run:

```text
supabase/migrations/module3_finance_operations.sql
```

in Supabase SQL Editor.


## Module 3.1 — VAT Invoicing

This module adds VAT handling to invoices.

### Default VAT treatment

- Professional fee: VAT applies by default
- Consultation: VAT applies by default
- Drafting fee: VAT applies by default
- Legal services: VAT applies by default
- Translation: VAT applies by default, but can be changed manually
- Court fee: No VAT by default
- Government fee: No VAT by default
- Notary fee: No VAT by default
- Other disbursement: No VAT by default, but can be changed manually

### Fields added

- VAT applicable
- VAT rate
- VAT amount
- Total amount

### Migration

Run this in Supabase SQL Editor:

```text
supabase/migrations/module3_1_vat_invoicing.sql
```

### Note

The app supports VAT defaults, but finance can manually change VAT on/off per invoice. This is important because some costs may be true disbursements while others may be reimbursements or taxable services.
