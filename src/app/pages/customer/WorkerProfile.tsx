import { useState } from "react";
import { useNavigate } from "react-router";
import { Star, MapPin, Shield, CheckCircle, Clock, FileText, Users, Hammer, ChevronLeft, MessageSquare } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { Badge, StarRating } from "../../components/shared";
import { A, P } from "../../constants";

function workerInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const REVIEWS = [
  { name: "Ana Reyes",     rating: 5, date: "July 10",  job: "Electrical Repair",     comment: "Very professional. Arrived on time, cleaned up after. Will hire again!" },
  { name: "Carlo Mendoza", rating: 5, date: "June 28",  job: "Rewiring",              comment: "Fixed our short circuit quickly. Highly recommended!" },
  { name: "Jenny Cruz",    rating: 4, date: "June 15",  job: "Panel Inspection",      comment: "Good work, arrived 30 mins late. Great overall though." },
  { name: "Mark Lim",      rating: 5, date: "June 5",   job: "Lighting Installation", comment: "Very affordable and honest. My go-to electrician." },
];

const PORTFOLIO = [
  "Panel upgrade", "Rewiring job", "Lighting install",
  "Outlet repair", "Circuit fix", "Inspection",
];

const SCHEDULE = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  hours: i === 2 || i === 6 ? null : i === 5 ? "9AM–12PM" : "8AM–5PM",
}));

const TABS = ["about", "portfolio", "reviews", "availability"] as const;
type Tab = typeof TABS[number];

export default function WorkerProfile({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("about");

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      <div className="max-w-5xl mx-auto px-4 py-6 pb-36 md:pb-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 mb-5 bg-secondary hover:bg-muted"
        >
          <ChevronLeft className="w-4 h-4" /> Back to results
        </button>

        {/* ── Profile header card ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 md:p-7 mb-6">

          {/* Mobile layout */}
          <div className="md:hidden">
            {/* Row: avatar + name/badges */}
            <div className="flex gap-3 mb-2.5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                style={{ background: `linear-gradient(135deg, ${P}, ${A})` }}
              >
                JC
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-lg font-bold leading-tight">Juan dela Cruz</h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30">
                    Available
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge label="Electrician" />
                  <Badge label="Rewiring" color="purple" />
                  <Badge label="Lighting" color="gray" />
                </div>
              </div>
            </div>

            {/* Row: meta (left) + trust score (right), aligned from verified row */}
            <div className="flex gap-3 items-start">
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle className="w-3 h-3" /> Verified Identity
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Shield className="w-3 h-3" /> Verified Skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9
                    <span className="text-muted-foreground font-normal">(128)</span>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="w-3 h-3" /> 143 Jobs
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Fairview, QC</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~30 min</span>
                </div>
              </div>

              {/* Trust score aligned to the right of the meta rows */}
              <div className="text-center shrink-0">
                <div className="relative w-12 h-12 mx-auto">
                  <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke={A} strokeWidth="3" strokeDasharray="86 100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold">92</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">Trust</p>
              </div>
            </div>
          </div>

          {/* Desktop layout — unchanged */}
          <div className="hidden md:flex gap-5 flex-wrap">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-md"
              style={{ background: `linear-gradient(135deg, ${P}, ${A})` }}
            >
              JC
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold leading-tight">Juan dela Cruz</h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30">
                      Available Today
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge label="Electrician" />
                    <Badge label="Rewiring" color="purple" />
                    <Badge label="Lighting" color="gray" />
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Identity
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Shield className="w-3.5 h-3.5" /> Verified Skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 font-medium">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9
                      <span className="text-muted-foreground font-normal">(128 reviews)</span>
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <FileText className="w-4 h-4" /> 143 Jobs
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" /> 87 Repeat Clients
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Brgy. Fairview, Quezon City</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Responds within 30 min</span>
                  </div>
                </div>
                <div className="text-center shrink-0">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={A} strokeWidth="3" strokeDasharray="86 100" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">92</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Trust Score</p>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => navigate("/app/booking")}
                  className="px-7 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
                  style={{ background: A }}
                >
                  Book Now
                </button>
                <button
                  onClick={() => navigate("/app/chat")}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-border bg-secondary hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column on desktop ── */}
        <div className="md:flex md:gap-6 md:items-start">

          {/* Left: tabs + content */}
          <div className="flex-1 min-w-0">

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-xs md:text-sm font-medium capitalize transition-all border-b-2 -mb-px text-center ${
                    tab === t
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab: About */}
            {tab === "about" && (
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-bold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Licensed electrician with 8 years of experience specializing in residential rewiring,
                    panel upgrades, and lighting systems. Trained and certified by TESDA. Always arrives
                    prepared with full tools.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Experience", "8 Years"],
                    ["Service Area", "Fairview, Novaliches, Batasan, Lagro (QC)"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-card rounded-xl border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">{k}</p>
                      <p className="text-sm font-semibold">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-bold mb-4">Pricing</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["Inspection Fee", "₱300"],
                      ["Hourly Rate", "₱500/hr"],
                      ["Fixed Rate", "from ₱800"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                      >
                        <p className="text-xl font-bold" style={{ color: A }}>{value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Portfolio */}
            {tab === "portfolio" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PORTFOLIO.map((label, i) => (
                  <div
                    key={label}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all cursor-pointer group"
                  >
                    <div
                      className="h-36 flex items-center justify-center relative"
                      style={{ background: `linear-gradient(135deg, ${P}18, ${A}18)` }}
                    >
                      <div className="text-center">
                        <Hammer className="w-8 h-8 mx-auto mb-1 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors" />
                        <p className="text-xs text-muted-foreground/50">Photo {i + 1}</p>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Before / After</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Reviews */}
            {tab === "reviews" && (
              <div className="space-y-3">
                <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-6">
                  <div className="text-center shrink-0">
                    <p className="text-5xl font-bold" style={{ color: A }}>4.9</p>
                    <StarRating rating={5} size="lg" />
                    <p className="text-xs text-muted-foreground mt-1">128 reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : 2;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-right text-muted-foreground">{star}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: A }} />
                          </div>
                          <span className="text-muted-foreground w-6">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {REVIEWS.map((r) => (
                  <div key={r.name} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: A }}
                      >
                        {workerInitials(r.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                          <span className="font-semibold text-sm">{r.name}</span>
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={r.rating} />
                          <Badge label={r.job} color="gray" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Availability */}
            {tab === "availability" && (
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-bold mb-4">Weekly Schedule</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {SCHEDULE.map(({ day, hours }) => (
                      <div
                        key={day}
                        className={`rounded-xl p-2.5 text-center border transition-colors ${
                          hours
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                            : "bg-muted/50 border-transparent"
                        }`}
                      >
                        <p className="text-xs font-bold mb-1.5">{day}</p>
                        {hours ? (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">{hours}</p>
                        ) : (
                          <p className="text-xs text-red-500 font-medium">Off</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold mb-1">Response Time</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Usually responds within 30 minutes during working hours
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: sticky booking card — desktop only */}
          <aside className="hidden md:block w-72 shrink-0 sticky top-6 space-y-3">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Starting at</p>
                <p className="text-2xl font-bold" style={{ color: A }}>₱300</p>
                <p className="text-xs text-muted-foreground">Inspection fee</p>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hourly rate</span>
                  <span className="font-medium">₱500 / hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fixed jobs</span>
                  <span className="font-medium">from ₱800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response time</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">~30 min</span>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <button
                  onClick={() => navigate("/app/booking")}
                  className="w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
                  style={{ background: A }}
                >
                  Book Now
                </button>
                <button
                  onClick={() => navigate("/app/chat")}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm border border-border bg-secondary hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground text-sm">Quick stats</p>
              <div className="flex justify-between"><span>Jobs completed</span><span className="font-medium text-foreground">143</span></div>
              <div className="flex justify-between"><span>Repeat clients</span><span className="font-medium text-foreground">87</span></div>
              <div className="flex justify-between"><span>On-time rate</span><span className="font-medium text-emerald-600 dark:text-emerald-400">96%</span></div>
              <div className="flex justify-between"><span>Member since</span><span className="font-medium text-foreground">Jan 2022</span></div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA bar — sits above the tab nav (bottom-14) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-10 bg-card/95 backdrop-blur border-t border-border px-4 py-3 flex gap-3">
        <button
          onClick={() => navigate("/app/chat")}
          className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-border bg-secondary hover:bg-muted transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" /> Message
        </button>
        <button
          onClick={() => navigate("/app/booking")}
          className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          style={{ background: A }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
