import { Input } from "@/components/ui/input";
import { Globe, MapPin, Phone, Search } from "lucide-react";
import { useState } from "react";
import type { Hotel } from "../backend";
import StarRating from "../components/StarRating";
import { SAMPLE_HOTELS } from "../data/sampleData";
import { useActiveHotels } from "../hooks/useQueries";

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

export default function Hotels() {
  const { data: hotels } = useActiveHotels();
  const [search, setSearch] = useState("");

  const items: Hotel[] = (
    hotels?.length
      ? hotels
      : SAMPLE_HOTELS.map((h, i) => ({
          ...h,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as Hotel[];

  const filtered = items.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hotel & Penginapan</h1>
            <p className="text-muted-foreground">
              Temukan penginapan terbaik di Subang
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari hotel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="hotels.search_input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((hotel, i) => (
            <div
              key={hotel.id.toString()}
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hero transition-shadow"
              data-ocid={`hotels.item.${i + 1}`}
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={
                    HOTEL_IMAGES[hotel.name] ||
                    "/assets/generated/hotel-sariater.dim_600x400.jpg"
                  }
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold">{hotel.name}</h3>
                  <span
                    className="font-bold text-sm flex-shrink-0"
                    style={{ color: "#E67E22" }}
                  >
                    {formatPrice(hotel.pricePerNight)}
                    <span className="font-normal text-xs text-muted-foreground">
                      /mlm
                    </span>
                  </span>
                </div>
                <StarRating rating={hotel.rating} size="md" />
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{hotel.address}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {hotel.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {hotel.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <a
                    href={`tel:${hotel.phone}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="w-3 h-3" /> {hotel.phone}
                  </a>
                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#0E5A3F" }}
                    >
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
