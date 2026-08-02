import type { PricingPlan } from "../domain/model/public.js";
import type {
  ContactRequestInput,
  PricingPlanResponseDto,
} from "../domain/dto/public.dto.js";
import * as publicRepository from "../data/public.repository.js";

export async function getActivePlan(): Promise<
  PricingPlanResponseDto | undefined
> {
  const plan: PricingPlan | undefined =
    await publicRepository.findActivePlan();
  if (!plan) return undefined;
  return {
    name: plan.name,
    price: plan.price,
    currency: plan.currency,
    billingUnit:
      plan.billingInterval === "month"
        ? "điểm phát/tháng"
        : "điểm phát/năm",
    trialDays: plan.trialDays,
    vatIncluded: false,
  };
}

export function submitContactRequest(
  input: ContactRequestInput,
): Promise<void> {
  return publicRepository.createContactRequest(input);
}
