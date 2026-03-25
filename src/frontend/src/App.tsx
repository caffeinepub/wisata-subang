import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import Agencies from "./pages/Agencies";
import Booking from "./pages/Booking";
import DestinationDetail from "./pages/DestinationDetail";
import Destinations from "./pages/Destinations";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Login from "./pages/Login";
import Packages from "./pages/Packages";
import AdminAgencies from "./pages/admin/AdminAgencies";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminDestinations from "./pages/admin/AdminDestinations";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPackages from "./pages/admin/AdminPackages";
import Dashboard from "./pages/admin/Dashboard";

// Root route - wraps public pages in Layout, admin in its own layout
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public layout route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Home,
});

const destinationsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/destinations",
  component: Destinations,
});

const destinationDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/destinations/$id",
  component: DestinationDetail,
});

const packagesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/packages",
  component: Packages,
});

const hotelsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/hotels",
  component: Hotels,
});

const agenciesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/agencies",
  component: Agencies,
});

const bookingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/booking",
  component: Booking,
});

const loginRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/login",
  component: Login,
});

// Admin routes (no shared layout wrapper - AdminLayout handles its own structure)
const adminBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: "/",
  component: Dashboard,
});

const adminDestinationsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: "/destinations",
  component: AdminDestinations,
});

const adminPackagesRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: "/packages",
  component: AdminPackages,
});

const adminHotelsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: "/hotels",
  component: AdminHotels,
});

const adminAgenciesRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: "/agencies",
  component: AdminAgencies,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => adminBaseRoute,
  path: "/bookings",
  component: AdminBookings,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    destinationsRoute,
    destinationDetailRoute,
    packagesRoute,
    hotelsRoute,
    agenciesRoute,
    bookingRoute,
    loginRoute,
  ]),
  adminBaseRoute.addChildren([
    adminDashboardRoute,
    adminDestinationsRoute,
    adminPackagesRoute,
    adminHotelsRoute,
    adminAgenciesRoute,
    adminBookingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
