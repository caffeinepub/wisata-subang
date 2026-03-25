import { Mail, MapPin, Phone } from "lucide-react";
import type { TourAgency } from "../backend";
import { SAMPLE_AGENCIES } from "../data/sampleData";
import { useActiveAgencies } from "../hooks/useQueries";

export default function Agencies() {
  const { data: agencies } = useActiveAgencies();
  const items: TourAgency[] = (
    agencies?.length
      ? agencies
      : SAMPLE_AGENCIES.map((a, i) => ({
          ...a,
          id: BigInt(i),
          createdAt: BigInt(0),
          updatedAt: BigInt(0),
        }))
  ) as TourAgency[];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Direktori Tour & Travel</h1>
          <p className="text-muted-foreground">
            Agen wisata terpercaya untuk perjalanan Anda ke Subang
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((agency, i) => (
            <div
              key={agency.id.toString()}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hero transition-shadow"
              data-ocid={`agencies.item.${i + 1}`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "#0E5A3F" }}
              >
                <span className="text-white font-bold text-xl">
                  {agency.name[0]}
                </span>
              </div>
              <h3 className="font-bold mb-2">{agency.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {agency.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {agency.services.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 rounded-full text-white"
                    style={{ background: "#0E5A3F" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href={`tel:${agency.phone}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Phone className="w-4 h-4" /> {agency.phone}
                </a>
                <a
                  href={`mailto:${agency.email}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Mail className="w-4 h-4" /> {agency.email}
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" /> {agency.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
