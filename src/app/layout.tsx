import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from "@/firebase";
import "./globals.css";
import ClientSessionProvider from "./session-provider";

export const metadata: Metadata = {
  title: "Pacha Bhoomi Admin",
  description: "Admin panel for Pacha Bhoomi e-commerce website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientSessionProvider>
            <FirebaseClientProvider>{children}</FirebaseClientProvider>
          </ClientSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
