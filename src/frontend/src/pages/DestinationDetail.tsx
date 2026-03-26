import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Navigation,
  Star,
  Users,
} from "lucide-react";
import type { TourDestination, TourPackage } from "../backend";
import StarRating from "../components/StarRating";
import { SAMPLE_DESTINATIONS, SAMPLE_PACKAGES } from "../data/sampleData";
import { useActiveTourPackages, useDestination } from "../hooks/useQueries";

const DEST_IMAGES: Record<string, string> = {
  "Pemandian Air Panas Sari Ater":
    "/assets/generated/dest-sariater.dim_600x400.jpg",
  "Curug Cijalu": "/assets/generated/dest-cijalu.dim_600x400.jpg",
  "Gunung Burangrang": "/assets/generated/dest-burangrang.dim_600x400.jpg",
  "Terasering Ciater": "/assets/generated/dest-terasering.dim_600x400.jpg",
};

const formatIDR = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function DestinationDetail() {
  const { id } = useParams({ from: "/layout/destinations/$id" });
  const destId = BigInt(id);
  const { data, isLoading, isError } = useDestination(destId);
  const { data: packagesData } = useActiveTourPackages();

  const dest: TourDestination | null = (() => {
    try {
      if (data) return (data as [TourDestination, unknown])[0] ?? null;
      if (destId < BigInt(SAMPLE_DESTINATIONS.length)) {
        return {
          ...SAMPLE_DESTINATIONS[Number(destId)],
          id: destId,
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        } as TourDestination;
      }
      return null;
    } catch {
      return null;
    }
  })();

  const gallery: string[] = (() => {
    try {
      return (
        (data as [unknown, Array<{ getDirectURL(): string }>])?.[1]?.map((b) =>
          b.getDirectURL(),
        ) || []
      );
    } catch {
      return [];
    }
  })();

  const packages: TourPackage[] = (() => {
    if (packagesData && packagesData.length > 0)
      return packagesData as TourPackage[];
    return SAMPLE_PACKAGES.map((p, i) => ({
      ...p,
      id: BigInt(i),
      createdAt: BigInt(0),
      updatedAt: BigInt(0),
    }));
  })();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="destination.loading_state"
      >
        <div
          className="animate-spin w-8 h-8 border-2 rounded-full"
          style={{ borderTopColor: "#0E5A3F", borderColor: "#E5E7EB" }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="destination.error_state"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Gagal memuat destinasi. Silakan coba lagi.
          </p>
          <Link
            to="/destinations"
            className="text-sm font-semibold"
            style={{ color: "#0E5A3F" }}
          >
            Kembali ke Destinasi
          </Link>
        </div>
      </div>
    );
  }

  if (!dest) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="destination.error_state"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Destinasi tidak ditemukan
          </p>
          <Link
            to="/destinations"
            className="text-sm font-semibold"
            style={{ color: "#0E5A3F" }}
          >
            Kembali ke Destinasi
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = dest.mainImage
    ? dest.mainImage.getDirectURL()
    : DEST_IMAGES[dest.name] ||
      "/assets/generated/dest-terasering.dim_600x400.jpg";

  const loc = dest.location;
  const hasValidLocation =
    loc &&
    typeof loc.latitude === "number" &&
    typeof loc.longitude === "number" &&
    !Number.isNaN(loc.latitude) &&
    !Number.isNaN(loc.longitude) &&
    !(loc.latitude === 0 && loc.longitude === 0);

  const mapLat = hasValidLocation ? loc.latitude : -6.5;
  const mapLng = hasValidLocation ? loc.longitude : 107.7;

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.05}%2C${mapLat - 0.05}%2C${mapLng + 0.05}%2C${mapLat + 0.05}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

  return (
    <div className="min-h-screen">
      <div className="relative h-72 md:h-96">
        <img
          src={heroImage}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white"
            data-ocid="destination.back.link"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            {dest.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
              {dest.category}
            </span>
            <StarRating rating={dest.rating} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Map Section - always visible */}
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: "#E67E22" }} />
                Lokasi Destinasi
              </h2>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ height: "250px" }}
              >
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  title={`Peta ${dest.name}`}
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">Tentang Destinasi</h2>
              <p className="text-muted-foreground leading-relaxed">
                {dest.description}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Navigation className="w-5 h-5" style={{ color: "#E67E22" }} />
                Petunjuk Arah
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {dest.directions}
              </p>
            </div>
            {gallery.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3">Galeri Foto</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((url, i) => (
                    <div
                      key={url}
                      className="rounded-xl overflow-hidden aspect-square"
                    >
                      <img
                        src={url}
                        alt={`Galeri ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tour Packages Section */}
            {packages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">Paket Tour Tersedia</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg, i) => (
                    <div
                      key={pkg.id.toString()}
                      className="bg-white rounded-2xl shadow-card border border-border p-4 flex flex-col gap-3"
                      data-ocid={`packages.item.${i + 1}`}
                    >
                      <div>
                        <h3 className="font-bold text-sm leading-tight">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock
                            className="w-3.5 h-3.5"
                            style={{ color: "#E67E22" }}
                          />
                          {pkg.duration.toString()} Hari
                        </span>
                        <span className="flex items-center gap-1">
                          <Users
                            className="w-3.5 h-3.5"
                            style={{ color: "#0E5A3F" }}
                          />
                          Maks {pkg.maxParticipants.toString()} Orang
                        </span>
                      </div>
                      <div
                        className="font-bold text-base"
                        style={{ color: "#E67E22" }}
                      >
                        {formatIDR(pkg.price)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          /orang
                        </span>
                      </div>
                      {pkg.inclusions.length > 0 && (
                        <ul className="space-y-1">
                          {pkg.inclusions.slice(0, 3).map((inc) => (
                            <li
                              key={inc}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            >
                              <Check
                                className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: "#0E5A3F" }}
                              />
                              {inc}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link
                        to="/booking"
                        search={{
                          packageId: pkg.id.toString(),
                          tab: "package",
                        }}
                        className="mt-auto block text-center py-2 rounded-full text-white font-semibold text-xs"
                        style={{ background: "#E67E22" }}
                        data-ocid={`packages.book.button.${i + 1}`}
                      >
                        Pesan Sekarang
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-bold mb-4">Informasi</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#E67E22" }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {dest.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: "#E67E22" }} />
                  <span className="text-sm text-muted-foreground">
                    {dest.rating != null
                      ? (Number(dest.rating) / 10).toFixed(1)
                      : "0.0"}{" "}
                    / 5.0
                  </span>
                </div>
              </div>
              <Link
                to="/booking"
                search={{ packageId: "", tab: "" }}
                className="mt-4 block text-center py-3 rounded-full text-white font-semibold text-sm"
                style={{ background: "#E67E22" }}
                data-ocid="destination.book.button"
              >
                Pesan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
