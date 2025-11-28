import { setAccessToken, clearAccessToken } from "@/api/tokenStorage";
import { api, getErrorMessage } from "./api";

export async function signup(username: string, password: string) {
  const response: Response = await api("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));

  try {
    const data = await response.json();
	console.log("token: ", data.token);
    setAccessToken(data.token);
  } catch (err) {
    throw err;
  }
}

export async function login(username: string, password: string, totp?: string) {
  const response: Response = await api("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ username, password, totp }),
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
