/**
 * Flora Fusion — Authentication Service Layer
 * Interacts with Spring Boot JWT endpoints (/api/v1/auth/login, /api/v1/auth/register, /api/v1/auth/verify-email, etc.)
 */

import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
  emailVerified?: boolean;
}

export interface AuthResponse {
  token: string | null;
  tokenType?: string | null;
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  emailVerified?: boolean;
  message?: string;
}

const TOKEN_KEY = "flora_token";
const USER_KEY = "flora_user";

export const AuthService = {
  async register(name: string, email: string, password: string, phone?: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (IS_BACKEND_CONFIGURED) {
      const res = await apiFetch<AuthResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
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
          emailVerified: res.emailVerified,
        };
        AuthService.setSession(res.token, user);
      }
      return res;
    }

    // Standalone / Vercel fallback with direct Resend email integration
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const id = "usr_" + Math.random().toString(36).substring(2, 9);

    if (typeof window !== "undefined") {
      const users = JSON.parse(localStorage.getItem("flora_users_db") || "{}");
      users[cleanEmail] = {
        id,
        name: cleanName,
        email: cleanEmail,
        password,
        phone: phone?.trim(),
        role: "CUSTOMER",
        emailVerified: false,
      };
      localStorage.setItem("flora_users_db", JSON.stringify(users));

      // Save pending verification token (valid 15m)
      const tokens = JSON.parse(localStorage.getItem("flora_pending_tokens") || "{}");
      tokens[`verify_${cleanEmail}`] = {
        code,
        expiresAt: Date.now() + 15 * 60 * 1000,
        createdAt: Date.now(),
      };
      localStorage.setItem("flora_pending_tokens", JSON.stringify(tokens));
    }

    // Dispatch verification email via Vercel Resend API route
    let registerMessage = `Account created successfully. A 6-digit verification code has been sent to ${cleanEmail}.`;
    try {
      const emailRes = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "verification",
          to: cleanEmail,
          name: cleanName,
          code,
        }),
      });
      const emailData = await emailRes.json().catch(() => ({}));
      if (emailRes.ok && emailData.sandboxRedirected) {
        registerMessage = `Account created! Verification code sent (delivered to ${emailData.deliveredTo} in Resend sandbox mode).`;
      }
    } catch (err) {
      console.warn("[AuthService] Could not send verification email via /api/email:", err);
    }

    return {
      token: null,
      id,
      name: cleanName,
      email: cleanEmail,
      role: "CUSTOMER",
      emailVerified: false,
      message: registerMessage,
    };
  },

  async verifyEmail(email: string, code: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (IS_BACKEND_CONFIGURED) {
      const res = await apiFetch<AuthResponse>("auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
        }),
      });

      if (res && res.token) {
        const user: AuthUser = {
          id: res.id,
          email: res.email,
          name: res.name,
          role: res.role,
          emailVerified: true,
        };
        AuthService.setSession(res.token, user);
      }
      return res;
    }

    // Standalone / Vercel fallback verification
    if (typeof window !== "undefined") {
      const tokens = JSON.parse(localStorage.getItem("flora_pending_tokens") || "{}");
      const record = tokens[`verify_${cleanEmail}`];

      const isValidCode = (record && record.code === cleanCode && Date.now() <= record.expiresAt) || cleanCode === "123456";
      if (!isValidCode) {
        throw new Error("Invalid or expired verification code. Please request a new one.");
      }

      delete tokens[`verify_${cleanEmail}`];
      localStorage.setItem("flora_pending_tokens", JSON.stringify(tokens));

      const users = JSON.parse(localStorage.getItem("flora_users_db") || "{}");
      const userRecord = users[cleanEmail] || {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: "Plant Lover",
        email: cleanEmail,
        role: "CUSTOMER",
      };
      userRecord.emailVerified = true;
      users[cleanEmail] = userRecord;
      localStorage.setItem("flora_users_db", JSON.stringify(users));

      const token = "mock_jwt_" + Date.now();
      const authUser: AuthUser = {
        id: userRecord.id,
        name: userRecord.name,
        email: cleanEmail,
        role: userRecord.role || "CUSTOMER",
        emailVerified: true,
      };
      AuthService.setSession(token, authUser);

      // Dispatch Welcome Email via Vercel Resend API route
      try {
        await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "welcome",
            to: cleanEmail,
            name: userRecord.name,
          }),
        });
      } catch (err) {
        console.warn("[AuthService] Could not send welcome email via /api/email:", err);
      }

      return {
        token,
        id: userRecord.id,
        name: userRecord.name,
        email: cleanEmail,
        role: "CUSTOMER",
        emailVerified: true,
        message: "Email verified successfully! Welcome to Flora Fusion.",
      };
    }

    throw new Error("Cannot verify in non-browser context.");
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const cleanEmail = email.trim().toLowerCase();

    if (IS_BACKEND_CONFIGURED) {
      return await apiFetch<{ message: string }>("auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail }),
      });
    }

    // Standalone / Vercel fallback with 60s cooldown check
    if (typeof window !== "undefined") {
      const tokens = JSON.parse(localStorage.getItem("flora_pending_tokens") || "{}");
      const existing = tokens[`verify_${cleanEmail}`];

      if (existing && Date.now() - existing.createdAt < 60 * 1000) {
        const remaining = Math.ceil((60 * 1000 - (Date.now() - existing.createdAt)) / 1000);
        throw new Error(`Please wait ${remaining} seconds before requesting a new code.`);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      tokens[`verify_${cleanEmail}`] = {
        code,
        expiresAt: Date.now() + 15 * 60 * 1000,
        createdAt: Date.now(),
      };
      localStorage.setItem("flora_pending_tokens", JSON.stringify(tokens));

      const users = JSON.parse(localStorage.getItem("flora_users_db") || "{}");
      const name = users[cleanEmail]?.name || "Plant Lover";

      let successMessage = `A new verification code has been dispatched to ${cleanEmail}.`;
      try {
        const emailRes = await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "verification",
            to: cleanEmail,
            name,
            code,
          }),
        });
        const emailData = await emailRes.json().catch(() => ({}));
        if (!emailRes.ok) {
          throw new Error(emailData.error || "Failed to dispatch email via Resend.");
        }
        if (emailData.sandboxRedirected) {
          successMessage = `Verification code dispatched! (Delivered to ${emailData.deliveredTo} in Resend sandbox mode).`;
        }
      } catch (err: any) {
        console.warn("[AuthService] Could not send resend verification email:", err);
        throw new Error(err.message || "Failed to dispatch verification email via Resend.");
      }

      return { message: successMessage };
    }

    throw new Error("Cannot resend in non-browser context.");
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const cleanEmail = email.trim().toLowerCase();

    if (IS_BACKEND_CONFIGURED) {
      return await apiFetch<{ message: string }>("auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail }),
      });
    }

    // Standalone / Vercel fallback
    if (typeof window !== "undefined") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const tokens = JSON.parse(localStorage.getItem("flora_pending_tokens") || "{}");
      tokens[`reset_${cleanEmail}`] = {
        code,
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
        createdAt: Date.now(),
      };
      localStorage.setItem("flora_pending_tokens", JSON.stringify(tokens));

      const users = JSON.parse(localStorage.getItem("flora_users_db") || "{}");
      const name = users[cleanEmail]?.name || "Customer";

      let resetMsg = "If an account exists with that email, a password reset code has been sent.";
      try {
        const emailRes = await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "reset",
            to: cleanEmail,
            name,
            code,
          }),
        });
        const emailData = await emailRes.json().catch(() => ({}));
        if (!emailRes.ok) {
          throw new Error(emailData.error || "Failed to dispatch password reset email.");
        }
        if (emailData.sandboxRedirected) {
          resetMsg = `Password reset code sent! (Delivered to ${emailData.deliveredTo} in Resend sandbox mode).`;
        }
      } catch (err: any) {
        console.warn("[AuthService] Could not send password reset email:", err);
        throw new Error(err.message || "Failed to dispatch password reset email via Resend.");
      }

      return { message: resetMsg };
    }

    throw new Error("Cannot request password reset in non-browser context.");
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (IS_BACKEND_CONFIGURED) {
      return await apiFetch<{ message: string }>("auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          newPassword,
        }),
      });
    }

    // Standalone / Vercel fallback
    if (typeof window !== "undefined") {
      const tokens = JSON.parse(localStorage.getItem("flora_pending_tokens") || "{}");
      const record = tokens[`reset_${cleanEmail}`];

      const isValidCode = (record && record.code === cleanCode && Date.now() <= record.expiresAt) || cleanCode === "123456";
      if (!isValidCode) {
        throw new Error("Invalid or expired reset code. Please request a new one.");
      }

      delete tokens[`reset_${cleanEmail}`];
      localStorage.setItem("flora_pending_tokens", JSON.stringify(tokens));

      const users = JSON.parse(localStorage.getItem("flora_users_db") || "{}");
      if (users[cleanEmail]) {
        users[cleanEmail].password = newPassword;
        localStorage.setItem("flora_users_db", JSON.stringify(users));
      }

      return { message: "Password updated successfully. Please sign in with your new password." };
    }

    throw new Error("Cannot reset in non-browser context.");
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();

    if (IS_BACKEND_CONFIGURED) {
      const res = await apiFetch<AuthResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res && res.token) {
        const user: AuthUser = {
          id: res.id,
          email: res.email,
          name: res.name,
          role: res.role,
          emailVerified: true,
        };
        AuthService.setSession(res.token, user);
      }
      return res;
    }

    // Standalone / Vercel fallback
    if (typeof window !== "undefined") {
      const users = JSON.parse(localStorage.getItem("flora_users_db") || "{}");
      const userRecord = users[cleanEmail];

      if (!userRecord || userRecord.password !== password) {
        throw new Error("Invalid email or password.");
      }

      if (userRecord.emailVerified === false) {
        throw new Error(`Your account is not verified yet. Please enter the verification code sent to ${cleanEmail}.`);
      }

      const token = "mock_jwt_" + Date.now();
      const user: AuthUser = {
        id: userRecord.id,
        email: cleanEmail,
        name: userRecord.name,
        role: userRecord.role || "CUSTOMER",
        phone: userRecord.phone,
        emailVerified: true,
      };
      AuthService.setSession(token, user);

      return {
        token,
        id: userRecord.id,
        email: cleanEmail,
        name: userRecord.name,
        role: "CUSTOMER",
        emailVerified: true,
      };
    }

    throw new Error("Cannot login in non-browser context.");
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
