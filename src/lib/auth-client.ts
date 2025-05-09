// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// You can also export these methods directly
export const { 
  useSession, 
  getSession 
} = authClient;