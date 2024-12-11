'use client';

import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from 'react-oidc-context';

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

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_0SiontoGi',
  client_id: '1onbn5vq3buu1f5ijke3o1gnve',
  redirect_uri: 'http://localhost:3000',
  response_type: 'code',
  scope: 'phone openid email',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
