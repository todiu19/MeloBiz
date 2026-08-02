import type { User } from "../model/user.js";
import type { GoogleProfile } from "../../types/google-profile.js";

export interface CreateUserInput {
  name: string;
  email: string;
  businessName: string;
}

export interface CreateGoogleUserInput {
  identity: GoogleProfile;
  name: string;
  businessName: string;
}

export interface RequestEmailOtpDto {
  email: string;
}

export interface VerifyEmailOtpDto {
  email: string;
  code: string;
}

export interface CompleteOnboardingDto {
  name: string;
  businessName: string;
}

export type PublicUserDto = Pick<
  User,
  "id" | "name" | "email" | "businessName" | "createdAt"
>;
