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

export function AppSidebar({
  items,
  logoutItem,
}: {
  items: SidebarItem[];
  logoutItem: SidebarItem;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Label className='py-2 font-semibold text-center'>FF Factoring</Label>
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
                      <span className='text-lg'>{item.title}</span>
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
          <a href={logoutItem.url}>
            <logoutItem.icon />
            <span className='text-lg'>{logoutItem.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
