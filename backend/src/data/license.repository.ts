import { query } from "../config/database.js";
import type { MusicLicense } from "../domain/model/license.js";

interface LicenseRow {
  code: string;
  tax_code: string | null;
  business_name: string;
  location_name: string;
  scope: string;
  effective_status: MusicLicense["status"];
  valid_from: string;
  valid_until: string;
}

export async function findLicense(
  lookupValue: string,
): Promise<MusicLicense | undefined> {
  const result = await query<LicenseRow>(
    `
      SELECT
        ml.code,
        b.tax_code,
        b.legal_name AS business_name,
        l.name AS location_name,
        ml.scope,
        CASE
          WHEN ml.status = 'revoked' THEN 'revoked'
          WHEN ml.valid_until < current_date THEN 'expired'
          ELSE ml.status::text
        END AS effective_status,
        ml.valid_from::text,
        ml.valid_until::text
      FROM music_licenses ml
      JOIN businesses b ON b.id = ml.business_id
      JOIN locations l ON l.id = ml.location_id
      WHERE upper(ml.code) = upper($1)
        OR b.tax_code = $1
      ORDER BY
        CASE ml.status
          WHEN 'active' THEN 1
          WHEN 'expired' THEN 2
          ELSE 3
        END,
        ml.valid_until DESC
      LIMIT 1
    `,
    [lookupValue.trim()],
  );
  const row = result.rows[0];

  if (!row) return undefined;

  return {
    code: row.code,
    taxCode: row.tax_code,
    businessName: row.business_name,
    locationName: row.location_name,
    scope: row.scope,
    status: row.effective_status,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
  };
}
