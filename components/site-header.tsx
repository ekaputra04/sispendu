"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./molecules/mode-toggle";
import { usePathname } from "next/navigation";
import { dataNavbar } from "@/consts/dataNavbar";

export function SiteHeader() {
  const pathname = usePathname();

  let navItem;
  if (pathname.startsWith("/dashboard/penduduk/add")) {
    navItem = {
      title: "Tambah Data Penduduk",
    };
  } else if (pathname.startsWith("/dashboard/kartu-keluarga/add")) {
    navItem = {
      title: "Tambah Data Kartu Keluarga",
    };
  } else if (pathname.startsWith("/dashboard/penduduk/edit")) {
    navItem = {
      title: "Edit Data Penduduk",
    };
  } else if (pathname.startsWith("/dashboard/kartu-keluarga/edit")) {
    navItem = {
      title: "Edit Data Kartu Keluarga",
    };
  } else if (pathname.startsWith("/dashboard/penduduk/detail")) {
    navItem = {
      title: "Detail Data Penduduk",
    };
  } else if (pathname.startsWith("/dashboard/kartu-keluarga/detail")) {
    navItem = {
      title: "Detail Data Kartu Keluarga",
    };
  } else if (pathname.startsWith("/dashboard/sensus/add")) {
    navItem = {
      title: "Tambah Data Sensus",
    };
  } else {
    navItem = dataNavbar.navMain.find((item) => item.url === pathname);
  }

  return (
    <header className="flex items-center gap-2 border-b h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) transition-[width,height] ease-linear shrink-0">
      <div className="flex items-center gap-1 lg:gap-2 px-4 lg:px-6 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="font-medium text-base">{navItem?.title}</h1>
        <div className="flex items-center gap-2 ml-auto">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
