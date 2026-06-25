import { useState } from "react";
import { MapPin, Calendar, ChevronRight, Search, Briefcase } from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const STATUS_TABS = ["All", "Pending", "Accepted", "In Progress", "Completed", "Cancelled"];
const STATUS_COLOR: Record<string, string> = {
  "In Progress": "green", "Accepted": "blue", "Pending": "yellow", "Completed": "gray", "Cancelled": "red",
};
const STATUS_COUNT: Record<string, number> = {
  "All": 6, "Pending": 1, "Accepted": 1, "In Progress": 1, "Completed": 2, "Cancelled": 1,
};

const JOBS = [
  { customer: "Ana Reyes",       title: "Ceiling fan install",  date: "July 15",  time: "10:00 AM", addr: "Fairview",   status: "In Progress", amount: "₱1,200", type: "Minor"  },
  { customer: "Carlo Mendoza",   title: "Outlet rewiring",      date: "July 15",  time: "2:00 PM",  addr: "Novaliches", status: "Accepted",    amount: "₱2,500", type: "Major"  },
  { customer: "Jenny Cruz",      title: "Panel check",          date: "July 16",  time: "9:00 AM",  addr: "Batasan",    status: "Pending",     amount: "₱800",   type: "Minor"  },
  { customer: "Mark Lim",        title: "Lighting install",     date: "July 12",  time: "1:00 PM",  addr: "Lagro",      status: "Completed",   amount: "₱1,800", type: "Minor"  },
  { customer: "Rose Dela Torre", title: "Outlet repair",        date: "July 10",  time: "3:00 PM",  addr: "Fairview",   status: "Completed",   amount: "₱600",   type: "Minor"  },
  { customer: "Bong Santos",     title: "Rewiring",             date: "July 8",   time: "11:00 AM", addr: "Novaliches", status: "Cancelled",   amount: "₱4,500", type: "Major"  },
];

export default function MyJobs({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = JOBS
    .filter((j) => tab === "All" || j.status === tab)
    .filter((j) => !search || j.customer.toLowerCase().includes(search.toLowerCase()) || j.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Jobs</h1>
            <p className="text-sm text-muted-foreground">{JOBS.length} total jobs</p>
          </div>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>

        <div className="p-6 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or job title…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border overflow-x-auto">
            {STATUS_TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5
                  ${tab === t ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                  ${tab === t ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" : "bg-muted text-muted-foreground"}`}>
                  {STATUS_COUNT[t] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Job cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try a different filter or search term</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((j, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: A }}>
                      {initials(j.customer)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{j.customer}</p>
                          <p className="text-sm text-muted-foreground">{j.title}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold">{j.amount}</span>
                          <Badge label={j.status} color={STATUS_COLOR[j.status] as any} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {j.date} · {j.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {j.addr}</span>
                        <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{j.type}</span>
                      </div>
                    </div>
                    <button onClick={() => setExpanded(expanded === i ? null : i)}
                      className="p-1 rounded-lg hover:bg-muted transition-colors ml-1 shrink-0">
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded === i ? "rotate-90" : ""}`} />
                    </button>
                  </div>

                  {/* Expanded actions */}
                  {expanded === i && (
                    <div className="px-4 pb-4 pt-1 border-t border-border bg-muted/30 flex items-center gap-2 flex-wrap">
                      {j.status === "Pending" && <>
                        <button className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: "#10B981" }}>Accept</button>
                        <button className="px-4 py-2 rounded-lg text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors">Reject</button>
                      </>}
                      {j.status === "Accepted" && (
                        <button className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: A }}>Mark In Progress</button>
                      )}
                      {j.status === "In Progress" && (
                        <button className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: "#10B981" }}>Mark Complete</button>
                      )}
                      <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">View Details</button>
                      {j.status !== "Cancelled" && j.status !== "Completed" && (
                        <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: A }}>Message Customer</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


