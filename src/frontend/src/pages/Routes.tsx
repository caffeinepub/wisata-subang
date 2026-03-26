import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Flag,
  Info,
  Loader2,
  MapPin,
  Navigation,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { TourDestination } from "../backend";
import { useActiveDestinations } from "../hooks/useQueries";

const POINT_A = {
  lat: -6.57,
  lng: 107.7588,
  label: "Alun-Alun Subang, Kota Subang",
};

interface OsrmStep {
  maneuver: {
    type: string;
    modifier?: string;
  };
  name: string;
  distance: number;
}

interface RouteData {
  coordinates: [number, number][];
  steps: OsrmStep[];
  totalDistance: number;
  totalDuration: number;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} jam ${m} mnt` : `${h} jam`;
  }
  return `${mins} mnt`;
}

function StepIcon({ type, modifier }: { type: string; modifier?: string }) {
  if (type === "arrive") return <Flag className="w-4 h-4 text-green-700" />;
  if (type === "depart")
    return <Navigation className="w-4 h-4 text-green-700" />;
  if (
    modifier === "left" ||
    modifier === "sharp left" ||
    modifier === "slight left"
  )
    return <ArrowLeft className="w-4 h-4 text-orange-500" />;
  if (
    modifier === "right" ||
    modifier === "sharp right" ||
    modifier === "slight right"
  )
    return <ArrowRight className="w-4 h-4 text-blue-500" />;
  return <ArrowUp className="w-4 h-4 text-gray-500" />;
}

function stepLabel(type: string, modifier?: string): string {
  if (type === "arrive") return "Tiba di tujuan";
  if (type === "depart") return "Mulai perjalanan";
  if (type === "turn") {
    if (modifier === "left" || modifier === "sharp left") return "Belok kiri";
    if (modifier === "right" || modifier === "sharp right")
      return "Belok kanan";
    if (modifier === "slight left") return "Sedikit belok kiri";
    if (modifier === "slight right") return "Sedikit belok kanan";
    if (modifier === "straight") return "Lurus";
    if (modifier === "uturn") return "Putar balik";
  }
  if (type === "continue") return "Terus";
  if (type === "fork") {
    if (modifier?.includes("left")) return "Ambil jalur kiri";
    if (modifier?.includes("right")) return "Ambil jalur kanan";
  }
  if (type === "merge") return "Gabung ke jalan";
  if (type === "roundabout") return "Masuk bundaran";
  if (type === "exit roundabout") return "Keluar bundaran";
  return "Ikuti jalan";
}

export default function RoutesPage() {
  const { data: destinations, isLoading: destLoading } =
    useActiveDestinations();
  const [selectedId, setSelectedId] = useState<string>("");
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  const selectedDest = destinations?.find(
    (d: TourDestination) => d.id.toString() === selectedId,
  ) as TourDestination | undefined;

  useEffect(() => {
    if (!selectedDest) {
      setRouteData(null);
      return;
    }
    const { latitude: latB, longitude: lngB } = selectedDest.location;
    if (!latB || !lngB) return;

    setRouteLoading(true);
    setRouteError("");
    setRouteData(null);

    const url = `https://router.project-osrm.org/route/v1/driving/${POINT_A.lng},${POINT_A.lat};${lngB},${latB}?steps=true&geometries=geojson&overview=full`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!data.routes || data.routes.length === 0) {
          setRouteError("Rute tidak ditemukan.");
          return;
        }
        const route = data.routes[0];
        const coords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]],
        );
        const steps: OsrmStep[] = route.legs[0].steps || [];
        setRouteData({
          coordinates: coords,
          steps,
          totalDistance: route.distance,
          totalDuration: route.duration,
        });
      })
      .catch(() => setRouteError("Gagal mengambil data rute. Coba lagi."))
      .finally(() => setRouteLoading(false));
  }, [selectedDest]);

  // Build map iframe URL
  const mapSrc = selectedDest
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(POINT_A.lng, selectedDest.location.longitude) - 0.05},${Math.min(POINT_A.lat, selectedDest.location.latitude) - 0.05},${Math.max(POINT_A.lng, selectedDest.location.longitude) + 0.05},${Math.max(POINT_A.lat, selectedDest.location.latitude) + 0.05}&layer=mapnik&marker=${POINT_A.lat},${POINT_A.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${POINT_A.lng - 0.1},${POINT_A.lat - 0.1},${POINT_A.lng + 0.1},${POINT_A.lat + 0.1}&layer=mapnik&marker=${POINT_A.lat},${POINT_A.lng}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div
        className="relative py-16 px-4 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0E5A3F 0%, #1a7a58 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          {[48, 128, 208, 288, 368, 448].map((size) => (
            <div
              key={size}
              className="absolute rounded-full border border-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-4">
            <Navigation className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">
              Panduan Perjalanan
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Rute Menuju Destinasi
          </h1>
          <p className="text-white/75 max-w-xl mx-auto">
            Dari Kota Subang (Alun-Alun Subang) menuju destinasi wisata
            pilihanmu — lengkap dengan petunjuk arah.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Destination Selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-border p-5 mb-6"
        >
          <label
            htmlFor="dest-select"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Pilih Destinasi Tujuan (Titik B)
          </label>
          <div className="relative">
            <select
              id="dest-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none bg-secondary/30 border border-border rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer"
              data-ocid="routes.select"
              disabled={destLoading}
            >
              <option value="">
                {destLoading ? "Memuat destinasi..." : "-- Pilih destinasi --"}
              </option>
              {destinations?.map((d: TourDestination) => (
                <option key={d.id.toString()} value={d.id.toString()}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </motion.div>

        {/* Route Info Bar */}
        {routeData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4 mb-5"
          >
            <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-xs text-green-700 font-medium mb-1">
                Jarak Total
              </p>
              <p className="text-xl font-bold text-green-800">
                {formatDistance(routeData.totalDistance)}
              </p>
            </div>
            <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-xs text-green-700 font-medium mb-1">
                Estimasi Waktu
              </p>
              <p className="text-xl font-bold text-green-800">
                {formatDuration(routeData.totalDuration)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Map via iframe */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl overflow-hidden border border-border shadow-sm mb-6"
          style={{ height: "400px" }}
          data-ocid="routes.canvas_target"
        >
          <iframe
            key={selectedId || "default"}
            src={mapSrc}
            title="Peta Rute"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </motion.div>

        {/* Loading / Error */}
        {routeLoading && (
          <div
            className="flex items-center justify-center gap-3 py-8 text-green-700"
            data-ocid="routes.loading_state"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Mengambil data rute...</span>
          </div>
        )}
        {routeError && (
          <div
            className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6"
            data-ocid="routes.error_state"
          >
            {routeError}
          </div>
        )}

        {/* Step-by-step directions */}
        {routeData && routeData.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: "#0E5A3F" }} />
              Petunjuk Arah
            </h2>
            <div className="space-y-2">
              {routeData.steps.map((step, i) => (
                <motion.div
                  key={`step-${step.maneuver.type}-${step.name}-${i}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="flex items-start gap-4 bg-white border border-border rounded-xl px-4 py-3 shadow-xs"
                  data-ocid={`routes.item.${i + 1}`}
                >
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                    <StepIcon
                      type={step.maneuver.type}
                      modifier={step.maneuver.modifier}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {stepLabel(step.maneuver.type, step.maneuver.modifier)}
                    </p>
                    {step.name && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {step.name}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 self-center">
                    {formatDistance(step.distance)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Extra directions from destination */}
            {selectedDest?.directions &&
              selectedDest.directions.trim() !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">
                        Petunjuk Tambahan
                      </p>
                      <p className="text-sm text-amber-700 leading-relaxed">
                        {selectedDest.directions}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
          </motion.div>
        )}

        {/* Empty state */}
        {!selectedId && !routeLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground"
            data-ocid="routes.empty_state"
          >
            <Navigation className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">
              Pilih destinasi untuk melihat rute perjalanan
            </p>
            <p className="text-sm mt-1 opacity-70">
              Rute akan ditampilkan dari Kota Subang (Alun-Alun Subang) menuju
              tujuanmu
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
