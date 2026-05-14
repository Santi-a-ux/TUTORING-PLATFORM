import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { fetchApi } from "@/lib/api";
import { logoutAction } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Breadcrumb from "@/components/ui/breadcrumb";
import { NotificationsBell } from "@/components/layout/notifications-bell";

interface SessionUser {
  user_id?: string;
  display_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userProfile, authUser] = await Promise.all([
    fetchApi<SessionUser>("/users/me").catch(() => null),
    fetchApi<SessionUser>("/auth/me").catch(() => null),
  ]);

  const resolvedUserId = userProfile?.user_id || authUser?.user_id || "";
  const userLabel =
    userProfile?.display_name ||
    authUser?.display_name ||
    authUser?.email?.split("@")[0] ||
    userProfile?.email ||
    "Usuario";
  const avatarSeed = resolvedUserId || userLabel;
  const avatarUrl = userProfile?.avatar_url;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex-1 flex flex-col bg-[#0d0d1a]">
        <header className="flex h-14 items-center gap-4 border-b border-white/5 bg-[#0a0a14]/95 px-4 lg:h-15 lg:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full border border-primary/30 bg-primary/20 font-bold text-white flex items-center justify-center shadow-lg shadow-primary/20">TM</div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-white/80">TutorMatch</div>
                <Breadcrumb />
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <NotificationsBell />
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt={userLabel} />
                <AvatarFallback>{userLabel.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <span className="hidden text-xs text-white/40 sm:inline">Sesión</span>
                <span className="block max-w-45 truncate text-sm font-medium text-white/80" title={userLabel}>{userLabel}</span>
              </div>
              <form action={logoutAction}>
                <Button type="submit" size="sm" className="h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white/60 transition-all hover:bg-white/10 hover:text-white">
                  Cerrar sesion
                </Button>
              </form>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
