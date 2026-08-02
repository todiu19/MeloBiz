export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  businessName: string;
  createdAt: string;
}

export interface CurrentUserResponse {
  success: boolean;
  data?: {
    user: CurrentUser;
  };
  message?: string;
}
