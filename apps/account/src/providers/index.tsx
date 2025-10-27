"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "@t2p-admin/ui/components/sonner";
import ReactQueryProvider from "./reactQueryPorvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="white"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <Toaster />
        <AuthProvider>{children}</AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
