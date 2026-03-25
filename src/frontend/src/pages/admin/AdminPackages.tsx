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
import type { InputTourPackage, TourPackage } from "../../backend";
import {
  useAdminPackageMutations,
  useAllTourPackages,
} from "../../hooks/useQueries";

function formatPrice(p: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(p);
}

export default function AdminPackages() {
  const { data: packages = [], isLoading } = useAllTourPackages();
  const { create, update, remove, toggle } = useAdminPackageMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TourPackage | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    maxParticipants: "",
    inclusions: "",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      duration: "",
      maxParticipants: "",
      inclusions: "",
    });
    setOpen(true);
  };
  const openEdit = (p: TourPackage) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      duration: p.duration.toString(),
      maxParticipants: p.maxParticipants.toString(),
      inclusions: p.inclusions.join(", "),
    });
    setOpen(true);
  };

  const save = async () => {
    const input: InputTourPackage = {
      name: form.name,
      description: form.description,
      price: Number.parseFloat(form.price),
      duration: BigInt(form.duration || "0"),
      maxParticipants: BigInt(form.maxParticipants || "0"),
      inclusions: form.inclusions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editing) await update.mutateAsync({ id: editing.id, input });
      else await create.mutateAsync(input);
      toast.success("Paket disimpan");
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Paket Tour</h1>
        <Button
          type="button"
          onClick={openCreate}
          style={{ background: "#0E5A3F", color: "white" }}
          className="rounded-full"
          data-ocid="admin.packages.add.button"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah
        </Button>
      </div>
      {isLoading ? (
        <div
          className="h-40 flex items-center justify-center"
          data-ocid="admin.packages.loading_state"
        >
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          data-ocid="admin.packages.table"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Nama</th>
                <th className="text-left p-4 hidden md:table-cell">Harga</th>
                <th className="text-left p-4 hidden md:table-cell">Durasi</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, i) => (
                <tr
                  key={pkg.id.toString()}
                  className="border-b last:border-0 hover:bg-secondary/30"
                  data-ocid={`admin.packages.row.${i + 1}`}
                >
                  <td className="p-4 font-medium">{pkg.name}</td>
                  <td className="p-4 hidden md:table-cell">
                    {formatPrice(pkg.price)}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {pkg.duration.toString()} Hari
                  </td>
                  <td className="p-4">
                    <Switch
                      checked={pkg.active}
                      onCheckedChange={() => toggle.mutateAsync(pkg.id)}
                      data-ocid={`admin.packages.toggle.${i + 1}`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(pkg)}
                        className="p-1.5 rounded-lg hover:bg-secondary"
                        data-ocid={`admin.packages.edit.button.${i + 1}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Hapus?"))
                            remove
                              .mutateAsync(pkg.id)
                              .then(() => toast.success("Dihapus"));
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                        data-ocid={`admin.packages.delete_button.${i + 1}`}
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
        <DialogContent data-ocid="admin.packages.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Paket" : "Tambah Paket"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nama</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin.packages.name.input"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                data-ocid="admin.packages.description.input"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Harga (IDR)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  data-ocid="admin.packages.price.input"
                />
              </div>
              <div>
                <Label>Durasi (Hari)</Label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  data-ocid="admin.packages.duration.input"
                />
              </div>
              <div>
                <Label>Maks Peserta</Label>
                <Input
                  type="number"
                  value={form.maxParticipants}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxParticipants: e.target.value }))
                  }
                  data-ocid="admin.packages.max.input"
                />
              </div>
            </div>
            <div>
              <Label>Inclusi (pisahkan koma)</Label>
              <Input
                value={form.inclusions}
                onChange={(e) =>
                  setForm((f) => ({ ...f, inclusions: e.target.value }))
                }
                data-ocid="admin.packages.inclusions.input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={save}
                disabled={create.isPending || update.isPending}
                className="flex-1"
                style={{ background: "#0E5A3F", color: "white" }}
                data-ocid="admin.packages.save.button"
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
                data-ocid="admin.packages.cancel.button"
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
