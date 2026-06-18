'use client';

import { SessionProvider } from "next-auth/react";
import "./globals.css"; // Sesuaikan dengan css kamu

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 🌟 Bungkus children dengan SessionProvider */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}