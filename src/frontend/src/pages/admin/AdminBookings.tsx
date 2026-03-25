import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BookingStatus } from "../../backend";
import type { Booking } from "../../backend";
import { useAllBookings, useUpdateBookingStatus } from "../../hooks/useQueries";

const STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.pending]: "bg-yellow-100 text-yellow-800",
  [BookingStatus.confirmed]: "bg-green-100 text-green-800",
  [BookingStatus.cancelled]: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.pending]: "Pending",
  [BookingStatus.confirmed]: "Dikonfirmasi",
  [BookingStatus.cancelled]: "Dibatalkan",
};

export default function AdminBookings() {
  const { data: bookings = [], isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleStatusChange = async (id: bigint, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status diperbarui");
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Pemesanan</h1>
        <span className="text-sm text-muted-foreground">
          {bookings.length} total pemesanan
        </span>
      </div>

      {isLoading ? (
        <div
          className="h-40 flex items-center justify-center"
          data-ocid="admin.bookings.loading_state"
        >
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="admin.bookings.empty_state"
        >
          Belum ada pemesanan
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          data-ocid="admin.bookings.table"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Pelanggan</th>
                  <th className="text-left p-4 hidden md:table-cell">Email</th>
                  <th className="text-left p-4 hidden lg:table-cell">Tamu</th>
                  <th className="text-left p-4 hidden lg:table-cell">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Ubah Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: Booking, i: number) => (
                  <tr
                    key={booking.id.toString()}
                    className="border-b last:border-0 hover:bg-secondary/30"
                    data-ocid={`admin.bookings.row.${i + 1}`}
                  >
                    <td className="p-4">
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.customerPhone}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                      {booking.customerEmail}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {booking.numGuests.toString()}
                    </td>
                    <td
                      className="p-4 hidden lg:table-cell font-medium"
                      style={{ color: "#E67E22" }}
                    >
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(booking.totalPrice)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[booking.status]}`}
                      >
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <Select
                        value={booking.status}
                        onValueChange={(v) =>
                          handleStatusChange(booking.id, v as BookingStatus)
                        }
                      >
                        <SelectTrigger
                          className="w-36 h-8 text-xs"
                          data-ocid={`admin.bookings.status.select.${i + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={BookingStatus.pending}>
                            Pending
                          </SelectItem>
                          <SelectItem value={BookingStatus.confirmed}>
                            Konfirmasi
                          </SelectItem>
                          <SelectItem value={BookingStatus.cancelled}>
                            Batalkan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
