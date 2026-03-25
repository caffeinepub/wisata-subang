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
import type { InputTourAgency, TourAgency } from "../../backend";
import {
  useAdminAgencyMutations,
  useAllAgencies,
} from "../../hooks/useQueries";

export default function AdminAgencies() {
  const { data: agencies = [], isLoading } = useAllAgencies();
  const { create, update, remove, toggle } = useAdminAgencyMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TourAgency | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    services: "",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      services: "",
    });
    setOpen(true);
  };
  const openEdit = (a: TourAgency) => {
    setEditing(a);
    setForm({
      name: a.name,
      description: a.description,
      address: a.address,
      phone: a.phone,
      email: a.email,
      services: a.services.join(", "),
    });
    setOpen(true);
  };

  const save = async () => {
    const input: InputTourAgency = {
      name: form.name,
      description: form.description,
      address: form.address,
      phone: form.phone,
      email: form.email,
      services: form.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editing) await update.mutateAsync({ id: editing.id, input });
      else await create.mutateAsync(input);
      toast.success("Agen disimpan");
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Agen Wisata</h1>
        <Button
          type="button"
          onClick={openCreate}
          style={{ background: "#0E5A3F", color: "white" }}
          className="rounded-full"
          data-ocid="admin.agencies.add.button"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah
        </Button>
      </div>
      {isLoading ? (
        <div
          className="h-40 flex items-center justify-center"
          data-ocid="admin.agencies.loading_state"
        >
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          data-ocid="admin.agencies.table"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Nama</th>
                <th className="text-left p-4 hidden md:table-cell">Email</th>
                <th className="text-left p-4 hidden md:table-cell">Telepon</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency, i) => (
                <tr
                  key={agency.id.toString()}
                  className="border-b last:border-0"
                  data-ocid={`admin.agencies.row.${i + 1}`}
                >
                  <td className="p-4 font-medium">{agency.name}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {agency.email}
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {agency.phone}
                  </td>
                  <td className="p-4">
                    <Switch
                      checked={agency.active}
                      onCheckedChange={() => toggle.mutateAsync(agency.id)}
                      data-ocid={`admin.agencies.toggle.${i + 1}`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(agency)}
                        className="p-1.5 rounded-lg hover:bg-secondary"
                        data-ocid={`admin.agencies.edit.button.${i + 1}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Hapus?"))
                            remove
                              .mutateAsync(agency.id)
                              .then(() => toast.success("Dihapus"));
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                        data-ocid={`admin.agencies.delete_button.${i + 1}`}
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
        <DialogContent data-ocid="admin.agencies.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Agen" : "Tambah Agen"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nama</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin.agencies.name.input"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                data-ocid="admin.agencies.description.input"
              />
            </div>
            <div>
              <Label>Alamat</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                data-ocid="admin.agencies.address.input"
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
                  data-ocid="admin.agencies.phone.input"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  data-ocid="admin.agencies.email.input"
                />
              </div>
            </div>
            <div>
              <Label>Layanan (koma)</Label>
              <Input
                value={form.services}
                onChange={(e) =>
                  setForm((f) => ({ ...f, services: e.target.value }))
                }
                data-ocid="admin.agencies.services.input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={save}
                disabled={create.isPending || update.isPending}
                className="flex-1"
                style={{ background: "#0E5A3F", color: "white" }}
                data-ocid="admin.agencies.save.button"
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
                data-ocid="admin.agencies.cancel.button"
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
