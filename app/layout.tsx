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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "Thirty Three Degrees — three-piece rock band from the Central Coast, NSW.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Thirty Three Degrees",
  description,
  openGraph: {
    title: "Thirty Three Degrees",
    description,
    url: siteUrl,
    siteName: "Thirty Three Degrees",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thirty Three Degrees",
    description,
  },
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
