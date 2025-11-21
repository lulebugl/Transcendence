import { setAccessToken, clearAccessToken } from "./tokenStorage";
import { api, getErrorMessage } from "./api";

export async function login(username: string, password: string) {
  const response: Response = await api("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));

  const data = await response.json();
  setAccessToken(data.token);

  return data;
}

export async function logout() {
  clearAccessToken();
  await api("/api/users/logout", { method: "POST" });
}
