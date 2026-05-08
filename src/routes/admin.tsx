import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Wine, ShoppingCart, CalendarDays, FileText, LayoutDashboard, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Maison Noir" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Wine },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading]);

  if (!isAdmin) return null;

  return (
    <div className="container-luxe py-10 grid lg:grid-cols-[220px,1fr] gap-10">
      <aside className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">Admin</p>
        {nav.map((n) => {
          const active = n.exact ? path === n.to : path.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition", active ? "bg-gradient-gold text-gold-foreground" : "text-foreground/80 hover:bg-white/5")}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          );
        })}
      </aside>
      <div><Outlet /></div>
    </div>
  );
}
