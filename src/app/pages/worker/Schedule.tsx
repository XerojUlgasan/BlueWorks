import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Check, X } from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { DarkToggle } from "../../components/shared";
import { A } from "../../constants";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const BOOKED_DAYS = [15, 18, 22];
const UNAVAIL_DAYS = [16, 20];

const TIME_OPTIONS = [
  "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM",
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM",
];

const UPCOMING_JOBS = [
  { date: "July 15", time: "10:00 AM", customer: "Ana Reyes",    title: "Ceiling fan install", addr: "Fairview",   status: "In Progress" },
  { date: "July 15", time: "2:00 PM",  customer: "Carlo Mendoza",title: "Outlet rewiring",     addr: "Novaliches", status: "Accepted"    },
  { date: "July 18", time: "9:00 AM",  customer: "Jenny Cruz",   title: "Panel check",         addr: "Batasan",    status: "Accepted"    },
  { date: "July 22", time: "1:00 PM",  customer: "Mark Lim",     title: "Lighting install",    addr: "Lagro",      status: "Accepted"    },
];

interface DayAvail {
  day: string;
  on: boolean;
  start: string;
  end: string;
}

const DEFAULT_AVAIL: DayAvail[] = [
  { day: "Monday",    on: true,  start: "8:00 AM",  end: "5:00 PM"  },
  { day: "Tuesday",   on: true,  start: "8:00 AM",  end: "5:00 PM"  },
  { day: "Wednesday", on: false, start: "8:00 AM",  end: "5:00 PM"  },
  { day: "Thursday",  on: true,  start: "8:00 AM",  end: "5:00 PM"  },
  { day: "Friday",    on: true,  start: "8:00 AM",  end: "5:00 PM"  },
  { day: "Saturday",  on: true,  start: "9:00 AM",  end: "12:00 PM" },
  { day: "Sunday",    on: false, start: "8:00 AM",  end: "5:00 PM"  },
];

export default function SchedulePage({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [month, setMonth] = useState(6);
  const [year, setYear]   = useState(2025);
  const [selected, setSelected] = useState<number | null>(null);
  const [avail, setAvail] = useState<DayAvail[]>(DEFAULT_AVAIL);
  const [saved, setSaved] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  function getDayType(d: number) {
    if (UNAVAIL_DAYS.includes(d)) return "unavail";
    if (BOOKED_DAYS.includes(d)) return "booked";
    return "free";
  }

  function toggleDay(i: number) {
    setAvail(prev => prev.map((a, idx) => idx === i ? { ...a, on: !a.on } : a));
  }

  function updateTime(i: number, field: "start" | "end", val: string) {
    setAvail(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const selectedJobs = selected
    ? UPCOMING_JOBS.filter(j => j.date === `${MONTH_NAMES[month].slice(0, 4)} ${selected}` || j.date === `July ${selected}`)
    : [];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Schedule</h1>
            <p className="text-sm text-muted-foreground">{UPCOMING_JOBS.length} upcoming jobs this month</p>
          </div>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Calendar + day detail */}
          <div className="xl:col-span-2 space-y-5">
            {/* Calendar card */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-5">
                <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}
                  className="p-2 rounded-xl hover:bg-muted transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-lg">{MONTH_NAMES[month]} {year}</h2>
                <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}
                  className="p-2 rounded-xl hover:bg-muted transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-xs mb-4 flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: A }} />Booked</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-300 dark:bg-gray-600 inline-block" />Unavailable</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />Selected</span>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
                {DAY_NAMES.map(d => <div key={d} className="font-semibold text-muted-foreground py-1">{d}</div>)}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const type = getDayType(d);
                  const isSel = selected === d;
                  const jobCount = UPCOMING_JOBS.filter(j => j.date.endsWith(` ${d}`)).length;
                  return (
                    <button key={d} onClick={() => setSelected(isSel ? null : d)}
                      className={`h-10 rounded-xl flex items-center justify-center relative font-medium transition-all
                        ${type === "unavail" ? "bg-muted/60 text-muted-foreground/50" : "cursor-pointer"}
                        ${type === "free" && !isSel ? "hover:bg-blue-50 dark:hover:bg-blue-900/20" : ""}
                        ${isSel ? "ring-2 ring-amber-400 ring-offset-1" : ""}
                        ${type === "booked" ? "text-white" : ""}
                      `}
                      style={
                        isSel ? { background: "#FCD34D", color: "#92400E" }
                        : type === "booked" ? { background: A }
                        : {}
                      }>
                      {d}
                      {jobCount > 0 && !isSel && (
                        <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                          style={{ background: type === "booked" ? "rgba(255,255,255,0.8)" : A }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected day detail */}
            {selected && (
              <div className="bg-card rounded-2xl border border-border p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base">{MONTH_NAMES[month]} {selected}, {year}</h3>
                  <button onClick={() => setSelected(null)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedJobs.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No jobs on this day.</p>
                    <p className="text-xs mt-1">This day is open for new bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedJobs.map((j, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                        <div className="w-1 rounded-full self-stretch shrink-0" style={{ background: A }} />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{j.title}</p>
                          <p className="text-xs text-muted-foreground">{j.customer}</p>
                          <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{j.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.addr}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full self-start mt-1
                          ${j.status === "In Progress" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                          {j.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Weekly availability — full time picker */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Weekly Availability</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Set your working hours for each day</p>
                </div>
                <button onClick={handleSave}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${saved ? "bg-emerald-500" : ""}`}
                  style={!saved ? { background: A } : {}}>
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Schedule"}
                </button>
              </div>

              <div className="divide-y divide-border">
                {avail.map((a, i) => (
                  <div key={a.day}
                    className={`px-5 py-4 flex items-center gap-4 transition-colors ${!a.on ? "bg-muted/20" : ""}`}>
                    {/* Toggle */}
                    <button onClick={() => toggleDay(i)}
                      className={`w-10 h-5 rounded-full relative shrink-0 transition-colors`}
                      style={{ background: a.on ? A : undefined }}
                      aria-label={`Toggle ${a.day}`}>
                      {!a.on && <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-gray-600" />}
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${a.on ? "right-0.5" : "left-0.5"}`} />
                    </button>

                    {/* Day name */}
                    <span className={`text-sm font-semibold w-24 shrink-0 ${!a.on ? "text-muted-foreground" : ""}`}>
                      {a.day}
                    </span>

                    {a.on ? (
                      /* Time pickers */
                      <div className="flex items-center gap-2 flex-1 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">From</span>
                          <select value={a.start} onChange={e => updateTime(i, "start", e.target.value)}
                            className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">To</span>
                          <select value={a.end} onChange={e => updateTime(i, "end", e.target.value)}
                            className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Available
                        </span>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground italic">Not available this day</span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                          Off
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Upcoming jobs list */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold mb-4">Upcoming Jobs</h3>
              {UPCOMING_JOBS.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming jobs.</p>
              ) : (
                <div className="space-y-3">
                  {UPCOMING_JOBS.map((j, i) => (
                    <div key={i}
                      className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-blue-300 ${selected && j.date.endsWith(` ${selected}`) ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-border bg-muted/30"}`}
                      onClick={() => setSelected(parseInt(j.date.split(" ")[1]))}>
                      <p className="font-medium text-sm">{j.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{j.customer}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />{j.date} · {j.time}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{j.addr}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick summary */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold mb-3 text-sm">This Week Summary</h3>
              <div className="space-y-2">
                {[
                  { label: "Available days",   val: avail.filter(a => a.on).length.toString(), color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Unavailable days",  val: avail.filter(a => !a.on).length.toString(), color: "text-muted-foreground" },
                  { label: "Booked jobs",       val: BOOKED_DAYS.length.toString(), color: "text-blue-600 dark:text-blue-400" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className={`font-bold text-sm ${color}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
