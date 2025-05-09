// src/components/auth/auth-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      if (isLogin) {
        // For sign in
        const result = await authClient.signIn.email({
          email,
          password
        });
        
        if (result.error) {
          setError(result.error.message ?? "Sign in failed");
        } else {
          console.log("Sign in successful, redirecting...");
          router.push("/onboarding");
        }
      } else {
        // For sign up
        const result = await authClient.signUp.email({
          email,
          password,
          name
        });
        
        if (result.error) {
          setError(result.error.message ?? "Sign up failed");
        } else {
          console.log("Sign up successful, redirecting...");
          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err?.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Sign in" : "Create account"}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Show name field only for signup */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
              ? "Sign in"
              : "Sign up"}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}