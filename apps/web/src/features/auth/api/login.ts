import { apiFetch } from "@/shared/api/client";

export interface LoginRequest {
  email: string;
  password: string;
}

export function login(data: LoginRequest) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
