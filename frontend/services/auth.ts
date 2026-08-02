import type { CurrentUser, CurrentUserResponse } from "@/types/auth";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const response = await fetch(`${apiUrl}/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error("Không thể đọc thông tin tài khoản.");
  }

  const result = (await response.json()) as CurrentUserResponse;
  return result.data?.user ?? null;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${apiUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Không thể đăng xuất. Vui lòng thử lại.");
  }
}
