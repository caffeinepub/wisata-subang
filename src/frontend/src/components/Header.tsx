import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronDown, MapPin, Menu, Navigation, Search, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto bg-white rounded-full shadow-card px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#0E5A3F" }}
          >
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: "#0E5A3F" }}>
            Visit Subang
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/destinations"
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-dark transition-colors"
            data-ocid="nav.destinations.link"
          >
            Destinasi <ChevronDown className="w-3 h-3" />
          </Link>
          <Link
            to="/packages"
            className="text-sm font-medium text-gray-700 hover:text-green-dark transition-colors"
            data-ocid="nav.packages.link"
          >
            Paket Tour
          </Link>
          <Link
            to="/hotels"
            className="text-sm font-medium text-gray-700 hover:text-green-dark transition-colors"
            data-ocid="nav.hotels.link"
          >
            Hotel
          </Link>
          <Link
            to="/agencies"
            className="text-sm font-medium text-gray-700 hover:text-green-dark transition-colors"
            data-ocid="nav.agencies.link"
          >
            Tour & Travel
          </Link>
          <Link
            to="/booking"
            className="text-sm font-medium text-gray-700 hover:text-green-dark transition-colors"
            data-ocid="nav.booking.link"
          >
            Booking
          </Link>
          <Link
            to="/rute"
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-dark transition-colors"
            data-ocid="nav.routes.link"
          >
            <Navigation className="w-3.5 h-3.5" />
            Rute
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium"
              style={{ color: "#E67E22" }}
              data-ocid="nav.admin.link"
            >
              Admin
            </Link>
          )}
          <button
            type="button"
            className="text-gray-600 hover:text-green-dark"
            aria-label="Cari"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {identity.getPrincipal().toString().slice(0, 8)}...
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={clear}
                data-ocid="auth.logout.button"
              >
                Keluar
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="rounded-full text-xs px-5"
              style={{ background: "#0E5A3F", color: "white" }}
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              data-ocid="auth.login.button"
            >
              {loginStatus === "logging-in" ? "Masuk..." : "Masuk / Daftar"}
            </Button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          data-ocid="nav.mobile.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-2 bg-white rounded-2xl shadow-card mx-4 p-4">
          <nav className="flex flex-col gap-3">
            {[
              { to: "/destinations", label: "Destinasi" },
              { to: "/packages", label: "Paket Tour" },
              { to: "/hotels", label: "Hotel" },
              { to: "/agencies", label: "Tour & Travel" },
              { to: "/booking", label: "Booking" },
              { to: "/rute", label: "Rute" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-gray-700 py-1"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile.link"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium"
                style={{ color: "#E67E22" }}
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile.admin.link"
              >
                Admin Panel
              </Link>
            )}
            <div className="pt-2 border-t">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full"
                  onClick={clear}
                  data-ocid="auth.mobile.logout.button"
                >
                  Keluar
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full rounded-full"
                  style={{ background: "#0E5A3F", color: "white" }}
                  onClick={() => login()}
                  data-ocid="auth.mobile.login.button"
                >
                  Masuk / Daftar
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
