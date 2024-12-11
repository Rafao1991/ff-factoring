'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Files, Home, LogOut, Users, Wallet } from 'lucide-react';

const clientId = '1onbn5vq3buu1f5ijke3o1gnve';
const logoutUri = 'http://localhost:3000';
const cognitoDomain =
  'https://us-east-10siontogi.auth.us-east-1.amazoncognito.com';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items: SidebarItem[] = [
    {
      title: 'Home',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Clientes',
      url: '/dashboard/customer',
      icon: Users,
    },
    {
      title: 'Operações',
      url: '/dashboard/transaction',
      icon: Wallet,
    },
    {
      title: 'Relatórios',
      url: '/dashboard/report',
      icon: Files,
    },
  ];

  const logoutItem: SidebarItem = {
    title: 'Sair',
    url: `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`,
    icon: LogOut,
  };

  return (
    <>
      <SidebarProvider open={true}>
        <AppSidebar items={items} logoutItem={logoutItem} />
        <div className='container mx-auto p-4 md:p-6 lg:p-8 xl:p-12'>
          {children}
        </div>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
