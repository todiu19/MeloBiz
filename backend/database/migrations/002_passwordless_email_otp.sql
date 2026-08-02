BEGIN;

CREATE TABLE IF NOT EXISTS email_otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts SMALLINT NOT NULL DEFAULT 0,
  max_attempts SMALLINT NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  request_ip INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT email_otp_expiry_valid CHECK (expires_at > created_at),
  CONSTRAINT email_otp_attempts_valid
    CHECK (attempts >= 0 AND max_attempts > 0 AND attempts <= max_attempts)
);

CREATE INDEX IF NOT EXISTS email_otp_lookup
  ON email_otp_challenges (lower(email), created_at DESC);

DROP TABLE IF EXISTS password_reset_tokens;
ALTER TABLE app_users DROP COLUMN IF EXISTS password_hash;

COMMIT;
