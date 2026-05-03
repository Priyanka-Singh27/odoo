import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookEase — Appointment Booking Made Simple",
  description: "A booking system for teams that need to manage availability, capacity, and confirmations — without the chaos.",
};

import { Toaster } from "@/components/ui/sonner";
import { RoleProvider } from "@/hooks/use-role";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <RoleProvider>
          {children}
        </RoleProvider>
        <Toaster />
      </body>
    </html>
  );
}
