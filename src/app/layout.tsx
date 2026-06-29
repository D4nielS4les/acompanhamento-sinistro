import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import { ShieldCheck } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SinistroFacil | Acompanhamento de Sinistros",
  description: "Sistema moderno para gestão e acompanhamento de sinistros",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <Header />
            <main className="flex-1">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
                {children}
              </div>
            </main>
            <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>&copy; {new Date().getFullYear()} SinistroFacil</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>Termos de Uso</span>
                    <span>Privacidade</span>
                    <span>Suporte</span>
                  </div>
                </div>
              </div>
            </footer>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
