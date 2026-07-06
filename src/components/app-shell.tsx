import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings,
  PenSquare,
  Bell,
  Search,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/schedule", label: "Schedule Post", icon: PenSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <div
            className="grid h-9 w-9 place-items-center rounded-lg"
            style={{ background: "var(--gradient-accent)" }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Postloop</div>
            <div className="text-[11px] text-sidebar-foreground/60">Social scheduler</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl bg-sidebar-accent/60 p-4">
          <div className="text-xs font-medium">Upgrade to Pro</div>
          <p className="mt-1 text-[11px] text-sidebar-foreground/70">
            Unlock analytics, teams and unlimited scheduled posts.
          </p>
          <Button size="sm" className="mt-3 h-8 w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Upgrade
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts, campaigns…"
              className="h-9 bg-secondary/60 pl-9"
            />
          </div>
          <div className="flex-1 md:hidden">
            <div className="text-sm font-semibold">Postloop</div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="gap-1.5" style={{ background: "var(--gradient-accent)" }}>
              <Link to="/schedule">
                <Plus className="h-4 w-4" /> New Post
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">AM</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="px-4 pb-24 pt-6 md:px-6 lg:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t bg-background/95 py-2 backdrop-blur lg:hidden">
        {nav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] transition",
                active ? "text-primary" : "text-muted-foreground",
              )}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
