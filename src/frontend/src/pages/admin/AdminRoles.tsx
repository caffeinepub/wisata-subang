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
import { Principal } from "@dfinity/principal";
import {
  Copy,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserRole } from "../../backend";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useAssignRole, useBootstrapAdmin } from "../../hooks/useQueries";

const ROLE_INFO = [
  {
    role: "admin" as UserRole,
    label: "Admin",
    description:
      "Akses penuh ke panel admin — dapat mengelola semua konten dan pengguna.",
    icon: ShieldCheck,
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
  {
    role: "user" as UserRole,
    label: "User",
    description:
      "Pengguna terdaftar — dapat melakukan booking dan mengakses fitur member.",
    icon: User,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    role: "guest" as UserRole,
    label: "Guest",
    description:
      "Pengguna tamu (default) — akses terbatas hanya untuk melihat konten publik.",
    icon: Users,
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
  },
];

export default function AdminRoles() {
  const [principalText, setPrincipalText] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [principalError, setPrincipalError] = useState("");
  const { mutate: assignRole, isPending } = useAssignRole();
  const { mutate: bootstrapAdmin, isPending: isBootstrapping } =
    useBootstrapAdmin();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  function validatePrincipal(text: string): Principal | null {
    try {
      return Principal.fromText(text.trim());
    } catch {
      return null;
    }
  }

  function handlePrincipalChange(value: string) {
    setPrincipalText(value);
    if (principalError && value) setPrincipalError("");
  }

  function handleCopyMyPrincipal() {
    if (myPrincipal) {
      navigator.clipboard.writeText(myPrincipal);
      toast.success("Principal ID disalin ke clipboard.");
    }
  }

  function handleFillMyPrincipal() {
    if (myPrincipal) {
      setPrincipalText(myPrincipal);
      setPrincipalError("");
    }
  }

  function handleBootstrap() {
    bootstrapAdmin(undefined, {
      onSuccess: () => {
        toast.success("Anda sekarang menjadi admin pertama!");
      },
      onError: (err) => {
        toast.error(`Gagal: ${err.message}`);
      },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPrincipalError("");

    const principal = validatePrincipal(principalText);
    if (!principal) {
      setPrincipalError(
        "Format Principal ID tidak valid. Pastikan format sudah benar.",
      );
      return;
    }
    if (!role) {
      toast.error("Pilih role terlebih dahulu.");
      return;
    }

    assignRole(
      { user: principal as any, role: role as UserRole },
      {
        onSuccess: () => {
          toast.success(`Role "${role}" berhasil ditetapkan ke pengguna.`);
          setPrincipalText("");
          setRole("");
        },
        onError: (err) => {
          toast.error(`Gagal menetapkan role: ${err.message}`);
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Kelola Role Pengguna
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tetapkan peran akses untuk pengguna berdasarkan Principal ID mereka.
        </p>
      </div>

      {/* My Principal ID */}
      {myPrincipal && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-semibold text-blue-700">
              Principal ID Anda
            </span>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-gray-700 bg-white border rounded px-2 py-1 flex-1 truncate">
              {myPrincipal}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyMyPrincipal}
              className="shrink-0"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              Salin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillMyPrincipal}
              className="shrink-0"
            >
              Isi
            </Button>
          </div>
        </div>
      )}

      {/* Bootstrap admin section */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span className="text-sm font-semibold text-amber-700">
            Jadikan Saya Admin Pertama
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Jika belum ada admin sama sekali, klik tombol ini untuk menjadikan
          akun Anda sebagai admin pertama.
        </p>
        <Button
          type="button"
          onClick={handleBootstrap}
          disabled={isBootstrapping}
          variant="outline"
          className="border-amber-400 text-amber-800 hover:bg-amber-100"
          data-ocid="roles.bootstrap_button"
        >
          {isBootstrapping ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...
            </>
          ) : (
            "Jadikan Saya Admin"
          )}
        </Button>
      </div>

      {/* Role info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLE_INFO.map(
          ({ role: r, label, description, icon: Icon, color, bg }) => (
            <div
              key={r}
              className={`rounded-xl border p-4 ${bg}`}
              data-ocid={`roles.${r}.card`}
            >
              <div className={`flex items-center gap-2 mb-2 ${color}`}>
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{label}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Assignment form */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5" style={{ color: "#0E5A3F" }} />
          <h2 className="font-semibold text-foreground">
            Assign Role ke Pengguna
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          data-ocid="roles.dialog"
        >
          <div>
            <Label
              htmlFor="principal"
              className="text-sm font-medium mb-1.5 block"
            >
              Principal ID Pengguna
            </Label>
            <Input
              id="principal"
              placeholder="Contoh: aaaaa-bbbbb-ccccc-ddddd-eee"
              value={principalText}
              onChange={(e) => handlePrincipalChange(e.target.value)}
              className={`font-mono text-sm ${
                principalError
                  ? "border-red-400 focus-visible:ring-red-400"
                  : ""
              }`}
              data-ocid="roles.input"
            />
            {principalError && (
              <p
                className="text-xs text-red-600 mt-1.5 flex items-center gap-1"
                data-ocid="roles.error_state"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {principalError}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger data-ocid="roles.select">
                <SelectValue placeholder="Pilih role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin — Akses penuh</SelectItem>
                <SelectItem value="user">User — Pengguna terdaftar</SelectItem>
                <SelectItem value="guest">Guest — Pengguna tamu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isPending || !principalText || !role}
            className="w-full"
            style={{ background: "#0E5A3F" }}
            data-ocid="roles.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menetapkan...
              </>
            ) : (
              "Tetapkan Role"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
