import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mon E-commerce",
  description: "Boutique en ligne moderne avec React et Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
