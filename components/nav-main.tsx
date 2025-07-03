"use client";

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <Link href={"/dashboard/penduduk/add"}>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Tambah data penduduk"
                className="bg-primary hover:bg-primary/90 active:bg-primary/90 min-w-8 text-primary-foreground hover:text-primary-foreground active:text-primary-foreground duration-200 ease-linear">
                <IconCirclePlusFilled />
                <span>Tambah Data Penduduk</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} href={item.url}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname == item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
