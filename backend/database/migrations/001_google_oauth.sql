BEGIN;

CREATE TABLE IF NOT EXISTS oauth_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  profile JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subject),
  UNIQUE (user_id, provider),
  CONSTRAINT oauth_identity_provider CHECK (provider IN ('google'))
);

CREATE INDEX IF NOT EXISTS oauth_identities_user
  ON oauth_identities (user_id);

DROP TRIGGER IF EXISTS oauth_identities_set_updated_at ON oauth_identities;
CREATE TRIGGER oauth_identities_set_updated_at
BEFORE UPDATE ON oauth_identities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
