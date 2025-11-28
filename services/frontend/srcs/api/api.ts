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

let refreshPromise: Promise<boolean> | null = null;

// to prevent race condition when refreshing the access token
// and "accidental" logout
async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch("/api/users/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        clearAccessToken();
        return false;
      }

      const data = await response.json();
      setAccessToken(data.token);
      return true;
    } catch {
      clearAccessToken();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
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

  if (options.body || !options.method || options.method === "GET") {
     headers["Content-Type"] = "application/json";
  }

  let response: Response = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    
    if (!refreshed) return response;

    response = await fetch(path, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  return response;
}
