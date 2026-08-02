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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'business_members'::regclass
      AND conname = 'business_members_one_business_per_user'
  ) THEN
    ALTER TABLE business_members
      ADD CONSTRAINT business_members_one_business_per_user UNIQUE (user_id);
  END IF;
END;
$$;

COMMIT;
