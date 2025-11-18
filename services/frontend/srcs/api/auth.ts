import { setAccessToken, clearAccessToken } from "./tokenStorage";
import { api } from "./api";

export async function login(email: string, password: string) {
  const response: Response = await api("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json();
  setAccessToken(data.token);

  return data;
}

export async function logout() {
  clearAccessToken();
  await api("/api/users/logout", { method: "POST" });
}
