import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenStorage";

export async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return (
      data.message || data.error || response.statusText || "Request failed"
    );
  } catch {
    return response.statusText || "Request failed";
  }
}

export async function api(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only add Content-Type: application/json if there is a body, or if specifically requested
  // Otherwise, empty POSTs like logout fail because Fastify expects a JSON body
  if (options.body || !options.method || options.method === "GET") {
     headers["Content-Type"] = "application/json";
  }

  let response: Response = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    // token expired
    const refreshResponse = await fetch("/api/users/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      clearAccessToken();
      return response;
    }

    const data = await refreshResponse.json();
    setAccessToken(data.token);

    const retryHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
      Authorization: `Bearer ${getAccessToken()}`,
    };

    response = await fetch(path, {
      ...options,
      headers: retryHeaders,
      credentials: "include",
    });
  }
  return response;
}
