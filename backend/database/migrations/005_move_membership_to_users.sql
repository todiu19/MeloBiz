BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM business_members
    GROUP BY user_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Không thể áp dụng migration: có user đang thuộc nhiều doanh nghiệp.';
  END IF;
END;
$$;

ALTER TABLE app_users
  ADD COLUMN business_id UUID,
  ADD COLUMN role member_role,
  ADD COLUMN membership_status membership_status,
  ADD COLUMN invited_by UUID,
  ADD COLUMN joined_at TIMESTAMPTZ;

UPDATE app_users u
SET
  business_id = bm.business_id,
  role = bm.role,
  membership_status = bm.status,
  invited_by = bm.invited_by,
  joined_at = COALESCE(bm.joined_at, bm.created_at)
FROM business_members bm
WHERE bm.user_id = u.id;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM app_users
    WHERE business_id IS NULL
  ) THEN
    RAISE EXCEPTION
      'Không thể áp dụng migration: có app_user chưa thuộc doanh nghiệp.';
  END IF;
END;
$$;

ALTER TABLE app_users
  ALTER COLUMN business_id SET NOT NULL,
  ALTER COLUMN role SET DEFAULT 'staff',
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN membership_status SET DEFAULT 'active',
  ALTER COLUMN membership_status SET NOT NULL,
  ALTER COLUMN joined_at SET DEFAULT now(),
  ALTER COLUMN joined_at SET NOT NULL,
  ADD CONSTRAINT app_users_business_id_fkey
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE RESTRICT,
  ADD CONSTRAINT app_users_invited_by_fkey
    FOREIGN KEY (invited_by) REFERENCES app_users(id) ON DELETE SET NULL;

DROP TABLE business_members;

CREATE INDEX app_users_business
  ON app_users (business_id);

CREATE UNIQUE INDEX one_active_owner_per_business
  ON app_users (business_id)
  WHERE role = 'owner'
    AND membership_status = 'active';

COMMIT;
