import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
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
  title: "APEX Retail POS",
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
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
