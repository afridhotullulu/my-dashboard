"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="p-10">
        Silakan login terlebih dahulu
      </div>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        Dashboard Salon
      </h1>

      <img
        src={session.user?.image ?? ""}
        alt="Foto Profil"
        width={100}
        className="rounded-full"
      />

      <h2 className="mt-3 text-xl">
        {session.user?.name}
      </h2>

      <p>{session.user?.email}</p>

      <button
        onClick={() => signOut()}
        className="mt-5 rounded bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </main>
  );
}