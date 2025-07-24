"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { dataNavbar } from "@/consts/dataNavbar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <div className="flex justify-between items-center gap-2 py-8 h-32">
                  <img
                    src="/images/logo.png"
                    alt=""
                    className="w-8 h-8 object-fill"
                  />
                  <span className="font-semibold text-base">
                    SISPENDU BEBALANG
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataNavbar.navMain} />
        {/* <NavDocuments items={dataNavbar.documents} /> */}
        {/* <NavSecondary items={dataNavbar.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
