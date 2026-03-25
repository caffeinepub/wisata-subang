import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PaymentMethod } from "../backend";
import type { TourDestination, TourPackage } from "../backend";
import { SAMPLE_DESTINATIONS, SAMPLE_PACKAGES } from "../data/sampleData";
import {
  useActiveDestinations,
  useActiveTourPackages,
  useCreateBooking,
} from "../hooks/useQueries";

interface BookingForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  numGuests: number;
  bookingType: "destination" | "package";
  destinationId: string;
  packageId: string;
  paymentMethod: string;
}

const WALLET_INFO = [
  { key: PaymentMethod.ovo, label: "OVO", color: "#4C3494" },
  { key: PaymentMethod.gopay, label: "GoPay", color: "#00AED6" },
  { key: PaymentMethod.dana, label: "DANA", color: "#118EEA" },
  { key: PaymentMethod.linkAja, label: "LinkAja", color: "#E82529" },
];

export default function Booking() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    defaultValues: { bookingType: "destination", numGuests: 1 },
  });
  const createBooking = useCreateBooking();

  const { data: destinations } = useActiveDestinations();
  const { data: packages } = useActiveTourPackages();

  const destItems: TourDestination[] = (
    destinations?.length
      ? destinations
      : SAMPLE_DESTINATIONS.map((d, i) => ({
          ...d,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourDestination[];

  const pkgItems: TourPackage[] = (
    packages?.length
      ? packages
      : SAMPLE_PACKAGES.map((p, i) => ({
          ...p,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourPackage[];

  const bookingType = watch("bookingType");
  const selectedPackageId = watch("packageId");
  const selectedPkg = pkgItems.find(
    (p) => p.id.toString() === selectedPackageId,
  );
  const numGuests = watch("numGuests") || 1;
  const totalPrice = selectedPkg
    ? selectedPkg.price * numGuests
    : 150000 * numGuests;

  const onSubmit = async (data: BookingForm) => {
    const pm = data.paymentMethod as PaymentMethod;
    const input = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      numGuests: BigInt(data.numGuests),
      paymentMethod: pm,
      totalPrice,
      destinationId:
        bookingType === "destination" && data.destinationId
          ? BigInt(data.destinationId)
          : undefined,
      packageId:
        bookingType === "package" && data.packageId
          ? BigInt(data.packageId)
          : undefined,
    };
    try {
      await createBooking.mutateAsync(input);
      setSuccess(true);
      toast.success("Pemesanan berhasil! Kami akan menghubungi Anda segera.");
    } catch {
      toast.error("Gagal membuat pemesanan. Silakan coba lagi.");
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        data-ocid="booking.success_state"
      >
        <div className="text-center">
          <CheckCircle
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#0E5A3F" }}
          />
          <h2 className="text-2xl font-bold mb-2">Pemesanan Berhasil!</h2>
          <p className="text-muted-foreground mb-6">
            Tim kami akan menghubungi Anda dalam 1x24 jam
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: "#E67E22" }}
            data-ocid="booking.new.button"
          >
            Pesan Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pesan Wisata</h1>
          <p className="text-muted-foreground">
            Isi formulir di bawah untuk memesan paket wisata Subang
          </p>
        </div>

        {/* E-wallet strip */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: "#E67E22" }}>
          <p className="text-white font-semibold text-sm mb-3">
            Pembayaran dengan E-Wallet
          </p>
          <div className="flex gap-3 flex-wrap">
            {WALLET_INFO.map((w) => (
              <div
                key={w.key}
                className="bg-white rounded-lg px-4 py-2 text-sm font-bold"
                style={{ color: w.color }}
              >
                {w.label}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl p-6 shadow-card space-y-5"
          data-ocid="booking.form"
        >
          {/* Booking type */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValue("bookingType", "destination")}
              className="flex-1 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: bookingType === "destination" ? "#0E5A3F" : "white",
                color: bookingType === "destination" ? "white" : "#374151",
                borderColor:
                  bookingType === "destination" ? "#0E5A3F" : "#E5E7EB",
              }}
              data-ocid="booking.destination.tab"
            >
              Destinasi
            </button>
            <button
              type="button"
              onClick={() => setValue("bookingType", "package")}
              className="flex-1 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: bookingType === "package" ? "#0E5A3F" : "white",
                color: bookingType === "package" ? "white" : "#374151",
                borderColor: bookingType === "package" ? "#0E5A3F" : "#E5E7EB",
              }}
              data-ocid="booking.package.tab"
            >
              Paket Tour
            </button>
          </div>

          {/* Personal info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Nama Lengkap</Label>
              <Input
                id="customerName"
                {...register("customerName", { required: true })}
                placeholder="Nama Anda"
                data-ocid="booking.name.input"
              />
              {errors.customerName && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="booking.name.error_state"
                >
                  Nama wajib diisi
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="customerPhone">Nomor Telepon</Label>
              <Input
                id="customerPhone"
                {...register("customerPhone", { required: true })}
                placeholder="08xxxxxxxxxx"
                data-ocid="booking.phone.input"
              />
              {errors.customerPhone && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="booking.phone.error_state"
                >
                  Nomor telepon wajib diisi
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              {...register("customerEmail", { required: true })}
              placeholder="email@anda.com"
              data-ocid="booking.email.input"
            />
            {errors.customerEmail && (
              <p
                className="text-xs text-destructive mt-1"
                data-ocid="booking.email.error_state"
              >
                Email wajib diisi
              </p>
            )}
          </div>

          {/* Destination or Package */}
          {bookingType === "destination" ? (
            <div>
              <Label>Pilih Destinasi</Label>
              <Select onValueChange={(v) => setValue("destinationId", v)}>
                <SelectTrigger data-ocid="booking.destination.select">
                  <SelectValue placeholder="Pilih destinasi" />
                </SelectTrigger>
                <SelectContent>
                  {destItems.map((d) => (
                    <SelectItem key={d.id.toString()} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label>Pilih Paket Tour</Label>
              <Select onValueChange={(v) => setValue("packageId", v)}>
                <SelectTrigger data-ocid="booking.package.select">
                  <SelectValue placeholder="Pilih paket" />
                </SelectTrigger>
                <SelectContent>
                  {pkgItems.map((p) => (
                    <SelectItem key={p.id.toString()} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numGuests">Jumlah Tamu</Label>
              <Input
                id="numGuests"
                type="number"
                min={1}
                {...register("numGuests", {
                  required: true,
                  min: 1,
                  valueAsNumber: true,
                })}
                data-ocid="booking.guests.input"
              />
            </div>
            <div>
              <Label>Metode Pembayaran</Label>
              <Select onValueChange={(v) => setValue("paymentMethod", v)}>
                <SelectTrigger data-ocid="booking.payment.select">
                  <SelectValue placeholder="Pilih e-wallet" />
                </SelectTrigger>
                <SelectContent>
                  {WALLET_INFO.map((w) => (
                    <SelectItem key={w.key} value={w.key}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3 border-t">
            <span className="font-semibold">Total Pembayaran</span>
            <span className="text-xl font-bold" style={{ color: "#E67E22" }}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(totalPrice)}
            </span>
          </div>

          <Button
            type="submit"
            disabled={createBooking.isPending}
            className="w-full rounded-full py-6 text-base font-semibold"
            style={{ background: "#E67E22", color: "white" }}
            data-ocid="booking.submit_button"
          >
            {createBooking.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...
              </>
            ) : (
              "Pesan Sekarang"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
