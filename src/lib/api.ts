/**
 * Flora Fusion — Centralized API Client & Backend Integration Configuration
 * 
 * Clean Domain Architecture:
 * UI / Components → Services → API Client (or Mock Fallback) → Spring Boot REST API
 * 
 * When NEXT_PUBLIC_API_URL is configured (e.g. http://localhost:8080/api/v1),
 * services can route requests to the Spring Boot backend.
 * Otherwise, services cleanly fall back to the local mock data layer.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const IS_BACKEND_CONFIGURED = Boolean(API_BASE_URL);

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Standard typed HTTP fetch wrapper with error handling for Spring Boot endpoints
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!IS_BACKEND_CONFIGURED) {
    throw new Error(
      "Backend API URL is not configured. Falling back to local data layer."
    );
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("flora_token") : null;
  const url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  
  // 5-second timeout during static page building, 15s in client browser
  const timeoutMs = typeof window === "undefined" ? 5000 : 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: options?.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message ||
          `API request failed with status ${response.status} (${response.statusText})`
      );
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
