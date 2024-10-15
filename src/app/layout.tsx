import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "@oursrc/components/theme-provider";
import { Toaster } from "@oursrc/components/ui/toaster";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const font = Nunito({
  preload: true,
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["vietnamese"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "VMA",
  description: "VMA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <StoreProvider>
        <body>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Toaster />
            <NextUIProvider>{children}</NextUIProvider>
          </ThemeProvider>
        </body>
      </StoreProvider>
    </html>
  );
}
