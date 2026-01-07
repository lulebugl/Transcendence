import { setAccessToken, clearAccessToken } from "@/api/tokenStorage";
import { apiRequest } from "./api";
import { LoginResponse } from "@/api/types";

export async function signup(username: string, password: string, email: string) {
  const data = await apiRequest<{ token: string }>("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ username, password, email }),
  });

  setAccessToken(data.token);
}

export async function login(identifier: string, password: string, totp?: string) {
  const data = await apiRequest<LoginResponse>("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password, totp }),
  });

  if ("token" in data) {
    setAccessToken(data.token);
  }
  return data;
}

export async function logout() {
  await apiRequest<void>("/api/users/refresh/logout", { method: "POST" });
  clearAccessToken();
}
