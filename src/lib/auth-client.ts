// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  fetchOptions: { credentials: "include" },
});

export const {
  useSession,
  getSession,
} = authClient;