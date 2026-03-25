import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { TourDestination } from "../backend";
import StarRating from "./StarRating";

const FALLBACK_IMAGES: Record<string, string> = {
  "Pemandian Air Panas Sari Ater":
    "/assets/generated/dest-sariater.dim_600x400.jpg",
  "Curug Cijalu": "/assets/generated/dest-cijalu.dim_600x400.jpg",
  "Gunung Burangrang": "/assets/generated/dest-burangrang.dim_600x400.jpg",
  "Terasering Ciater": "/assets/generated/dest-terasering.dim_600x400.jpg",
};

function getImageUrl(dest: TourDestination): string {
  if (dest.mainImage) return dest.mainImage.getDirectURL();
  return (
    FALLBACK_IMAGES[dest.name] ||
    "/assets/generated/dest-terasering.dim_600x400.jpg"
  );
}

export default function DestinationCard({
  dest,
  index,
}: { dest: TourDestination; index?: number }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hero transition-shadow group"
      data-ocid={`destinations.item.${(index ?? 0) + 1}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(dest)}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span
          className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full text-white"
          style={{ background: "#0E5A3F" }}
        >
          {dest.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">
          {dest.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{dest.address}</span>
        </div>
        <StarRating rating={dest.rating} />
        <Link
          to="/destinations/$id"
          params={{ id: dest.id.toString() }}
          className="mt-3 block text-center text-xs font-semibold py-2 rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: "#E67E22" }}
          data-ocid={`destinations.detail.button.${(index ?? 0) + 1}`}
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
