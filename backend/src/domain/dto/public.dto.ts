export interface ContactRequestInput {
  name: string;
  email: string;
  message: string;
}

export interface PricingPlanResponseDto {
  name: string;
  price: number;
  currency: string;
  billingUnit: "điểm phát/tháng" | "điểm phát/năm";
  trialDays: number;
  vatIncluded: boolean;
}
