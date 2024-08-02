import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: "Ensemble Cinemas",
  description: "Search and view movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-roboto-regular">{children}</body>
    </html>
  );
}
