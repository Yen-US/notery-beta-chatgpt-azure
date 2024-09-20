import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: "Notery AI",
  description: "From ideas to notes, to knowledge, to actions",
};
import SessionProvider from "@/components/SessionProvider";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background antialiased"><ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      ><SessionProvider>{children}</SessionProvider><Toaster/></ThemeProvider></body>
    </html>
  );
}
