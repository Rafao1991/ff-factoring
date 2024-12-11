'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Label } from './ui/label';
import { format } from 'date-fns';
import { Separator } from './ui/separator';
import { useAuth } from 'react-oidc-context';

export function AppSidebar({
  items,
  logoutItem,
}: {
  items: SidebarItem[];
  logoutItem: SidebarItem;
}) {
  const auth = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Label className='pt-2 text-xl font-bold text-center'>
          FF Factoring
        </Label>
        <Label className='pb-2 text-lg font-medium text-center'>
          {auth.user?.profile.email}
        </Label>
        <Label className='font-normal text-center'>
          {format(new Date(), 'PPP')}
        </Label>
      </SidebarHeader>
      <Separator className='w-11/12 my-2 mx-auto' />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className='text-xl'>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator className='w-11/12 my-2 mx-auto' />
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <a href={logoutItem.url} onClick={() => auth.removeUser()}>
            <logoutItem.icon />
            <span className='text-xl'>{logoutItem.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
