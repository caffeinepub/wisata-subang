import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin, Phone, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type {
  Hotel,
  TourAgency,
  TourDestination,
  TourPackage,
} from "../backend";
import DestinationCard from "../components/DestinationCard";
import StarRating from "../components/StarRating";
import {
  SAMPLE_AGENCIES,
  SAMPLE_DESTINATIONS,
  SAMPLE_HOTELS,
  SAMPLE_PACKAGES,
} from "../data/sampleData";
import { useHomePageData } from "../hooks/useQueries";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

const HOTEL_IMAGES: Record<string, string> = {
  "Hotel Sari Ater": "/assets/generated/hotel-sariater.dim_600x400.jpg",
  "Ciater Highland Resort": "/assets/generated/hotel-highland.dim_600x400.jpg",
  "Grand Pasundan Hotel": "/assets/generated/hotel-sariater.dim_600x400.jpg",
  "Kampung Daun Culture Gallery & Cafe":
    "/assets/generated/hotel-highland.dim_600x400.jpg",
};

export default function Home() {
  const { data: homeData } = useHomePageData();
  const [destIdx, setDestIdx] = useState(0);
  const [pkgIdx, setPkgIdx] = useState(0);
  const [hotelIdx, setHotelIdx] = useState(0);

  const featuredDest: TourDestination[] = (
    homeData?.featuredDestinations?.length
      ? homeData.featuredDestinations
      : SAMPLE_DESTINATIONS.filter((d) => d.featured).map((d, i) => ({
          ...d,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourDestination[];

  const packages: TourPackage[] = (
    homeData?.tourPackages?.length
      ? homeData.tourPackages
      : SAMPLE_PACKAGES.map((p, i) => ({
          ...p,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourPackage[];

  const hotels: Hotel[] = (
    homeData?.popularHotels?.length
      ? homeData.popularHotels
      : SAMPLE_HOTELS.map((h, i) => ({
          ...h,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as Hotel[];

  const agencies: TourAgency[] = (
    homeData?.agencies?.length
      ? homeData.agencies
      : SAMPLE_AGENCIES.map((a, i) => ({
          ...a,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourAgency[];

  return (
    <div className="-mt-20">
      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-subang.dim_1400x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto pt-24"
        >
          <h1 className="text-5xl md:text-6xl font-black uppercase leading-tight tracking-tight mb-6">
            Jelajahi Keindahan Subang
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
            Temukan destinasi wisata terbaik di Subang — dari alam pegunungan
            hingga pemandian air panas
          </p>
          <Link
            to="/destinations"
            className="inline-block px-8 py-4 rounded-full font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#E67E22" }}
            data-ocid="hero.explore.button"
          >
            Jelajahi Destinasi
          </Link>
        </motion.div>
      </section>

      {/* Featured Destinations */}
      <section className="section-green py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Destinasi Unggulan
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDestIdx(Math.max(0, destIdx - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.2)" }}
                aria-label="Sebelumnya"
                data-ocid="featured.destinations.pagination_prev"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setDestIdx(
                    Math.min(Math.max(0, featuredDest.length - 3), destIdx + 1),
                  )
                }
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: "#E67E22" }}
                aria-label="Selanjutnya"
                data-ocid="featured.destinations.pagination_next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDest.slice(destIdx, destIdx + 3).map((dest, i) => (
              <DestinationCard key={dest.id.toString()} dest={dest} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Peta Destinasi Subang
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Temukan lokasi semua destinasi wisata di Subang
          </p>
          <div
            className="rounded-2xl overflow-hidden shadow-card"
            style={{ height: "420px" }}
          >
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=107.4%2C-6.85%2C107.9%2C-6.05&layer=mapnik&marker=-6.5833%2C107.7667"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Peta Destinasi Subang"
              loading="lazy"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {featuredDest.slice(0, 3).map((dest) => (
              <div
                key={dest.id.toString()}
                className="flex items-center gap-2 bg-secondary rounded-lg p-3"
              >
                <MapPin
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#E67E22" }}
                />
                <span className="text-xs font-medium line-clamp-1">
                  {dest.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages & Hotels */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Packages */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Paket Tour Pilihan</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPkgIdx(Math.max(0, pkgIdx - 1))}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:bg-secondary"
                  data-ocid="packages.pagination_prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPkgIdx(
                      Math.min(Math.max(0, packages.length - 2), pkgIdx + 1),
                    )
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ background: "#E67E22" }}
                  data-ocid="packages.pagination_next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {packages.slice(pkgIdx, pkgIdx + 2).map((pkg, i) => (
                <div
                  key={pkg.id.toString()}
                  className="bg-white rounded-2xl p-4 shadow-card"
                  data-ocid={`packages.item.${i + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
                      <img
                        src="/assets/generated/dest-terasering.dim_600x400.jpg"
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#E67E22" }}
                        >
                          {formatPrice(pkg.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {pkg.duration.toString()} Hari
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/packages"
              className="mt-4 block text-center text-sm font-semibold py-2 rounded-full border"
              style={{ borderColor: "#0E5A3F", color: "#0E5A3F" }}
              data-ocid="packages.view_all.link"
            >
              Lihat Semua Paket
            </Link>
          </div>

          {/* Hotels */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Hotel & Penginapan</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHotelIdx(Math.max(0, hotelIdx - 1))}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:bg-secondary"
                  data-ocid="hotels.pagination_prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setHotelIdx(
                      Math.min(Math.max(0, hotels.length - 2), hotelIdx + 1),
                    )
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ background: "#E67E22" }}
                  data-ocid="hotels.pagination_next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {hotels.slice(hotelIdx, hotelIdx + 2).map((hotel, i) => (
                <div
                  key={hotel.id.toString()}
                  className="bg-white rounded-2xl overflow-hidden shadow-card flex"
                  data-ocid={`hotels.item.${i + 1}`}
                >
                  <div className="w-24 flex-shrink-0">
                    <img
                      src={
                        HOTEL_IMAGES[hotel.name] ||
                        "/assets/generated/hotel-sariater.dim_600x400.jpg"
                      }
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {hotel.name}
                    </h3>
                    <StarRating rating={hotel.rating} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {hotel.amenities.slice(0, 2).join(" · ")}
                    </p>
                    <span
                      className="text-xs font-bold mt-1 block"
                      style={{ color: "#E67E22" }}
                    >
                      {formatPrice(hotel.pricePerNight)}/malam
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/hotels"
              className="mt-4 block text-center text-sm font-semibold py-2 rounded-full border"
              style={{ borderColor: "#0E5A3F", color: "#0E5A3F" }}
              data-ocid="hotels.view_all.link"
            >
              Lihat Semua Hotel
            </Link>
          </div>
        </div>
      </section>

      {/* Tour & Travel Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Layanan Tour & Travel</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Temukan agen wisata terpercaya yang siap membantu perjalanan Anda
              ke Subang. Dari paket ekonomis hingga premium, semua tersedia
              untuk memenuhi kebutuhan wisata Anda.
            </p>
            <Link
              to="/agencies"
              className="inline-block px-6 py-3 rounded-full text-white font-semibold text-sm"
              style={{ background: "#0E5A3F" }}
              data-ocid="agencies.view_all.link"
            >
              Lihat Direktori
            </Link>
          </div>
          <div className="space-y-4">
            {agencies.slice(0, 3).map((agency, i) => (
              <div
                key={agency.id.toString()}
                className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4"
                data-ocid={`agencies.item.${i + 1}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0E5A3F" }}
                >
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{agency.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {agency.services.slice(0, 2).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span className="truncate max-w-[80px]">{agency.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Strip */}
      <section className="py-16 px-4" style={{ background: "#E67E22" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Pesan Petualangan Anda
            </h2>
            <p className="text-white/80 mb-6 text-sm">
              Bayar mudah dengan e-wallet favorit Anda
            </p>
            <div className="flex flex-wrap gap-3">
              {["OVO", "GoPay", "DANA", "LinkAja"].map((wallet) => (
                <div
                  key={wallet}
                  className="bg-white rounded-lg px-4 py-2 text-sm font-bold"
                  style={{ color: "#E67E22" }}
                >
                  {wallet}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-hero">
            <h3 className="font-bold mb-4 text-sm">Form Pemesanan Cepat</h3>
            <Link
              to="/booking"
              className="block w-full text-center py-3 rounded-full text-white font-semibold"
              style={{ background: "#E67E22" }}
              data-ocid="booking.quick.button"
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
