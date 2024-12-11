'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Files, Home, LogOut, Users, Wallet } from 'lucide-react';

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

  const logoutUrl = `${
    process.env.NEXT_PUBLIC_COGNITO_DOMAIN
  }/logout?client_id=${
    process.env.NEXT_PUBLIC_CLIENT_ID
  }&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_LOGOUT_URI || '')}`;

  const logoutItem: SidebarItem = {
    title: 'Sair',
    url: logoutUrl,
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
