import { auth } from "./firebase/config";

const API_BASE = "http://localhost:5000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
  ? {}
  : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}