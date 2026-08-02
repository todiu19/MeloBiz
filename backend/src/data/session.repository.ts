import { query } from "../config/database.js";

export async function createSessionRecord(
  userId: string,
  tokenHash: string,
  expiresInSeconds: number,
): Promise<void> {
  await query(
    `
      INSERT INTO auth_sessions (user_id, token_hash, expires_at)
      VALUES ($1, $2, now() + ($3 * interval '1 second'))
    `,
    [userId, tokenHash, expiresInSeconds],
  );
}

export async function findActiveSessionUserId(
  tokenHash: string,
  userId: string,
): Promise<string | undefined> {
  const result = await query<{ user_id: string }>(
    `
      SELECT session.user_id
      FROM auth_sessions session
      JOIN app_users user_account ON user_account.id = session.user_id
      WHERE session.token_hash = $1
        AND session.user_id = $2
        AND session.revoked_at IS NULL
        AND session.expires_at > now()
        AND user_account.status = 'active'
      LIMIT 1
    `,
    [tokenHash, userId],
  );
  return result.rows[0]?.user_id;
}

export async function revokeSessionByTokenHash(
  tokenHash: string,
): Promise<void> {
  await query(
    `
      UPDATE auth_sessions
      SET revoked_at = now()
      WHERE token_hash = $1
        AND revoked_at IS NULL
    `,
    [tokenHash],
  );
}
