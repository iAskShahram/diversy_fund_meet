import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { Providers } from "@/components/ui/providers/providers";

export const metadata: Metadata = {
  title: "Board Portal | Diversyfund",
  description: "Board Portal | Diversyfund",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Board Portal | Diversyfund",
    description: "Board Portal | Diversyfund",
    url: "https://boardportal.diversyfund.com",
    siteName: "Board Portal | Diversyfund",
  },
  twitter: {
    title: "Board Portal | Diversyfund",
    description: "Board Portal | Diversyfund",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
