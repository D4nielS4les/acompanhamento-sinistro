"use client";

import Link from "next/link";
import { ShieldCheck, LayoutDashboard, PlusCircle, Bell, Search, X, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/novo", label: "Novo Sinistro", icon: PlusCircle },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const { user, signOut } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  // Don't show header on login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-card/80 border-b border-border/50">
      <div className="container flex h-16 items-center justify-between mx-auto px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 font-bold text-lg text-foreground group">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:inline">
              SinistroFacil
            </span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar sinistros..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 pl-10 pr-8 h-9 bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              
              <ModeToggle />
              
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20" title={user.email || ""}>
                  <span className="text-sm font-semibold text-primary">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
