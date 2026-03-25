import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Hotel, InputHotel } from "../../backend";
import { useAdminHotelMutations, useAllHotels } from "../../hooks/useQueries";

export default function AdminHotels() {
  const { data: hotels = [], isLoading } = useAllHotels();
  const { create, update, remove, toggle } = useAdminHotelMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    rating: "",
    pricePerNight: "",
    amenities: "",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      rating: "",
      pricePerNight: "",
      amenities: "",
    });
    setOpen(true);
  };
  const openEdit = (h: Hotel) => {
    setEditing(h);
    setForm({
      name: h.name,
      description: h.description,
      address: h.address,
      phone: h.phone,
      website: h.website,
      rating: h.rating.toString(),
      pricePerNight: h.pricePerNight.toString(),
      amenities: h.amenities.join(", "),
    });
    setOpen(true);
  };

  const save = async () => {
    const input: InputHotel = {
      name: form.name,
      description: form.description,
      address: form.address,
      phone: form.phone,
      website: form.website,
      rating: BigInt(form.rating || "0"),
      pricePerNight: Number.parseFloat(form.pricePerNight),
      amenities: form.amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editing) await update.mutateAsync({ id: editing.id, input });
      else await create.mutateAsync(input);
      toast.success("Hotel disimpan");
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Hotel</h1>
        <Button
          type="button"
          onClick={openCreate}
          style={{ background: "#0E5A3F", color: "white" }}
          className="rounded-full"
          data-ocid="admin.hotels.add.button"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah
        </Button>
      </div>
      {isLoading ? (
        <div
          className="h-40 flex items-center justify-center"
          data-ocid="admin.hotels.loading_state"
        >
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          data-ocid="admin.hotels.table"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Nama</th>
                <th className="text-left p-4 hidden md:table-cell">
                  Harga/Malam
                </th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel, i) => (
                <tr
                  key={hotel.id.toString()}
                  className="border-b last:border-0"
                  data-ocid={`admin.hotels.row.${i + 1}`}
                >
                  <td className="p-4 font-medium">{hotel.name}</td>
                  <td className="p-4 hidden md:table-cell">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(hotel.pricePerNight)}
                  </td>
                  <td className="p-4">
                    <Switch
                      checked={hotel.active}
                      onCheckedChange={() => toggle.mutateAsync(hotel.id)}
                      data-ocid={`admin.hotels.toggle.${i + 1}`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(hotel)}
                        className="p-1.5 rounded-lg hover:bg-secondary"
                        data-ocid={`admin.hotels.edit.button.${i + 1}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Hapus?"))
                            remove
                              .mutateAsync(hotel.id)
                              .then(() => toast.success("Dihapus"));
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                        data-ocid={`admin.hotels.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.hotels.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Hotel" : "Tambah Hotel"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nama</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin.hotels.name.input"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                data-ocid="admin.hotels.description.input"
              />
            </div>
            <div>
              <Label>Alamat</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                data-ocid="admin.hotels.address.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Telepon</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  data-ocid="admin.hotels.phone.input"
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={form.website}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, website: e.target.value }))
                  }
                  data-ocid="admin.hotels.website.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Rating (0-50)</Label>
                <Input
                  type="number"
                  value={form.rating}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rating: e.target.value }))
                  }
                  data-ocid="admin.hotels.rating.input"
                />
              </div>
              <div>
                <Label>Harga/Malam</Label>
                <Input
                  type="number"
                  value={form.pricePerNight}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pricePerNight: e.target.value }))
                  }
                  data-ocid="admin.hotels.price.input"
                />
              </div>
            </div>
            <div>
              <Label>Fasilitas (koma)</Label>
              <Input
                value={form.amenities}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amenities: e.target.value }))
                }
                data-ocid="admin.hotels.amenities.input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={save}
                disabled={create.isPending || update.isPending}
                className="flex-1"
                style={{ background: "#0E5A3F", color: "white" }}
                data-ocid="admin.hotels.save.button"
              >
                {create.isPending || update.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                data-ocid="admin.hotels.cancel.button"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
