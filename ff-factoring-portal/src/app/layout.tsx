import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Files, Home, LogOut, Users, Wallet } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

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

export const metadata: Metadata = {
  title: 'FF Factoring',
};

const items: SidebarItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Clientes',
    url: '/customer',
    icon: Users,
  },
  {
    title: 'Operações',
    url: '/transaction',
    icon: Wallet,
  },
  {
    title: 'Relatórios',
    url: '/report',
    icon: Files,
  },
];

const logoutItem: SidebarItem = {
  title: 'Sair',
  url: '/logout',
  icon: LogOut,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider open={true}>
          <AppSidebar items={items} logoutItem={logoutItem} />
          <div className='container mx-auto p-4 md:p-6 lg:p-8 xl:p-12'>
            {children}
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
