import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronDown, Star, MapPin, CheckCircle, SlidersHorizontal } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { A, WORKERS } from "../../constants";

function workerInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const AVAILABILITY_STYLES: Record<string, string> = {
  Today:       "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  Tomorrow:    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  Unavailable: "text-red-500 bg-red-50 dark:bg-red-900/20",
};

function DarkMap({ onSelectWorker }: { onSelectWorker: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 320, cy = 270;

  const majorRoads = [
    { x1: 0, y1: 130, x2: 700, y2: 130 }, { x1: 0, y1: 270, x2: 700, y2: 270 },
    { x1: 0, y1: 400, x2: 700, y2: 400 }, { x1: 100, y1: 0, x2: 100, y2: 520 },
    { x1: 320, y1: 0, x2: 320, y2: 520 }, { x1: 540, y1: 0, x2: 540, y2: 520 },
  ];
  const minorRoads = [
    { x1: 0, y1: 60, x2: 700, y2: 60 },   { x1: 0, y1: 200, x2: 700, y2: 200 },
    { x1: 0, y1: 335, x2: 700, y2: 335 }, { x1: 0, y1: 460, x2: 700, y2: 460 },
    { x1: 210, y1: 0, x2: 210, y2: 520 }, { x1: 430, y1: 0, x2: 430, y2: 520 },
    { x1: 620, y1: 0, x2: 620, y2: 520 },
  ];

  return (
    <div className="relative w-full h-full" style={{ background: "#0B1120", minHeight: 400 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 700 520"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        {minorRoads.map((r, i) => (
          <line key={`mi${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(200,210,255,0.08)" strokeWidth={1.5} />
        ))}
        {majorRoads.map((r, i) => (
          <line key={`ma${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(200,210,255,0.16)" strokeWidth={3} />
        ))}
        <line x1={0} y1={480} x2={650} y2={30} stroke="rgba(200,210,255,0.2)" strokeWidth={4} />

        {/* Range rings */}
        <circle cx={cx} cy={cy} r={65}  fill="none" stroke={A} strokeWidth={1} strokeDasharray="5,4" opacity={0.3} />
        <circle cx={cx} cy={cy} r={125} fill="none" stroke={A} strokeWidth={1} strokeDasharray="5,4" opacity={0.18} />

        {/* User marker */}
        <circle cx={cx} cy={cy} r={10} fill={A} opacity={0.2} />
        <circle cx={cx} cy={cy} r={6}  fill={A} />
        <circle cx={cx} cy={cy} r={2.5} fill="white" />
        <text x={cx + 12} y={cy - 8} fill="white" fontSize={9} fontFamily="Inter,sans-serif" opacity={0.75} fontWeight="600">You</text>

        {/* Worker markers */}
        {WORKERS.map((w) => (
          <g
            key={w.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(w.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={onSelectWorker}
          >
            <circle cx={w.mx} cy={w.my} r={20} fill={w.color} opacity={hovered === w.id ? 1 : 0.8} />
            <circle cx={w.mx} cy={w.my} r={20} fill="none" stroke="white" strokeWidth={2} opacity={hovered === w.id ? 1 : 0.5} />
            <polygon
              points={`${w.mx - 5},${w.my + 20} ${w.mx + 5},${w.my + 20} ${w.mx},${w.my + 28}`}
              fill={w.color}
              opacity={hovered === w.id ? 1 : 0.8}
            />
            <text x={w.mx} y={w.my + 5} fill="white" fontSize={9} fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="700">
              {workerInitials(w.name)}
            </text>

            {hovered === w.id && (
              <g>
                <rect x={w.mx - 65} y={w.my - 82} width={130} height={68} rx={8} fill="#1E293B" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                <text x={w.mx} y={w.my - 60} fill="white" fontSize={10} fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="700">{w.name}</text>
                <text x={w.mx} y={w.my - 46} fill="#94A3B8" fontSize={8.5} fontFamily="Inter,sans-serif" textAnchor="middle">{w.skill}</text>
                <text x={w.mx} y={w.my - 33} fill="#94A3B8" fontSize={8} fontFamily="Inter,sans-serif" textAnchor="middle">⭐ {w.rating} · {w.dist}</text>
                <rect x={w.mx - 32} y={w.my - 26} width={64} height={18} rx={5} fill={A} />
                <text x={w.mx} y={w.my - 14} fill="white" fontSize={8.5} fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">View Profile</text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
        {["+", "−"].map((c) => (
          <button
            key={c}
            className="w-8 h-8 rounded-lg text-white flex items-center justify-center text-base font-bold hover:bg-white/20 transition-colors"
            style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Map legend */}
      <div
        className="absolute top-3 right-3 px-3 py-2 rounded-lg text-xs text-white/70 space-y-1"
        style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Available today</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Tomorrow</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Unavailable</div>
      </div>
    </div>
  );
}

export default function WorkerDiscovery({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      {/* Mobile view toggle */}
      <div className="md:hidden flex items-center gap-1 p-3 border-b border-border bg-card">
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mobileView === "list" ? "text-white" : "text-muted-foreground bg-muted"
          }`}
          style={mobileView === "list" ? { background: A } : {}}
        >
          List
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mobileView === "map" ? "text-white" : "text-muted-foreground bg-muted"
          }`}
          style={mobileView === "map" ? { background: A } : {}}
        >
          Map
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }} >
        {/* Left panel — full width on mobile when list view */}
        <aside className={`${
          mobileView === "map" ? "hidden" : "flex"
        } md:flex w-full md:w-96 shrink-0 flex-col border-r border-border bg-card overflow-hidden`}>
          {/* Search */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search by name, skill, or service..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((p) => !p)}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {showFilters && (
              <div className="space-y-3 pt-1">
                {/* Skills */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Skill</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Plumber", "Electrician", "Mason", "Carpenter", "Painter"].map((s) => (
                      <label
                        key={s}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <input type="checkbox" className="rounded w-3 h-3" /> {s}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Distance</p>
                  <div className="flex gap-2">
                    {["1 km", "3 km", "5 km"].map((d) => (
                      <label
                        key={d}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <input type="radio" name="dist" className="w-3 h-3" /> {d}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verified toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verified Only</span>
                  <button
                    onClick={() => setVerifiedOnly((p) => !p)}
                    className="w-10 h-5 rounded-full relative transition-colors"
                    style={{ background: verifiedOnly ? A : "#CBD5E1" }}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        verifiedOnly ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </label>
              </div>
            )}
          </div>

          {/* Worker list */}
          <div className="flex-1 overflow-y-auto p-3 pb-20 md:pb-3 space-y-2">
            <p className="text-xs text-muted-foreground px-1">
              {WORKERS.length} workers found nearby
            </p>
            {WORKERS.map((w) => (
              <div
                key={w.id}
                className="bg-background rounded-xl border border-border p-3.5 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/app/worker/${w.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: w.color }}
                  >
                    {workerInitials(w.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm">{w.name}</p>
                      {w.status !== "Unavailable" && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
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
                  className="w-full mt-3 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity active:scale-[0.99]"
                  style={{ background: A }}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Map — hidden on mobile when list view */}
        <div className={`${
          mobileView === "list" ? "hidden" : "flex"
        } md:flex flex-1 relative`}>
          <DarkMap onSelectWorker={() => navigate("/app/worker/1")} />
        </div>
      </div>
    </div>
  );
}
