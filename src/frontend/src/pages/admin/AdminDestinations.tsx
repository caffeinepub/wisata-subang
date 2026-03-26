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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  ExternalBlob,
  InputTourDestination,
  TourDestination,
} from "../../backend";
import {
  useAdminDestinationMutations,
  useAllDestinations,
} from "../../hooks/useQueries";

export default function AdminDestinations() {
  const { data: destinations = [], isLoading } = useAllDestinations();
  const { create, update, remove, toggle } = useAdminDestinationMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TourDestination | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    category: string;
    address: string;
    directions: string;
    featured: boolean;
    lat: string;
    lng: string;
    photoUrl: string;
    photoFile: File | null;
  }>({
    name: "",
    description: "",
    category: "",
    address: "",
    directions: "",
    featured: false,
    lat: "",
    lng: "",
    photoUrl: "",
    photoFile: null,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      category: "",
      address: "",
      directions: "",
      featured: false,
      lat: "",
      lng: "",
      photoUrl: "",
      photoFile: null,
    });
    setOpen(true);
  };
  const openEdit = (d: TourDestination) => {
    setEditing(d);
    setForm({
      name: d.name,
      description: d.description,
      category: d.category,
      address: d.address,
      directions: d.directions,
      featured: d.featured,
      lat: d.location.latitude.toString(),
      lng: d.location.longitude.toString(),
      photoUrl: "",
      photoFile: null,
    });
    setOpen(true);
  };

  const save = async () => {
    let mainImage: ExternalBlob | undefined = undefined;
    if (form.photoFile) {
      const bytes = new Uint8Array(await form.photoFile.arrayBuffer());
      mainImage = (await import("../../backend")).ExternalBlob.fromBytes(bytes);
    } else if (form.photoUrl.trim()) {
      mainImage = (await import("../../backend")).ExternalBlob.fromURL(
        form.photoUrl.trim(),
      );
    }

    const input: InputTourDestination = {
      name: form.name,
      description: form.description,
      category: form.category,
      address: form.address,
      directions: form.directions,
      featured: form.featured,
      coordinates: {
        latitude: Number.parseFloat(form.lat || "0"),
        longitude: Number.parseFloat(form.lng || "0"),
      },
      mainImage,
    };
    try {
      if (editing) await update.mutateAsync({ id: editing.id, input });
      else await create.mutateAsync(input);
      toast.success(editing ? "Destinasi diperbarui" : "Destinasi ditambahkan");
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan destinasi");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Hapus destinasi ini?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Destinasi dihapus");
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const handleToggle = async (id: bigint) => {
    try {
      await toggle.mutateAsync(id);
      toast.success("Status diperbarui");
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Destinasi</h1>
        <Button
          type="button"
          onClick={openCreate}
          style={{ background: "#0E5A3F", color: "white" }}
          className="rounded-full"
          data-ocid="admin.destinations.add.button"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah
        </Button>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="admin.destinations.loading_state"
        >
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          data-ocid="admin.destinations.table"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Nama</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">
                  Kategori
                </th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">
                  Alamat
                </th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest, i) => (
                <tr
                  key={dest.id.toString()}
                  className="border-b last:border-0 hover:bg-secondary/30"
                  data-ocid={`admin.destinations.row.${i + 1}`}
                >
                  <td className="p-4 font-medium">{dest.name}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {dest.category}
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                    {dest.address}
                  </td>
                  <td className="p-4">
                    <Switch
                      checked={dest.active}
                      onCheckedChange={() => handleToggle(dest.id)}
                      data-ocid={`admin.destinations.toggle.${i + 1}`}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(dest)}
                        className="p-1.5 rounded-lg hover:bg-secondary"
                        data-ocid={`admin.destinations.edit.button.${i + 1}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(dest.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                        data-ocid={`admin.destinations.delete_button.${i + 1}`}
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
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.destinations.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Destinasi" : "Tambah Destinasi"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin.destinations.name.input"
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                data-ocid="admin.destinations.category.input"
              />
            </div>
            <div>
              <Label>Alamat</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                data-ocid="admin.destinations.address.input"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={4}
                placeholder="Deskripsi lengkap destinasi..."
                data-ocid="admin.destinations.description.input"
              />
            </div>
            <div>
              <Label>Petunjuk Arah</Label>
              <Textarea
                value={form.directions}
                onChange={(e) =>
                  setForm((f) => ({ ...f, directions: e.target.value }))
                }
                rows={4}
                placeholder="Petunjuk arah menuju destinasi..."
                data-ocid="admin.destinations.directions.input"
              />
            </div>
            <div>
              <Label>Foto Utama</Label>
              <div className="space-y-2">
                <Input
                  placeholder="URL foto (https://...)"
                  value={form.photoUrl}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      photoUrl: e.target.value,
                      photoFile: null,
                    }))
                  }
                  data-ocid="admin.destinations.photo_url.input"
                />
                <div className="text-xs text-muted-foreground text-center">
                  — atau —
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setForm((f) => ({ ...f, photoFile: file, photoUrl: "" }));
                  }}
                  data-ocid="admin.destinations.photo_file.input"
                />
                {(form.photoUrl || form.photoFile) && (
                  <p className="text-xs text-green-700">
                    {form.photoFile
                      ? `File dipilih: ${form.photoFile.name}`
                      : "URL foto ditambahkan"}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Latitude</Label>
                <Input
                  value={form.lat}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lat: e.target.value }))
                  }
                  data-ocid="admin.destinations.lat.input"
                />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input
                  value={form.lng}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lng: e.target.value }))
                  }
                  data-ocid="admin.destinations.lng.input"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                data-ocid="admin.destinations.featured.switch"
              />
              <Label>Destinasi Unggulan</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={save}
                disabled={create.isPending || update.isPending}
                className="flex-1"
                style={{ background: "#0E5A3F", color: "white" }}
                data-ocid="admin.destinations.save.button"
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
                data-ocid="admin.destinations.cancel.button"
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
