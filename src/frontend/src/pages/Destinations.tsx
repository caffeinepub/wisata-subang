import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import type { TourDestination } from "../backend";
import DestinationCard from "../components/DestinationCard";
import { SAMPLE_DESTINATIONS } from "../data/sampleData";
import { useActiveDestinations } from "../hooks/useQueries";

const CATEGORIES = [
  "Semua",
  "Wisata Alam",
  "Air Terjun",
  "Pantai",
  "Budaya",
  "Kuliner",
];

export default function Destinations() {
  const { data: destinations } = useActiveDestinations();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const items: TourDestination[] = (
    destinations?.length
      ? destinations
      : SAMPLE_DESTINATIONS.map((d, i) => ({
          ...d,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourDestination[];

  const filtered = items.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.address.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Semua" || d.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-secondary/20 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Destinasi Wisata Subang</h1>
          <p className="text-muted-foreground">
            Jelajahi {items.length}+ destinasi wisata terbaik di Subang
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari destinasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="destinations.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: category === cat ? "#0E5A3F" : "white",
                  color: category === cat ? "white" : "#374151",
                  border: "1px solid",
                  borderColor: category === cat ? "#0E5A3F" : "#E5E7EB",
                }}
                data-ocid="destinations.filter.tab"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="destinations.empty_state"
          >
            <p className="text-lg">Tidak ada destinasi ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest, i) => (
              <DestinationCard key={dest.id.toString()} dest={dest} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
