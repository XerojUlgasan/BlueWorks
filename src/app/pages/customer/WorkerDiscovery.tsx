import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Search, Star, MapPin, CheckCircle, SlidersHorizontal, ChevronDown, Users, ChevronUp, RotateCcw, Crosshair, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CustomerNav } from "../../components/shared/Nav";
import { A, WORKERS } from "../../constants";

const markerIcon2x = new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href;
const markerIcon = new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href;
const markerShadow = new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href;

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const AVAILABILITY_STYLES: Record<string, string> = {
  Today:       "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
  Tomorrow:    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30",
  Unavailable: "text-red-500 bg-red-50 dark:bg-red-900/30",
};

const SKILL_FILTERS = ["Plumber", "Electrician", "Mason", "Carpenter", "Painter"] as const;
const DISTANCE_FILTERS = [1, 3, 5] as const;

const MAP_CENTER: [number, number] = [14.7160, 121.0630];

const SHEET_COLLAPSED_PX = 68;  // just handle + header row
const SHEET_PEEK_PX      = 240; // search + chips + ~1 card
const SHEET_MID_PX       = 700; // ~3-4 cards visible
const SHEET_FULL_PX      = typeof window !== "undefined"
  ? window.innerHeight - 57 - 56
  : 620;

const SNAP_POINTS = ["collapsed", "peek", "mid", "full"] as const;
type SnapPoint = typeof SNAP_POINTS[number];
type LocationModal = "closed" | "open" | "picking" | "confirm";

function ConfirmPinModal({ latlng, onConfirm, onCancel }: {
  latlng: L.LatLng | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!latlng) return null;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onCancel}
    >
      <div
        className="bg-card dark:bg-slate-800 rounded-2xl shadow-2xl border border-border p-5 w-72 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 28 36"><circle cx="14" cy="14" r="12" fill="#ef4444" stroke="white" strokeWidth="2"/><polygon points="10,24 18,24 14,34" fill="#ef4444"/><circle cx="14" cy="14" r="5" fill="white"/></svg>
          <p className="text-sm font-bold">Confirm Location</p>
        </div>
        <p className="text-xs text-muted-foreground">Pin this as your location?</p>
        <div className="bg-muted rounded-xl px-3 py-2 text-xs font-mono text-muted-foreground break-all">
          {latlng.lat.toFixed(5)}, {latlng.lng.toFixed(5)}
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">Back</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "#ef4444" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function PinpointModal({ state, onGPS, onManual, onClose }: {
  state: LocationModal;
  onGPS: () => void;
  onManual: () => void;
  onClose: () => void;
}) {
  if (state !== "open") return null;
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-card dark:bg-slate-800 rounded-2xl shadow-2xl border border-border p-5 w-72 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-bold">Set Your Location</p>
        <p className="text-xs text-muted-foreground">How would you like to set your pinpoint?</p>
        <button
          onClick={onGPS}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium"
        >
          <Navigation className="w-4 h-4 text-blue-500" />
          Use GPS / Device Location
        </button>
        <button
          onClick={onManual}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
        >
          <MapPin className="w-4 h-4 text-red-500" />
          Mark Manually on Map
        </button>
        <button onClick={onClose} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors pt-1">Cancel</button>
      </div>
    </div>
  );
}

function workerInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function createWorkerIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="2.5"/>
      <polygon points="13,32 23,32 18,42" fill="${color}"/>
    </svg>`;
  return L.divIcon({ html: svg, className: "", iconSize: [36, 44], iconAnchor: [18, 42], popupAnchor: [0, -44] });
}

const userIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;background:${A};border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 4px ${A}40"></div>`,
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 80);
  }, [map]);
  return null;
}

function MapCenterTracker({ onChange, offsetY }: { onChange: (latlng: L.LatLng) => void; offsetY: number }) {
  const map = useMapEvents({
    move()    { onChange(map.containerPointToLatLng([map.getSize().x / 2, map.getSize().y / 2 - offsetY])); },
    moveend() { onChange(map.containerPointToLatLng([map.getSize().x / 2, map.getSize().y / 2 - offsetY])); },
  });
  useEffect(() => {
    onChange(map.containerPointToLatLng([map.getSize().x / 2, map.getSize().y / 2 - offsetY]));
  }, [offsetY]);
  return null;
}

const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><circle cx="14" cy="14" r="12" fill="#ef4444" stroke="white" stroke-width="2"/><polygon points="10,24 18,24 14,34" fill="#ef4444"/><circle cx="14" cy="14" r="5" fill="white"/></svg>`,
  className: "",
  iconSize: [28, 36],
  iconAnchor: [14, 34],
  popupAnchor: [0, -36],
});

function WorkerMap({ onSelectWorker, pinPos, pickingPin, onCenterChange, pickOffsetY = 0 }: {
  onSelectWorker: (id: number) => void;
  pinPos: L.LatLng | null;
  pickingPin: boolean;
  onCenterChange: (latlng: L.LatLng) => void;
  pickOffsetY?: number;
}) {
  const philippinesBounds: L.LatLngBoundsExpression = [[4.5, 116.0], [21.5, 127.0]];
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={14}
      minZoom={6}
      maxBounds={philippinesBounds}
      maxBoundsViscosity={1.0}
      style={{ width: "100%", height: "100%", cursor: pickingPin ? "crosshair" : undefined }}
      zoomControl={false}
    >
      <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapResizer />
      {pickingPin && <MapCenterTracker onChange={onCenterChange} offsetY={pickOffsetY} />}
      {pinPos && (
        <Marker position={pinPos} icon={pinIcon}>
          <Popup>📍 Your pinned location</Popup>
        </Marker>
      )}
      <Marker position={MAP_CENTER} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
      {WORKERS.map((w) => {
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

function WorkerCardSkeleton() {
  return (
    <div className="w-full bg-background dark:bg-white/5 rounded-2xl border border-border p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-muted rounded-full w-32" />
          <div className="h-3 bg-muted rounded-full w-20" />
          <div className="flex gap-2 mt-1">
            <div className="h-3 bg-muted rounded-full w-10" />
            <div className="h-3 bg-muted rounded-full w-14" />
            <div className="h-3 bg-muted rounded-full w-12" />
          </div>
        </div>
      </div>
      <div className="mt-3 h-8 bg-muted rounded-xl" />
    </div>
  );
}

// ─── Desktop panel (filter header + worker list) ───────────────────────────────

interface PanelContentProps {
  search: string;
  onSearch: (v: string) => void;
  selectedSkills: string[];
  onToggleSkill: (s: string) => void;
  maxDist: number | null;
  onSetMaxDist: (d: number | null) => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  workers: typeof WORKERS;
  onWorkerClick: (id: number) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

function PanelContent({
  search, onSearch, selectedSkills, onToggleSkill,
  maxDist, onSetMaxDist, verifiedOnly, onToggleVerified,
  showFilters, onToggleFilters, workers, onWorkerClick,
  isRefreshing, onRefresh,
}: PanelContentProps) {
  return (
    <>
      <div className="px-4 pt-4 pb-3 border-b border-border shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Find Workers</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {workers.length} worker{workers.length !== 1 ? "s" : ""} found nearby
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name or skill..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow placeholder:text-muted-foreground"
          />
        </div>

        {showFilters && (
          <div className="space-y-3 pt-1">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Skill</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_FILTERS.map((s) => {
                  const active = selectedSkills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => onToggleSkill(s)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? "text-white border-transparent"
                          : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                      style={active ? { background: A } : {}}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Distance</p>
              <div className="flex gap-1.5">
                {DISTANCE_FILTERS.map((d) => {
                  const active = maxDist === d;
                  return (
                    <button
                      key={d}
                      onClick={() => onSetMaxDist(active ? null : d)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                        active
                          ? "text-white border-transparent"
                          : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                      style={active ? { background: A } : {}}
                    >
                      {d} km
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Only</span>
              <button
                onClick={onToggleVerified}
                className="w-10 h-5 rounded-full relative transition-colors shrink-0"
                style={{ background: verifiedOnly ? A : "#CBD5E1" }}
                aria-pressed={verifiedOnly}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${verifiedOnly ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isRefreshing
          ? Array.from({ length: 3 }).map((_, i) => <WorkerCardSkeleton key={i} />)
          : workers.map((w) => (
          <button
            key={w.id}
            onClick={() => onWorkerClick(w.id)}
            className="w-full text-left bg-background dark:bg-white/5 rounded-2xl border border-border p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                style={{ background: w.color }}
              >
                {workerInitials(w.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm truncate">{w.name}</p>
                  {w.status !== "Unavailable" && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{w.skill}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="flex items-center gap-0.5 text-xs font-medium">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{w.rating}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />{w.dist}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[w.status] ?? ""}`}>
                    {w.status}
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onWorkerClick(w.id); }}
              className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: A }}
            >
              View Profile
            </button>
          </button>
        ))}

        {!isRefreshing && workers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No workers found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function WorkerDiscovery({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [search, setSearch]                 = useState("");
  const [verifiedOnly, setVerifiedOnly]     = useState(true);
  const [showFilters, setShowFilters]       = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [maxDist, setMaxDist]               = useState<number | null>(null);
  const [sheetHeightPx, setSheetHeightPx]   = useState(SHEET_PEEK_PX);
  const [snapPoint, setSnapPoint]           = useState<SnapPoint>("peek");
  const [isRefreshing, setIsRefreshing]     = useState(false);
  const [pinPos, setPinPos]                 = useState<L.LatLng | null>(null);
  const [locationModal, setLocationModal]   = useState<LocationModal>("closed");
  const [draftCenter, setDraftCenter]       = useState<L.LatLng | null>(null);
  const [pendingPin, setPendingPin]         = useState<L.LatLng | null>(null);

  function confirmPin() {
    if (pendingPin) setPinPos(pendingPin);
    setPendingPin(null);
    setLocationModal("closed");
  }

  function handleGPS() {
    setLocationModal("closed");
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setPendingPin(L.latLng(pos.coords.latitude, pos.coords.longitude)); setLocationModal("confirm"); },
      (err) => alert(`Could not get your location: ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }

  // All refs declared together before any useEffect
  const sheetRef         = useRef<HTMLDivElement>(null);
  const listRef          = useRef<HTMLDivElement>(null);
  const touchStartY      = useRef<number | null>(null);
  const touchStartH      = useRef<number>(SHEET_PEEK_PX);
  const currentHeightRef = useRef<number>(SHEET_PEEK_PX);
  const isDragging       = useRef(false);
  const touchInList      = useRef(false);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onMove = (e: TouchEvent) => {
      if (touchStartY.current === null) return;

      // Handle list boundary hijacking
      if (touchInList.current && !isDragging.current) {
        const listEl = listRef.current;
        const atTop    = (listEl?.scrollTop ?? 0) <= 2;
        const atBottom = listEl ? listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 2 : false;
        const dy = touchStartY.current - e.touches[0].clientY;

        if (atTop && dy < -8) {
          isDragging.current  = true;
          touchInList.current = false;
          touchStartY.current = e.touches[0].clientY;
          touchStartH.current = currentHeightRef.current;
        } else if (atBottom && dy > 8 && currentHeightRef.current < SHEET_FULL_PX - 10) {
          isDragging.current  = true;
          touchInList.current = false;
          touchStartY.current = e.touches[0].clientY;
          touchStartH.current = currentHeightRef.current;
        } else {
          return; // let native list scroll work
        }
      }

      if (!isDragging.current) return;

      const dy   = touchStartY.current - e.touches[0].clientY;
      const next = Math.min(SHEET_FULL_PX, Math.max(SHEET_COLLAPSED_PX, touchStartH.current + dy));
      currentHeightRef.current = next;
      setSheetHeightPx(next);
      e.preventDefault(); // only called when isDragging=true and not in list
    };
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => el.removeEventListener("touchmove", onMove);
  }, []);

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

  function snapSheet(point: SnapPoint) {
    const heights: Record<SnapPoint, number> = {
      collapsed: SHEET_COLLAPSED_PX,
      peek:      SHEET_PEEK_PX,
      mid:       SHEET_MID_PX,
      full:      SHEET_FULL_PX,
    };
    setSnapPoint(point);
    setSheetHeightPx(heights[point]);
    currentHeightRef.current = heights[point];
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
    touchStartH.current = currentHeightRef.current;
    touchInList.current = listRef.current?.contains(e.target as Node) ?? false;
    isDragging.current  = !touchInList.current;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!isDragging.current) return;
    isDragging.current  = false;
    touchInList.current = false;
    const dragDelta = currentHeightRef.current - touchStartH.current;
    const THRESHOLD = 40;
    const idx = SNAP_POINTS.indexOf(snapPoint);
    // In picking mode, only allow collapsed/peek
    const maxIdx = locationModal === "picking" ? 1 : SNAP_POINTS.length - 1;
    if (dragDelta > THRESHOLD && idx < maxIdx) {
      snapSheet(SNAP_POINTS[idx + 1]);
    } else if (dragDelta < -THRESHOLD && idx > 0) {
      snapSheet(SNAP_POINTS[idx - 1]);
    } else {
      snapSheet(locationModal === "picking" ? SNAP_POINTS[Math.min(idx, 1)] : snapPoint);
    }
  }

  const panelProps = {
    search, onSearch: setSearch,
    selectedSkills, onToggleSkill: toggleSkill,
    maxDist, onSetMaxDist: setMaxDist,
    verifiedOnly, onToggleVerified: () => setVerifiedOnly((p) => !p),
    showFilters, onToggleFilters: () => setShowFilters((p) => !p),
    workers: filteredWorkers,
    onWorkerClick: (id: number) => navigate(`/app/worker/${id}`),
    isRefreshing,
    onRefresh: handleRefresh,
  };

  return (
    <div className="flex flex-col bg-background" style={{ height: "100dvh" }}>
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      {/* ── Desktop layout: side panel + map ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <aside className="w-96 shrink-0 flex flex-col border-r border-border overflow-hidden bg-card dark:bg-slate-900 dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)]">
          <PanelContent {...panelProps} />
        </aside>
        <div className="flex-1 h-full relative">
          <WorkerMap
            onSelectWorker={(id) => navigate(`/app/worker/${id}`)}
            pinPos={pinPos}
            pickingPin={locationModal === "picking"}
            onCenterChange={setDraftCenter}
          />
          {locationModal !== "picking" && (
            <button
              onClick={() => setLocationModal(locationModal === "closed" ? "open" : "closed")}
              className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-card dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-md rounded-xl px-3 py-2 text-xs font-semibold hover:border-blue-400 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" />
              {pinPos ? "Update Location" : "Pinpoint Location"}
            </button>
          )}
          {locationModal === "picking" && (
            <>
              <div className="absolute inset-0 z-[1000] pointer-events-none flex items-center justify-center" style={{ marginTop: "-18px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
                  <circle cx="14" cy="14" r="12" fill="#ef4444" stroke="white" strokeWidth="2"/>
                  <polygon points="10,24 18,24 14,34" fill="#ef4444"/>
                  <circle cx="14" cy="14" r="5" fill="white"/>
                </svg>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-2">
                <button
                  onClick={() => setLocationModal("closed")}
                  className="px-5 py-2.5 rounded-xl bg-card dark:bg-slate-800 border border-border text-sm font-semibold shadow-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { if (draftCenter) { setPendingPin(draftCenter); setLocationModal("confirm"); } }}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: "#ef4444" }}
                >
                  Pin Here
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shared modals — rendered at top level so no stacking context traps them */}
      <PinpointModal state={locationModal} onGPS={handleGPS} onManual={() => { setDraftCenter(null); snapSheet("collapsed"); setLocationModal("picking"); }} onClose={() => setLocationModal("closed")} />
      <ConfirmPinModal latlng={pendingPin} onConfirm={confirmPin} onCancel={() => { setPendingPin(null); setLocationModal("picking"); }} />

      {/* ── Mobile layout: full-screen map + bottom sheet ── */}
      <div className="md:hidden flex-1 relative overflow-hidden">

        {/* Map — fixed so it fills the screen regardless of outer wrapper height */}
        <div className="fixed inset-0 top-[57px]">
          <WorkerMap
            onSelectWorker={(id) => navigate(`/app/worker/${id}`)}
            pinPos={pinPos}
            pickingPin={locationModal === "picking"}
            onCenterChange={setDraftCenter}
            pickOffsetY={Math.round((sheetHeightPx + 56 + 52) / 2)}
          />
          {locationModal === "picking" && (
            <div
              className="absolute left-0 right-0 top-0 pointer-events-none z-[1000] flex items-center justify-center"
              style={{ bottom: sheetHeightPx + 56 + 52 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
                <circle cx="14" cy="14" r="12" fill="#ef4444" stroke="white" strokeWidth="2"/>
                <polygon points="10,24 18,24 14,34" fill="#ef4444"/>
                <circle cx="14" cy="14" r="5" fill="white"/>
              </svg>
            </div>
          )}
        </div>

        {/* Pinpoint button — centered just above the sheet */}
        {locationModal !== "picking" && (
          <button
            onClick={() => setLocationModal(locationModal === "closed" ? "open" : "closed")}
            className="fixed left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1.5 bg-card dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-md rounded-xl px-3 py-2 text-xs font-semibold hover:border-blue-400 transition-colors"
            style={{ bottom: sheetHeightPx + 56 + 8 }}
          >
            <Crosshair className="w-3.5 h-3.5" />
            {pinPos ? "Update Location" : "Pinpoint Location"}
          </button>
        )}

        {/* Pin/Cancel buttons — float just above the sheet when in picking mode */}
        {locationModal === "picking" && (
          <div
            className="fixed left-0 right-0 z-20 flex justify-center gap-2 px-4"
            style={{ bottom: sheetHeightPx + 56 + 8 }}
          >
            <button
              onClick={() => setLocationModal("closed")}
              className="px-5 py-2.5 rounded-xl bg-card dark:bg-slate-800 border border-border text-sm font-semibold shadow-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { if (draftCenter) { setPendingPin(draftCenter); setLocationModal("confirm"); } }}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
              style={{ background: "#ef4444" }}
            >
              Pin Here
            </button>
          </div>
        )}

        {/* Bottom sheet — fixed above the tab bar (56px), capped so it never overlaps the nav */}
        <div
          ref={sheetRef}
          className="fixed left-0 right-0 bottom-14 flex flex-col rounded-t-2xl bg-card dark:bg-slate-900 shadow-[0_-8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.55)] z-10"
          style={{
            height: sheetHeightPx,
            maxHeight: "calc(100dvh - 57px - 56px)",
            transition: isDragging.current ? "none" : "height 0.28s cubic-bezier(0.32,0.72,0,1)",
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Pill handle */}
          <div className="shrink-0 flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-4 pb-2">
            <div>
              <p className="text-sm font-bold">Find Workers</p>
              <p className="text-xs text-muted-foreground">{filteredWorkers.length} nearby</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setSearch(""); setSelectedSkills([]); setMaxDist(null); setVerifiedOnly(true); handleRefresh(); }}
                disabled={isRefreshing}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); const idx = SNAP_POINTS.indexOf(snapPoint); snapSheet(snapPoint === "full" ? "peek" : SNAP_POINTS[Math.min(idx + 1, SNAP_POINTS.length - 1)]); }}
                onClick={(e) => { e.stopPropagation(); const idx = SNAP_POINTS.indexOf(snapPoint); snapSheet(snapPoint === "full" ? "peek" : SNAP_POINTS[Math.min(idx + 1, SNAP_POINTS.length - 1)]); }}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
              >
                <ChevronUp className={`w-4 h-4 transition-transform duration-300 ${snapPoint === "full" ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Search + filter toggle */}
          <div className="shrink-0 px-4 pb-3 border-b border-border space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or skill..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setShowFilters((p) => !p)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  showFilters
                    ? "text-white border-transparent"
                    : "border-border text-muted-foreground bg-input-background"
                }`}
                style={showFilters ? { background: A } : {}}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>

            {/* Expanded filters — same layout as desktop */}
            {showFilters && (
              <div className="space-y-3 pt-1">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Skill</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_FILTERS.map((s) => {
                      const active = selectedSkills.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSkill(s)}
                          className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                            active
                              ? "text-white border-transparent"
                              : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-600"
                          }`}
                          style={active ? { background: A } : {}}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Distance</p>
                  <div className="flex gap-1.5">
                    {DISTANCE_FILTERS.map((d) => {
                      const active = maxDist === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setMaxDist(active ? null : d)}
                          className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                            active
                              ? "text-white border-transparent"
                              : "border-border text-muted-foreground hover:border-blue-400 hover:text-blue-600"
                          }`}
                          style={active ? { background: A } : {}}
                        >
                          {d} km
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Only</span>
                  <button
                    onClick={() => setVerifiedOnly((p) => !p)}
                    className="w-10 h-5 rounded-full relative transition-colors shrink-0"
                    style={{ background: verifiedOnly ? A : "#CBD5E1" }}
                    aria-pressed={verifiedOnly}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${verifiedOnly ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Worker list — scrollable, ref used to detect scroll position for drag guard */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 pt-2 pb-2 space-y-2">
            {isRefreshing
              ? Array.from({ length: 3 }).map((_, i) => <WorkerCardSkeleton key={i} />)
              : filteredWorkers.map((w) => (
              <button
                key={w.id}
                onClick={() => navigate(`/app/worker/${w.id}`)}
                className="w-full text-left bg-background dark:bg-white/5 rounded-2xl border border-border p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                    style={{ background: w.color }}
                  >
                    {workerInitials(w.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate">{w.name}</p>
                      {w.status !== "Unavailable" && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{w.skill}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-0.5 text-xs font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{w.rating}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{w.dist}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${AVAILABILITY_STYLES[w.status] ?? ""}`}>
                        {w.status}
                      </span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/app/worker/${w.id}`); }}
                  className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: A }}
                >
                  View Profile
                </button>
              </button>
            ))}

            {!isRefreshing && filteredWorkers.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No workers found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
