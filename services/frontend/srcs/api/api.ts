import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStorage";

export async function api(path: string, options: RequestInit = {}): Promise<Response> {
	let token = getAccessToken();

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string> || {}),
		...(token ? { "Authorization": `Bearer ${token}` } : {}),
	};

	let response: Response = await fetch(path, { ...options, headers, credentials: "include" });

	if (response.status === 401) { // token expired
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
			...(options.headers as Record<string, string> || {}),
			"Authorization": `Bearer ${getAccessToken()}`,
		};

		response = await fetch(path, { 
			...options, 
			headers: retryHeaders,
			credentials: "include",
		});
	}
	return response;
}
