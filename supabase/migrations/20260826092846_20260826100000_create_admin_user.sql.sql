-- Create the admin user so login is possible.
-- The "Database error querying schema" was caused by the missing pgjwt extension
-- (already fixed in the prior migration). This creates the actual admin account.

-- We insert directly into auth.users using the same bcrypt-based hashing
-- that Supabase Auth (GoTrue) uses, so signInWithPassword() will work.
-- Default credentials: admin@inhimdaily.org / InHimDaily2026!
-- The user should change this password after first login.

DO $$
DECLARE
  admin_email text := 'admin@inhimdaily.org';
  admin_password text := 'InHimDaily2026!';
  user_uuid uuid := gen_random_uuid();
BEGIN
  -- Check if admin user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    INSERT INTO auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      user_uuid,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{}'::jsonb,
      '{}'::jsonb,
      '',
      '',
      '',
      ''
    );

    -- Also create the identity link
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider_id,
      provider,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      user_uuid,
      jsonb_build_object('sub', user_uuid::text, 'email', admin_email),
      user_uuid::text,
      'email',
      now(),
      now()
    );
  END IF;
END $$;
