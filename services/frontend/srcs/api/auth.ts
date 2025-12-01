import { setAccessToken, clearAccessToken } from "@/api/tokenStorage";
import { apiRequest } from "./api";
import { LoginResponse } from "@/api/types";

export async function signup(username: string, password: string) {
  const data = await apiRequest<{ token: string }>("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  setAccessToken(data.token);
}

export async function login(username: string, password: string, totp?: string) {
  const data = await apiRequest<LoginResponse>("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ username, password, totp }),
  });

  if ("token" in data) {
    setAccessToken(data.token);
  }
  return data;
}

export async function logout() {
  await apiRequest<void>("/api/users/logout", { method: "POST" });
  clearAccessToken();
}
