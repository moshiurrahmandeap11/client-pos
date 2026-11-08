import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const liAdorNoirrit = localFont({
  src: [
    {
      path: "../fonts/LiAdorNoirrit-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/LiAdorNoirrit-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/LiAdorNoirrit-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/LiAdorNoirrit-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POS Management Engine",
  description: "Enterprise Point of Sale & Terminal Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${poppins.variable} ${liAdorNoirrit.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SettingsProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: "var(--color-card, #ffffff)",
                  color: "var(--color-foreground, #0f172a)",
                  border: "1px solid var(--color-border, #e2e8f0)",
                  fontSize: "12px",
                  fontWeight: 400,
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
