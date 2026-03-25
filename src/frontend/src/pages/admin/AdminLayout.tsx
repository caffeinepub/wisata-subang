import { Link, Outlet, useRouter } from "@tanstack/react-router";
import {
  CalendarCheck,
  Hotel,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin } from "../../hooks/useQueries";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/destinations", label: "Destinasi", icon: MapPin },
  { to: "/admin/packages", label: "Paket Tour", icon: Package },
  { to: "/admin/hotels", label: "Hotel", icon: Hotel },
  { to: "/admin/agencies", label: "Agen Wisata", icon: Users },
  { to: "/admin/bookings", label: "Pemesanan", icon: CalendarCheck },
  { to: "/admin/roles", label: "Kelola Role", icon: ShieldCheck },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading, isError } = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated at all, redirect to login
    if (!identity || identity.getPrincipal().isAnonymous()) {
      router.navigate({ to: "/login" });
      return;
    }
    // If admin check failed or returned false, redirect to login
    if (!isLoading && !isError && isAdmin === false) {
      router.navigate({ to: "/login" });
    }
  }, [isAdmin, isLoading, isError, identity, router]);

  if (isLoading || !identity || identity.getPrincipal().isAnonymous()) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div
          className="animate-spin w-8 h-8 border-2 rounded-full"
          style={{ borderTopColor: "#0E5A3F", borderColor: "#E5E7EB" }}
        />
      </div>
    );
  }

  if (!isAdmin && !isError) return null;

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform md:translate-x-0 md:static md:flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0E5A3F" }}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" />
            <span className="font-bold text-white text-sm">Visit Subang</span>
          </Link>
          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p
          className="px-6 text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Admin Panel
        </p>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}
              activeProps={{
                style: { background: "rgba(255,255,255,0.15)", color: "white" },
              }}
              data-ocid="admin.nav.link"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div
          className="p-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="text-xs text-white/50 mb-3 truncate">
            {identity?.getPrincipal().toString().slice(0, 16)}...
          </div>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
            data-ocid="admin.logout.button"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="presentation"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            data-ocid="admin.mobile.menu.button"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
