import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "OpsIntel — AI-Powered Business Operations Intelligence Platform",
  description: "Monitor performance. Predict what happens next. Understand why. Act faster.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="opsintel-theme">
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
