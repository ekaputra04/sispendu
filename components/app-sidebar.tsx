"use client";

import { NavMain } from "@/components/nav-main";
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
import { useSessionStore } from "@/store/useSession";
import { useEffect, useState } from "react";
import { decrypt } from "@/lib/utils";
import {
  IconChartBar,
  IconDashboard,
  IconDeviceLaptop,
  IconPhone,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Penduduk",
    url: "/dashboard/penduduk",
    icon: IconUsers,
  },
  {
    title: "Kartu Keluarga",
    url: "/dashboard/kartu-keluarga",
    icon: IconChartBar,
  },
  {
    title: "Kontak",
    url: "/dashboard/contact",
    icon: IconPhone,
  },
  {
    title: "Sensus",
    url: "/dashboard/sensus",
    icon: IconDeviceLaptop,
  },
];

const navMainAdmin = [
  ...navMain,
  {
    title: "Pengguna",
    url: "/dashboard/pengguna",
    icon: IconUserCircle,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = useSessionStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      const sessionDecrypted = await decrypt(session);

      if (sessionDecrypted?.role == "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [session]);

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
                  <span className="font-semibold text-base">SIPULANG</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isAdmin ? (
          <NavMain items={navMainAdmin} />
        ) : (
          <NavMain items={navMain} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
