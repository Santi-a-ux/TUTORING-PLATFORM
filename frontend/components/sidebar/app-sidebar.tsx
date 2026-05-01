"use client";

import { Home, Compass, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Explorar", url: "/explore", icon: Compass },
  { title: "Mensajes", url: "/messages", icon: MessageSquare },
  { title: "Perfil", url: "/profile/me", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-center py-4">
            <div className="h-12 w-12 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center">TM</div>
          </div>
          <SidebarGroupLabel className="sr-only">TutorMatch</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <Link href={item.url} className={`flex items-center gap-2 w-full ${isActive ? 'text-[var(--primary)]' : ''}`}>
                        <item.icon className={`${isActive ? 'text-[var(--primary)]' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
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