import { useState } from "react";
import { useNavigate } from "react-router";
import { Star, MapPin, Shield, CheckCircle, Clock, FileText, Users, Hammer } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { Badge, StarRating } from "../../components/shared";
import { A, P } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function WorkerProfile({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("about");
  const tabs = ["about", "portfolio", "reviews", "availability"];
  const reviews = [
    { name: "Ana Reyes",     rating: 5, date: "July 10",  job: "Electrical Repair",    comment: "Very professional. Arrived on time, cleaned up after. Will hire again!" },
    { name: "Carlo Mendoza", rating: 5, date: "June 28",  job: "Rewiring",             comment: "Fixed our short circuit quickly. Highly recommended!" },
    { name: "Jenny Cruz",    rating: 4, date: "June 15",  job: "Panel Inspection",     comment: "Good work, arrived 30 mins late. Great overall though." },
    { name: "Mark Lim",      rating: 5, date: "June 5",   job: "Lighting Installation",comment: "Very affordable and honest. My go-to electrician." },
  ];
  const avail = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    day: d, hours: i === 2 ? null : i === 6 ? null : i === 5 ? "9AM–12PM" : "8AM–5PM",
  }));
  return (
    <div className="min-h-screen bg-background">
      <CustomerNav dark={dark} toggleDark={toggleDark} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
          <div className="flex gap-5 flex-wrap">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0" style={{ background: A }}>JC</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold">Juan dela Cruz</h1>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge label="Electrician" /><Badge label="Rewiring" color="purple" /><Badge label="Lighting Installation" color="gray" />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-4 h-4" /> Verified Identity</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Shield className="w-4 h-4" /> Verified Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 <span className="text-muted-foreground">(128 reviews)</span></span>
                    <span className="flex items-center gap-1 text-muted-foreground"><FileText className="w-4 h-4" /> 143 Jobs</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-4 h-4" /> 87 Repeat</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Brgy. Fairview, Quezon City</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Responds within 30 min</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={A} strokeWidth="3" strokeDasharray="86 100" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold">92</span></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Trust Score</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => navigate("/app/booking")} className="px-5 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: A }}>Book Now</button>
                <button onClick={() => navigate("/app/chat")} className="px-5 py-2 rounded-lg font-semibold text-sm border border-border hover:bg-muted transition-colors">Message</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
        {tab === "about" && (
          <div className="space-y-5">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">Licensed electrician with 8 years of experience specializing in residential rewiring, panel upgrades, and lighting systems.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["Experience", "8 Years"], ["Service Area", "Fairview, Novaliches, Batasan, Lagro (QC)"]].map(([k, v]) => (
                <div key={k} className="bg-card rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">{k}</p><p className="text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold mb-3">Pricing</h3>
              <div className="grid grid-cols-3 gap-3">
                {[["Inspection Fee", "₱300"], ["Hourly Rate", "₱500/hr"], ["Fixed Rate", "from ₱800"]].map(([l, v]) => (
                  <div key={l} className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-lg font-bold" style={{ color: A }}>{v}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "portfolio" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Panel upgrade", "Rewiring job", "Lighting install", "Outlet repair", "Circuit fix", "Inspection"].map((label, i) => (
              <div key={label} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="h-32 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${P}15, ${A}15)` }}>
                  <div className="text-center"><Hammer className="w-8 h-8 mx-auto mb-1 opacity-40" /><p className="text-xs opacity-50">Photo {i + 1}</p></div>
                </div>
                <div className="p-3"><p className="text-xs font-medium">{label}</p><p className="text-xs text-muted-foreground">Before / After</p></div>
              </div>
            ))}
          </div>
        )}
        {tab === "reviews" && (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.name} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>{initials(r.name)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <StarRating rating={r.rating} />
                    <Badge label={r.job} color="gray" />
                    <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "availability" && (
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-bold mb-4">Weekly Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {avail.map(({ day, hours }) => (
                <div key={day} className={`rounded-xl p-3 text-center ${hours ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-100 dark:bg-gray-800"}`}>
                  <p className="text-xs font-bold mb-1">{day}</p>
                  {hours ? <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{hours}</p> : <p className="text-xs text-red-500">Unavailable</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
