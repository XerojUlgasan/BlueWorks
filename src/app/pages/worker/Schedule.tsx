import { WorkerSidebar } from "../../components/shared/Nav";
import { DarkToggle } from "../../components/shared";
import { A } from "../../constants";

export default function SchedulePage({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const booked = [15, 18, 22];
  const unavail = [16, 20];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const getColor = (d: number) => {
    if (unavail.includes(d)) return "bg-gray-200 dark:bg-gray-700 text-muted-foreground";
    if (booked.includes(d)) return "text-white";
    if (d < 15) return "text-muted-foreground/50";
    return "hover:bg-muted";
  };
  const avail = [
    { day: "Mon", hours: "8AM–5PM",     on: true  },
    { day: "Tue", hours: "8AM–5PM",     on: true  },
    { day: "Wed", hours: "Unavailable", on: false },
    { day: "Thu", hours: "8AM–5PM",     on: true  },
    { day: "Fri", hours: "8AM–5PM",     on: true  },
    { day: "Sat", hours: "9AM–12PM",    on: true  },
    { day: "Sun", hours: "Unavailable", on: false },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">Schedule</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 space-y-6 max-w-2xl">
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">July 2025</h2>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: A }} /> Booked</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-300 dark:bg-gray-600 inline-block" /> Unavailable</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="font-semibold text-muted-foreground py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              <div />
              {days.map((d) => (
                <div key={d} className={`h-10 rounded-lg flex items-center justify-center relative font-medium transition-colors ${getColor(d)}`}
                  style={booked.includes(d) ? { background: A } : {}}>
                  {d}
                  {booked.includes(d) && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-white/80 rounded-full text-[8px] leading-none flex items-center justify-center font-bold text-blue-700">2</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Set Availability</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Block Date</button>
                <button className="px-3 py-1.5 rounded-lg text-white text-sm font-medium" style={{ background: A }}>Set Hours</button>
              </div>
            </div>
            <div className="space-y-2">
              {avail.map(({ day, hours, on }) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-semibold text-sm w-12">{day}</span>
                  <span className={`text-sm ${on ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{hours}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${on ? "" : "bg-gray-300 dark:bg-gray-600"}`} style={on ? { background: A } : {}}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
