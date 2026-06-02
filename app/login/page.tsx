"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/dashboard",
          })
        }
        className="rounded bg-blue-600 px-6 py-3 text-white"
      >
        Login Dengan Google
      </button>
    </main>
  );
}