import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { fetchApi } from "@/lib/api";
import { logoutAction } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <main className="w-full flex-1 flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-15 lg:px-6">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-1.5">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt={userLabel} />
              <AvatarFallback>{userLabel.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground hidden sm:inline">Sesión</span>
              <span className="block text-sm font-medium max-w-45 truncate" title={userLabel}>{userLabel}</span>
            </div>
            <form action={logoutAction}>
              <Button type="submit" size="sm" variant="outline" className="h-8">
                Cerrar sesion
              </Button>
            </form>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}