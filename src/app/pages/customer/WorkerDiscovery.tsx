import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Star, MapPin, CheckCircle, SlidersHorizontal, ChevronDown } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CustomerNav } from "../../components/shared/Nav";
import { A, WORKERS } from "../../constants";

// Fix default marker icons broken by Vite's asset handling
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const AVAILABILITY_STYLES: Record<string, string> = {
  Today:       "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  Tomorrow:    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  Unavailable: "text-red-500 bg-red-50 dark:bg-red-900/20",
};

// Fairview, QC center — matches the app's fictional location context
const MAP_CENTER: [number, number] = [14.7160, 121.0630];

function workerInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function createWorkerIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5"/>
      <polygon points="13,32 23,32 18,42" fill="${color}"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44],
  });
}

const userIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;background:${A};border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 4px ${A}40"></div>`,
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Forces map to recalculate size when the container becomes visible
function MapResizer({ visible }: { visible: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (visible) setTimeout(() => map.invalidateSize(), 50);
  }, [visible, map]);
  return null;
}

function WorkerMap({ onSelectWorker, visible }: { onSelectWorker: (id: number) => void; visible: boolean }) {
  // Philippines bounding box — prevents panning outside the country
  const philippinesBounds: L.LatLngBoundsExpression = [
    [4.5, 116.0],
    [21.5, 127.0],
  ];

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={14}
      minZoom={6}
      maxBounds={philippinesBounds}
      maxBoundsViscosity={1.0}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizer visible={visible} />

      {/* User location marker */}
      <Marker position={MAP_CENTER} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Worker markers */}
      {WORKERS.map((w) => {
        // Spread workers around the center using their mx/my as relative offsets
        const lat = MAP_CENTER[0] + (w.my - 270) * -0.0003;
        const lng = MAP_CENTER[1] + (w.mx - 320) *  0.0004;
        return (
          <Marker
            key={w.id}
            position={[lat, lng]}
            icon={createWorkerIcon(w.color)}
            eventHandlers={{ click: () => onSelectWorker(w.id) }}
          >
            <Popup>
              <div style={{ minWidth: 140 }}>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>{w.name}</p>
                <p style={{ color: "#64748b", fontSize: 12, marginBottom: 2 }}>{w.skill}</p>
                <p style={{ fontSize: 12, marginBottom: 6 }}>⭐ {w.rating} · {w.dist}</p>
                <button
                  onClick={() => onSelectWorker(w.id)}
                  style={{ background: A, color: "white", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", width: "100%" }}
                >
                  View Profile
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default function WorkerDiscovery({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [search, setSearch]           = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [mobileView, setMobileView]   = useState<"list" | "map">("list");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [maxDist, setMaxDist]               = useState<number | null>(null);

  const filteredWorkers = WORKERS.filter((w) => {
    if (search && !w.name.toLowerCase().includes(search.toLowerCase()) && !w.skill.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedSkills.length > 0 && !selectedSkills.includes(w.skill)) return false;
    if (verifiedOnly && w.status === "Unavailable") return false;
    if (maxDist !== null && parseFloat(w.dist) > maxDist) return false;
    return true;
  });

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: "100dvh" }}>
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      {/* Mobile view toggle */}
      <div className="md:hidden flex gap-1 p-2 border-b border-border bg-card shrink-0">
        {(["list", "map"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${mobileView === v ? "text-white" : "text-muted-foreground bg-muted"}`}
            style={mobileView === v ? { background: A } : {}}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <aside className={`${mobileView === "map" ? "hidden" : "flex"} md:flex w-full md:w-96 shrink-0 flex-col border-r border-border bg-card overflow-hidden`}>

          {/* Search + filters */}
          <div className="p-4 border-b border-border space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or skill..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
              />
            </div>

            <button
              onClick={() => setShowFilters((p) => !p)}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {showFilters && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Skill</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Plumber", "Electrician", "Mason", "Carpenter", "Painter"].map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                          selectedSkills.includes(s)
                            ? "text-white border-transparent"
                            : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                        style={selectedSkills.includes(s) ? { background: A } : {}}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Distance</p>
                  <div className="flex gap-1.5">
                    {[1, 3, 5].map((d) => (
                      <button
                        key={d}
                        onClick={() => setMaxDist((prev) => prev === d ? null : d)}
                        className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                          maxDist === d
                            ? "text-white border-transparent"
                            : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                        style={maxDist === d ? { background: A } : {}}
                      >
                        {d} km
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Only</span>
                  <button
                    onClick={() => setVerifiedOnly((p) => !p)}
                    className="w-10 h-5 rounded-full relative transition-colors shrink-0"
                    style={{ background: verifiedOnly ? A : "#CBD5E1" }}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${verifiedOnly ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Worker list */}
          <div className="flex-1 overflow-y-auto p-3 pb-20 md:pb-3 space-y-2">
            <p className="text-xs text-muted-foreground px-1">{filteredWorkers.length} workers found nearby</p>
            {filteredWorkers.map((w) => (
              <div
                key={w.id}
                onClick={() => navigate(`/app/worker/${w.id}`)}
                className="bg-background rounded-xl border border-border p-3.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: w.color }}>
                    {workerInitials(w.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm">{w.name}</p>
                      {w.status !== "Unavailable" && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{w.skill}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-0.5 text-xs font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {w.rating}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {w.dist}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[w.status] ?? ""}`}>
                        {w.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/app/worker/${w.id}`); }}
                  className="w-full mt-3 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: A }}
                >
                  View Profile
                </button>
              </div>
            ))}

            {filteredWorkers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm font-medium">No workers found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </aside>

        {/* Map — always mounted so Leaflet stays initialised; visibility toggled via CSS only */}
        <div className={`${mobileView === "list" ? "hidden" : "flex"} md:flex flex-1 relative flex-col`}>
          <div className="flex-1 pb-16 md:pb-0">
            <WorkerMap onSelectWorker={(id) => navigate(`/app/worker/${id}`)} visible={mobileView === "map"} />
          </div>
        </div>
      </div>
    </div>
  );
}
