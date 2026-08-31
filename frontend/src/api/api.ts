const API_BASE_URL =
  "http://localhost:8080";


export function getToken(): string | null {
  return localStorage.getItem(
    "careerpilot_token"
  );
}


export function setToken(
  token: string
): void {
  localStorage.setItem(
    "careerpilot_token",
    token
  );
}


export function removeToken(): void {
  localStorage.removeItem(
    "careerpilot_token"
  );
}


export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {

  const token = getToken();

  const headers = new Headers(
    options.headers
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  return fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );
}