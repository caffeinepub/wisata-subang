import { Link } from "@tanstack/react-router";
import { Check, Clock, Users } from "lucide-react";
import type { TourPackage } from "../backend";
import { SAMPLE_PACKAGES } from "../data/sampleData";
import { useActiveTourPackages } from "../hooks/useQueries";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

const PKG_IMAGES = [
  "/assets/generated/dest-sariater.dim_600x400.jpg",
  "/assets/generated/dest-terasering.dim_600x400.jpg",
  "/assets/generated/dest-burangrang.dim_600x400.jpg",
];

export default function Packages() {
  const { data: packages } = useActiveTourPackages();
  const items: TourPackage[] = (
    packages?.length
      ? packages
      : SAMPLE_PACKAGES.map((p, i) => ({
          ...p,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourPackage[];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paket Wisata Subang</h1>
          <p className="text-muted-foreground">
            Pilih paket wisata yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((pkg, i) => (
            <div
              key={pkg.id.toString()}
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hero transition-shadow"
              data-ocid={`packages.item.${i + 1}`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={PKG_IMAGES[i % PKG_IMAGES.length]}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {pkg.description}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{pkg.duration.toString()} Hari</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Maks {pkg.maxParticipants.toString()} Orang</span>
                  </div>
                </div>
                <ul className="space-y-1 mb-4">
                  {pkg.inclusions.slice(0, 3).map((inc) => (
                    <li
                      key={inc}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Check
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: "#0E5A3F" }}
                      />
                      {inc}
                    </li>
                  ))}
                  {pkg.inclusions.length > 3 && (
                    <li className="text-xs text-muted-foreground">
                      +{pkg.inclusions.length - 3} lainnya
                    </li>
                  )}
                </ul>
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-lg"
                    style={{ color: "#E67E22" }}
                  >
                    {formatPrice(pkg.price)}
                  </span>
                  <Link
                    to="/booking"
                    className="px-4 py-2 rounded-full text-white text-sm font-semibold"
                    style={{ background: "#E67E22" }}
                    data-ocid={`packages.book.button.${i + 1}`}
                  >
                    Pesan
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
