import type { Metadata } from "next";
import { Anton, Caveat, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-script",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Thirty Three Degrees",
  description:
    "Thirty Three Degrees — three-piece rock band from the Central Coast, NSW.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anton.variable} ${caveat.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
