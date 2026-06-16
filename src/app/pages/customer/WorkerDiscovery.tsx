import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronDown, Star, MapPin, CheckCircle } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { A, P, WORKERS } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function DarkMap({ onSelectWorker }: { onSelectWorker: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 320, cy = 270;
  const roads = {
    major: [
      { x1: 0, y1: 130, x2: 700, y2: 130 }, { x1: 0, y1: 270, x2: 700, y2: 270 },
      { x1: 0, y1: 400, x2: 700, y2: 400 }, { x1: 100, y1: 0, x2: 100, y2: 520 },
      { x1: 320, y1: 0, x2: 320, y2: 520 }, { x1: 540, y1: 0, x2: 540, y2: 520 },
    ],
    secondary: [
      { x1: 0, y1: 60, x2: 700, y2: 60 }, { x1: 0, y1: 200, x2: 700, y2: 200 },
      { x1: 0, y1: 335, x2: 700, y2: 335 }, { x1: 0, y1: 460, x2: 700, y2: 460 },
      { x1: 210, y1: 0, x2: 210, y2: 520 }, { x1: 430, y1: 0, x2: 430, y2: 520 },
      { x1: 620, y1: 0, x2: 620, y2: 520 },
    ],
  };
  return (
    <div className="relative w-full h-full" style={{ background: "#0B1120", minHeight: 400 }}>
      <svg width="100%" height="100%" viewBox="0 0 700 520" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        {roads.secondary.map((r, i) => <line key={`s${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(200,210,255,0.1)" strokeWidth={1.5} />)}
        {roads.major.map((r, i) => <line key={`m${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(200,210,255,0.18)" strokeWidth={3} />)}
        <line x1={0} y1={480} x2={650} y2={30} stroke="rgba(200,210,255,0.22)" strokeWidth={4} />
        <circle cx={cx} cy={cy} r={65} fill="none" stroke={A} strokeWidth={1} strokeDasharray="5,4" opacity={0.35} />
        <circle cx={cx} cy={cy} r={125} fill="none" stroke={A} strokeWidth={1} strokeDasharray="5,4" opacity={0.22} />
        <circle cx={cx} cy={cy} r={7} fill={A} /><circle cx={cx} cy={cy} r={3} fill="white" />
        <text x={cx + 10} y={cy - 10} fill="white" fontSize={8} fontFamily="Inter,sans-serif" opacity={0.7}>You</text>
        {WORKERS.map((w) => (
          <g key={w.id} style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(w.id)} onMouseLeave={() => setHovered(null)}
            onClick={onSelectWorker}>
            <circle cx={w.mx} cy={w.my} r={18} fill={w.color} opacity={hovered === w.id ? 1 : 0.85} />
            <circle cx={w.mx} cy={w.my} r={18} fill="none" stroke="white" strokeWidth={2} opacity={hovered === w.id ? 1 : 0.6} />
            <polygon points={`${w.mx - 5},${w.my + 18} ${w.mx + 5},${w.my + 18} ${w.mx},${w.my + 26}`} fill={w.color} opacity={hovered === w.id ? 1 : 0.85} />
            <text x={w.mx} y={w.my + 5} fill="white" fontSize={9} fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="700">{initials(w.name)}</text>
            {hovered === w.id && (
              <g>
                <rect x={w.mx - 60} y={w.my - 75} width={120} height={62} rx={6} fill="#1E293B" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                <text x={w.mx} y={w.my - 55} fill="white" fontSize={9} fontFamily="Poppins,sans-serif" textAnchor="middle" fontWeight="600">{w.name}</text>
                <text x={w.mx} y={w.my - 42} fill="#94A3B8" fontSize={8} fontFamily="Inter,sans-serif" textAnchor="middle">{w.skill} · ⭐{w.rating} · {w.dist}</text>
                <rect x={w.mx - 28} y={w.my - 34} width={56} height={16} rx={4} fill={A} />
                <text x={w.mx} y={w.my - 23} fill="white" fontSize={8} fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">View Profile</text>
              </g>
            )}
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {["+", "−", "⊕"].map((c) => (
          <button key={c} className="w-8 h-8 rounded-lg text-white flex items-center justify-center text-sm font-bold"
            style={{ background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}>{c}</button>
        ))}
      </div>
    </div>
  );
}

export default function WorkerDiscovery({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const avail_colors: Record<string, string> = { Today: "text-emerald-500", Tomorrow: "text-amber-500", Unavailable: "text-red-400" };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerNav dark={dark} toggleDark={toggleDark} />
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        <div className="w-96 flex flex-col border-r border-border overflow-y-auto shrink-0">
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="Search by name, skill, or service..." className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <details open className="group">
              <summary className="flex justify-between items-center cursor-pointer text-sm font-semibold py-1">Skill <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" /></summary>
              <div className="mt-2 space-y-1.5 pl-1">
                {["Plumber", "Electrician", "Mason", "Carpenter", "Painter"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" className="rounded" />{s}</label>
                ))}
              </div>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-sm font-semibold py-1">Distance <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" /></summary>
              <div className="mt-2 space-y-1.5 pl-1">
                {["Within 1km", "Within 3km", "Within 5km"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="dist" />{s}</label>
                ))}
              </div>
            </details>
            <label className="flex items-center justify-between text-sm font-semibold py-1">
              Verified Only
              <div className="w-10 h-5 rounded-full relative cursor-pointer" style={{ background: A }}>
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </label>
          </div>
          <div className="flex-1 border-t border-border p-3 space-y-3">
            {WORKERS.map((w) => (
              <div key={w.id} className="bg-card rounded-xl border border-border p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ background: w.color }}>{initials(w.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm">{w.name}</p>
                      {w.dist !== "4.8 km" && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{w.skill}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="flex items-center gap-0.5 text-xs"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{w.rating}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" />{w.dist}</span>
                      <span className={`text-xs font-medium ${avail_colors[w.status] ?? "text-gray-400"}`}>● {w.status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate(`/app/worker/${w.id}`)}
                  className="w-full mt-2 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90" style={{ background: A }}>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative">
          <DarkMap onSelectWorker={() => navigate("/app/worker/1")} />
        </div>
      </div>
    </div>
  );
}
