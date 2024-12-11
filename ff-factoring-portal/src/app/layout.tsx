'use client';

import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from 'react-oidc-context';
import { cognitoAuthConfig } from '@/lib/auth';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log({ cognitoAuthConfig });
  return (
    <html lang='en'>
      <head>
        <title>FF Factoring</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>
      </body>
    </html>
  );
}
