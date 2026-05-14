"use client";

import { IconHome, IconExplore, IconMessages, IconProfile } from "@/components/icons/TmIcons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Inicio", url: "/dashboard", icon: IconHome },
  { title: "Explorar", url: "/explore", icon: IconExplore },
  { title: "Mensajes", url: "/messages", icon: IconMessages },
  { title: "Perfil", url: "/profile/me", icon: IconProfile },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-center py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/20 text-sm font-bold text-white shadow-lg shadow-primary/20">TM</div>
          </div>
          <SidebarGroupLabel className="sr-only">TutorMatch</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={item.url}
                      className={`flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm transition-colors ${isActive ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
