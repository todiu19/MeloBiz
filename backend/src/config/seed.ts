import type { PoolClient } from "pg";
import { config } from "./index.js";
import { withTransaction } from "./database.js";

async function findOrCreateDemoAccount(client: PoolClient) {
  const existing = await client.query<{ id: string; business_id: string }>(
    `
      SELECT id, business_id
      FROM app_users
      WHERE lower(email) = 'demo@melobiz.vn'
    `,
  );

  if (existing.rows[0]) {
    return {
      userId: existing.rows[0].id,
      businessId: existing.rows[0].business_id,
    };
  }

  const businessResult = await client.query<{ id: string }>(
    `
      INSERT INTO businesses (
        legal_name,
        display_name,
        tax_code,
        billing_email,
        city
      )
      VALUES (
        'Công ty TNHH Cà phê Ban Mai',
        'Cà phê Ban Mai',
        '0101234567',
        'demo@melobiz.vn',
        'TP. Hồ Chí Minh'
      )
      RETURNING id
    `,
  );
  const business = businessResult.rows[0];
  if (!business) throw new Error("Không thể tạo doanh nghiệp demo.");

  const userResult = await client.query<{ id: string }>(
    `
      INSERT INTO app_users (
        business_id,
        email,
        full_name,
        role,
        membership_status,
        joined_at,
        email_verified_at
      )
      VALUES (
        $1,
        'demo@melobiz.vn',
        'MeloBiz Demo',
        'owner',
        'active',
        now(),
        now()
      )
      RETURNING id
    `,
    [business.id],
  );
  const user = userResult.rows[0];
  if (!user) throw new Error("Không thể tạo tài khoản demo.");

  return { userId: user.id, businessId: business.id };
}

async function findOrCreateDemoLocation(
  client: PoolClient,
  businessId: string,
) {
  const existing = await client.query<{ id: string }>(
    `
      SELECT id
      FROM locations
      WHERE business_id = $1
        AND code = 'BAN-MAI-Q1'
      LIMIT 1
    `,
    [businessId],
  );

  if (existing.rows[0]) return existing.rows[0].id;

  const created = await client.query<{ id: string }>(
    `
      INSERT INTO locations (
        business_id,
        industry_id,
        code,
        name,
        address_line,
        city
      )
      SELECT
        $1,
        i.id,
        'BAN-MAI-Q1',
        'Cà phê Ban Mai - Quận 1',
        '01 Đường Demo, Quận 1',
        'TP. Hồ Chí Minh'
      FROM industries i
      WHERE i.slug = 'quan-ca-phe'
      RETURNING id
    `,
    [businessId],
  );

  if (!created.rows[0]) throw new Error("Không thể tạo điểm phát demo.");
  return created.rows[0].id;
}

async function ensureDemoSubscription(
  client: PoolClient,
  locationId: string,
) {
  await client.query(
    `
      INSERT INTO subscriptions (
        location_id,
        plan_id,
        status,
        trial_starts_at,
        trial_ends_at,
        current_period_starts_at,
        current_period_ends_at
      )
      SELECT
        $1,
        p.id,
        'trialing',
        now(),
        now() + interval '14 days',
        now(),
        now() + interval '14 days'
      FROM plans p
      WHERE p.code = 'melobiz-pro-monthly'
        AND NOT EXISTS (
          SELECT 1
          FROM subscriptions s
          WHERE s.location_id = $1
            AND s.status IN ('trialing', 'active', 'past_due')
        )
    `,
    [locationId],
  );
}

async function ensureDemoLicense(
  client: PoolClient,
  businessId: string,
  locationId: string,
) {
  await client.query(
    `
      INSERT INTO music_licenses (
        code,
        business_id,
        location_id,
        subscription_id,
        scope,
        status,
        valid_from,
        valid_until
      )
      SELECT
        'MELO-2026-001',
        $1,
        $2,
        s.id,
        'Phát công khai tại một điểm kinh doanh',
        'active',
        current_date,
        current_date + 365
      FROM subscriptions s
      WHERE s.location_id = $2
        AND s.status IN ('trialing', 'active', 'past_due')
      ORDER BY s.created_at DESC
      LIMIT 1
      ON CONFLICT (code) DO NOTHING
    `,
    [businessId, locationId],
  );
}

export async function seedDevelopmentData(): Promise<void> {
  if (!config.seedDemoData) return;

  await withTransaction(async (client) => {
    const { businessId } = await findOrCreateDemoAccount(client);
    const locationId = await findOrCreateDemoLocation(client, businessId);
    await ensureDemoSubscription(client, locationId);
    await ensureDemoLicense(client, businessId, locationId);
  });
}
