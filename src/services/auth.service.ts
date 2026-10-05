/**
 * Flora Fusion — Authentication Service Layer
 * Interacts with Spring Boot JWT endpoints (/api/v1/auth/login, /api/v1/auth/me)
 */

import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
}

const TOKEN_KEY = "flora_token";
const USER_KEY = "flora_user";

export const AuthService = {
  async register(name: string, email: string, password: string, phone?: string): Promise<AuthResponse> {
    if (!IS_BACKEND_CONFIGURED) {
      throw new Error("Backend API is not configured.");
    }

    const res = await apiFetch<AuthResponse>("auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone?.trim() || undefined,
      }),
    });

    if (res && res.token) {
      const user: AuthUser = {
        id: res.id,
        email: res.email,
        name: res.name,
        role: res.role,
        phone: phone?.trim(),
      };
      AuthService.setSession(res.token, user);
    }

    return res;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    if (!IS_BACKEND_CONFIGURED) {
      throw new Error("Backend API is not configured.");
    }

    const res = await apiFetch<AuthResponse>("auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (res && res.token) {
      const user: AuthUser = {
        id: res.id,
        email: res.email,
        name: res.name,
        role: res.role,
      };
      AuthService.setSession(res.token, user);
    }

    return res;
  },

  async getMe(): Promise<AuthUser | null> {
    if (!IS_BACKEND_CONFIGURED) return null;
    const token = AuthService.getToken();
    if (!token) return null;

    try {
      return await apiFetch<AuthUser>("auth/me");
    } catch {
      AuthService.clearSession();
      return null;
    }
  },

  setSession(token: string, user: AuthUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
};
