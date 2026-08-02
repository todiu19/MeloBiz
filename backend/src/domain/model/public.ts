export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  billingInterval: "month" | "year";
  trialDays: number;
}
