import { useEffect, useRef } from "react";

const SPONSORS = [
  { name: "Dinas Pariwisata", abbr: "DP", color: "#0E5A3F" },
  { name: "Bank BJB", abbr: "BJB", color: "#1A6CB0" },
  { name: "Telkomsel", abbr: "TEL", color: "#E60026" },
  { name: "Pertamina", abbr: "PTM", color: "#1565C0" },
  { name: "BRI", abbr: "BRI", color: "#0052A5" },
  { name: "Mandiri", abbr: "MDR", color: "#003D7C" },
  { name: "Subang Regency", abbr: "SUB", color: "#E67E22" },
  { name: "Indomaret", abbr: "IDM", color: "#E11D2C" },
  { name: "Alfamart", abbr: "ALF", color: "#E30016" },
  { name: "Gojek", abbr: "GO", color: "#00AA13" },
];

// Duplicate for seamless loop
const ALL_SPONSORS = [
  ...SPONSORS.map((s, i) => ({ ...s, uid: `a-${i}` })),
  ...SPONSORS.map((s, i) => ({ ...s, uid: `b-${i}` })),
];

export default function SponsorSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animId: number;
    let pos = 0;
    const speed = 0.6; // px per frame

    function step() {
      pos += speed;
      // Reset when half scrolled (since we duplicated the list)
      const halfWidth = track!.scrollWidth / 2;
      if (pos >= halfWidth) pos = 0;
      track!.style.transform = `translateX(-${pos}px)`;
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="w-full overflow-hidden bg-white border-b border-gray-100 shadow-sm"
      style={{ position: "sticky", top: "64px", zIndex: 40, height: "64px" }}
    >
      <div
        className="absolute inset-y-0 left-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, white, transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, white, transparent)" }}
      />

      <div className="flex items-center h-full">
        <div
          ref={trackRef}
          className="flex items-center gap-6 will-change-transform"
          style={{ whiteSpace: "nowrap" }}
        >
          {ALL_SPONSORS.map((sponsor) => (
            <div
              key={sponsor.uid}
              className="flex items-center gap-2 flex-shrink-0"
              title={sponsor.name}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm"
                style={{
                  background: sponsor.color,
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                }}
              >
                {sponsor.abbr}
              </div>
              <span
                className="text-xs text-gray-500 font-medium"
                style={{ minWidth: "60px" }}
              >
                {sponsor.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
