import type { DatabaseError } from "pg";
import { query, withTransaction } from "../config/database.js";
import type {
  CreateGoogleUserInput,
  CreateUserInput,
} from "../domain/dto/auth.dto.js";
import type { User } from "../domain/model/user.js";
import type { GoogleProfile } from "../types/google-profile.js";
import { normalizeEmail } from "../utils/string.utils.js";

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  business_name: string | null;
  created_at: Date;
}

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email này đã được sử dụng.");
    this.name = "DuplicateEmailError";
  }
}

function fromUserRow(row: UserRow): User {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    businessName: row.business_name ?? "",
    createdAt: row.created_at.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const result = await query<UserRow>(
    `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.created_at,
        b.display_name AS business_name
      FROM app_users u
      JOIN businesses b ON b.id = u.business_id
      WHERE lower(u.email) = $1
        AND u.status = 'active'
        AND u.membership_status = 'active'
      LIMIT 1
    `,
    [normalizeEmail(email)],
  );

  return result.rows[0] ? fromUserRow(result.rows[0]) : undefined;
}

export async function findUserById(id: string): Promise<User | undefined> {
  const result = await query<UserRow>(
    `
      SELECT u.id, u.full_name, u.email, u.created_at,
        b.display_name AS business_name
      FROM app_users u
      JOIN businesses b ON b.id = u.business_id
      WHERE u.id = $1
        AND u.status = 'active'
        AND u.membership_status = 'active'
    `,
    [id],
  );
  return result.rows[0] ? fromUserRow(result.rows[0]) : undefined;
}

export async function findOrLinkGoogleUser(
  identity: GoogleProfile,
): Promise<User | undefined> {
  const linked = await query<{ user_id: string }>(
    `
      SELECT user_id FROM oauth_identities
      WHERE provider = 'google' AND provider_subject = $1
    `,
    [identity.subject],
  );
  if (linked.rows[0]) return findUserById(linked.rows[0].user_id);

  const user = await findUserByEmail(identity.email);
  if (!user) return undefined;

  await query(
    `
      INSERT INTO oauth_identities (
        user_id, provider, provider_subject, email, email_verified, profile
      )
      VALUES ($1, 'google', $2, $3, true, $4)
      ON CONFLICT (provider, provider_subject) DO NOTHING
    `,
    [
      user.id,
      identity.subject,
      identity.email,
      JSON.stringify({ name: identity.name, picture: identity.picture }),
    ],
  );
  return user;
}

export async function createGoogleUser(
  input: CreateGoogleUserInput,
): Promise<User> {
  try {
    return await withTransaction(async (client) => {
      const businessResult = await client.query<{ id: string }>(
        `
          INSERT INTO businesses (legal_name, display_name, billing_email)
          VALUES ($1, $1, $2) RETURNING id
        `,
        [input.businessName.trim(), input.identity.email],
      );
      const business = businessResult.rows[0];
      if (!business) throw new Error("Không thể tạo doanh nghiệp.");

      const userResult = await client.query<UserRow>(
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
          VALUES ($1, $2, $3, 'owner', 'active', now(), now())
          RETURNING id, full_name, email, created_at,
            NULL::text AS business_name
        `,
        [
          business.id,
          normalizeEmail(input.identity.email),
          input.name.trim(),
        ],
      );
      const user = userResult.rows[0];
      if (!user) throw new Error("Không thể tạo tài khoản Google.");

      await client.query(
        `
          INSERT INTO oauth_identities (
            user_id, provider, provider_subject, email, email_verified, profile
          ) VALUES ($1, 'google', $2, $3, true, $4)
        `,
        [
          user.id,
          input.identity.subject,
          input.identity.email,
          JSON.stringify({
            name: input.identity.name,
            picture: input.identity.picture,
          }),
        ],
      );

      return fromUserRow({
        ...user,
        business_name: input.businessName.trim(),
      });
    });
  } catch (error) {
    if ((error as DatabaseError).code === "23505") {
      throw new DuplicateEmailError();
    }
    throw error;
  }
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const email = normalizeEmail(input.email);

  try {
    return await withTransaction(async (client) => {
      const businessResult = await client.query<{ id: string }>(
        `
          INSERT INTO businesses (legal_name, display_name, billing_email)
          VALUES ($1, $1, $2)
          RETURNING id
        `,
        [input.businessName.trim(), email],
      );
      const business = businessResult.rows[0];

      if (!business) {
        throw new Error("Không thể tạo doanh nghiệp.");
      }

      const userResult = await client.query<UserRow>(
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
          VALUES ($1, $2, $3, 'owner', 'active', now(), now())
          RETURNING
            id,
            full_name,
            email,
            created_at,
            NULL::text AS business_name
        `,
        [business.id, email, input.name.trim()],
      );
      const userRow = userResult.rows[0];

      if (!userRow) {
        throw new Error("Không thể tạo tài khoản.");
      }

      return fromUserRow({
        ...userRow,
        business_name: input.businessName.trim(),
      });
    });
  } catch (error) {
    if ((error as DatabaseError).code === "23505") {
      throw new DuplicateEmailError();
    }
    throw error;
  }
}

export async function recordLogin(userId: string): Promise<void> {
  await query(
    "UPDATE app_users SET last_login_at = now() WHERE id = $1",
    [userId],
  );
}
