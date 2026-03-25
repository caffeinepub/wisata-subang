import {
  BarChart3,
  CalendarCheck,
  Hotel,
  MapPin,
  Package,
  TrendingUp,
} from "lucide-react";
import type { ElementType } from "react";
import { useBookingStats } from "../../hooks/useQueries";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: { label: string; value: string; icon: ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useBookingStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {isLoading ? (
        <div
          className="animate-pulse grid grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="dashboard.loading_state"
        >
          {["a", "b", "c", "d", "e", "f"].map((key) => (
            <div key={key} className="bg-white rounded-2xl h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Pemesanan"
            value={stats?.totalBookings?.toString() || "0"}
            icon={CalendarCheck}
            color="#E67E22"
          />
          <StatCard
            label="Pemesanan Dikonfirmasi"
            value={stats?.confirmedBookings?.toString() || "0"}
            icon={TrendingUp}
            color="#0E5A3F"
          />
          <StatCard
            label="Pemesanan Pending"
            value={stats?.pendingBookings?.toString() || "0"}
            icon={BarChart3}
            color="#F59E0B"
          />
          <StatCard
            label="Destinasi Aktif"
            value={stats?.activeDestinations?.toString() || "0"}
            icon={MapPin}
            color="#0E5A3F"
          />
          <StatCard
            label="Paket Aktif"
            value={stats?.activePackages?.toString() || "0"}
            icon={Package}
            color="#8B5CF6"
          />
          <StatCard
            label="Hotel Aktif"
            value={stats?.activeHotels?.toString() || "0"}
            icon={Hotel}
            color="#06B6D4"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h2 className="font-bold mb-4">Selamat Datang di Admin Panel</h2>
        <p className="text-sm text-muted-foreground">
          Gunakan menu di sebelah kiri untuk mengelola konten website Visit
          Subang. Anda dapat menambah, mengedit, dan menghapus destinasi, paket
          tour, hotel, agen wisata, serta mengelola pemesanan yang masuk.
        </p>
      </div>
    </div>
  );
}
