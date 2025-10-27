"use client";
import { AuthProvider } from "@/features/auth/provider/auth-provider";
import ReactQueryProvider from "@/providers/reactQueryPorvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <NuqsAdapter>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
