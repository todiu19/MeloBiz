import { query } from "../config/database.js";
import type { PricingPlan } from "../domain/model/public.js";
import type { ContactRequestInput } from "../domain/dto/public.dto.js";

interface PlanRow {
  name: string;
  price: string;
  currency: string;
  billing_interval: "month" | "year";
  trial_days: number;
}

export async function findActivePlan(): Promise<PricingPlan | undefined> {
  const result = await query<PlanRow>(
    `
      SELECT name, price, currency, billing_interval, trial_days
      FROM plans
      WHERE is_active = true
      ORDER BY
        CASE billing_interval WHEN 'month' THEN 1 ELSE 2 END,
        price
      LIMIT 1
    `,
  );
  const plan = result.rows[0];
  if (!plan) return undefined;

  return {
    name: plan.name,
    price: Number(plan.price),
    currency: plan.currency,
    billingInterval: plan.billing_interval,
    trialDays: plan.trial_days,
  };
}

export async function createContactRequest(
  input: ContactRequestInput,
): Promise<void> {
  await query(
    `
      INSERT INTO contact_requests (name, email, message)
      VALUES ($1, $2, $3)
    `,
    [
      input.name.trim(),
      input.email.trim().toLowerCase(),
      input.message.trim(),
    ],
  );
}
