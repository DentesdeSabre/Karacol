Supabase setup for Karacol & Linha

1) Create a new Supabase project at https://app.supabase.com

2) In the SQL editor, run the SQL in `sql/schema.sql` to create `recipes` and `showcase` tables.

3) Create a storage bucket named `karacol-assets` (private). We'll store images here and use signed URLs.

4) Enable Row Level Security (RLS) for tables and add policies:
   - Allow authenticated users (admins) to insert/update/delete their own rows.
   - For admin-only dashboard, create an `is_admin` claim or maintain a small `profiles` table marking admin users.

5) Create a service role key (in Project Settings → API) and store it in `SUPABASE_SERVICE_ROLE_KEY` (server-only).
   Keep `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for browser usage.

6) Storage: set CORS and file size limits. Use signed URLs for private access.

7) Optional: create a `profiles` table to store `is_admin` boolean and link to `auth.users`.

8) After creating tables, test queries in SQL editor and assign privileges via policies.
