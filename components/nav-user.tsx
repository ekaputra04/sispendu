"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase-init";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { user } = useUserStore();

  async function handleLogout() {
    try {
      await signOut(auth);

      const response = await axios.post("/api/logout");

      if (response.status === 200) {
        toast.success("Berhasil logout");
        router.push("/login");
      } else {
        toast.error("Gagal menghapus sesi");
      }
    } catch (error) {
      toast.error("Gagal logout");
      console.error("Error:", error);
    }
  }

  return (
    <div className="">
      {user && (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="grayscale rounded-lg w-8 h-8">
                    {/* {user.avatar && (
                  <AvatarImage src={user.avatar} alt={user.nama} />
                )} */}
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 grid text-sm text-left leading-tight">
                    <span className="font-medium truncate">{user.nama}</span>
                    <span className="text-muted-foreground text-xs truncate">
                      {user.email}
                    </span>
                  </div>
                  <IconDotsVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="rounded-lg w-(--radix-dropdown-menu-trigger-width) min-w-56"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
                    <Avatar className="rounded-lg w-8 h-8">
                      {/* {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.nama} />
                    )} */}
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 grid text-sm text-left leading-tight">
                      <span className="font-medium truncate">{user.nama}</span>
                      <span className="text-muted-foreground text-xs truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>
                  <IconLogout />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </div>
  );
}
