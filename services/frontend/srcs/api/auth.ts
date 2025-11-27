import { setAccessToken, clearAccessToken } from "./tokenStorage";
import { api } from "./api";

export async function login(username: string, password: string, totp: number) {
  const response: Response = await api("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ username, password, totp })
  });

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json();
  setAccessToken(data.token);

  return data;
}

export async function logout() {
  clearAccessToken();
  await api("/api/users/refresh/logout", { method: "POST", credentials: "include" });
}
