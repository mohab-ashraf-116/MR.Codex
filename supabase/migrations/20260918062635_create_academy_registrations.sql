/*
# Create academy registrations (single-tenant, no sign-in)

1. New Tables
- `academy_registrations` stores public course interest submissions.
- `id` is the generated identifier.
- `full_name`, `email`, `phone`, and `course` contain the learner's registration details.
- `message` stores an optional note from the learner.
- `created_at` records when the request was received.

2. Security
- Row-level security is enabled.
- Anonymous visitors may insert valid registration requests.
- Registration details are never readable, editable, or deletable through the public browser client.

3. Important Notes
- This is intentionally a no-sign-in intake form for a single academy website.
- Basic length and email checks protect the public submission boundary.
*/

CREATE TABLE IF NOT EXISTS public.academy_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND position('@' IN email) > 1),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
  course text NOT NULL CHECK (char_length(course) BETWEEN 2 AND 120),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.academy_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit academy registrations" ON public.academy_registrations;
CREATE POLICY "Public can submit academy registrations"
ON public.academy_registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public cannot read academy registrations" ON public.academy_registrations;
CREATE POLICY "Public cannot read academy registrations"
ON public.academy_registrations FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Public cannot update academy registrations" ON public.academy_registrations;
CREATE POLICY "Public cannot update academy registrations"
ON public.academy_registrations FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot delete academy registrations" ON public.academy_registrations;
CREATE POLICY "Public cannot delete academy registrations"
ON public.academy_registrations FOR DELETE
TO anon, authenticated
USING (false);
