const TOKEN_KEY = "accessToken";

export function setAccessToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
	return localStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
	localStorage.removeItem(TOKEN_KEY);
}
