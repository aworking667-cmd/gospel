-- The inbound-email edge function uses the service role key, which bypasses RLS.
-- No additional anon/authenticated INSERT policy is needed for inbound emails
-- because the service role has full access. The existing authenticated policies
-- already allow the admin to read/update/delete inbound emails.
--
-- This migration documents that inbound emails are inserted by the edge function
-- using the service role key (bypasses RLS), and the admin (authenticated role)
-- can read, update, and delete them via the existing policies.
SELECT 1;
