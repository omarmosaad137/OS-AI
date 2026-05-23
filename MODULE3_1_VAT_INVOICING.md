# Module 3.1 VAT Invoicing

Run:

supabase/migrations/module3_1_vat_invoicing.sql

Then update app files and restart.

## Logic

Professional / legal service invoices:
- VAT applicable by default
- VAT rate 5%

Court / government disbursement invoices:
- No VAT by default

Translation / expert / other:
- configurable by finance user

## Invoice table fields

- amount = subtotal
- vat_applicable
- vat_rate
- vat_amount
- total_amount
