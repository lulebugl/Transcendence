import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenStorage";

/**
 * Wrapper around api() that automatically throws on errors and returns typed data.
 * Use this for most API calls to reduce boilerplate.
 */
export async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await api(path, options);

  if (!response.ok) {
    let errorMessage: string;
    try {
      const data = await response.json();
      errorMessage =
        data.message || data.error || response.statusText || "Request failed";
    } catch {
      errorMessage = response.statusText || "Request failed";
    }
    throw new Error(errorMessage);
  }

  const contentLength = response.headers.get("Content-Length");
  if (response.status === 204 || contentLength === "0") {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
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

  // this is to update the "online" status of a user
  // not ideal because it doubles the requests but it works for now
  if (token) {
    await fetch("/api/users/lastCall", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "PATCH",
      credentials: "include",
    });
  }

  if (options.body && !(options.body instanceof FormData)) {
    if (
      !options.method ||
      options.method === "GET" ||
      typeof options.body === "string"
    ) {
      headers["Content-Type"] = "application/json";
    }
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
