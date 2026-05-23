# Module 2 Permissions

## Law Firm User

The law firm user should have broad operational visibility but no commercial/finance access.

Allowed:
- Clients
- All matters
- Invoice requests
- Operational matter data

Blocked:
- Leads
- Professional fee
- Finance dashboard
- Engagement letters
- User management
- Audit

## Invoice Request Flow

Law firm user submits:
- matter
- request type
- amount
- currency
- urgency
- description

Manager reviews:
- pending
- approved
- rejected
- paid
- cancelled

## Database Migration

Run:

supabase/migrations/module2_permissions_invoice_requests.sql
