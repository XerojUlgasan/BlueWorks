import { useState } from "react";
import { Briefcase, Clock, DollarSign, Star, Send, Bot, TrendingUp, CheckCircle, AlertCircle, MapPin, Calendar } from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A, P } from "../../constants";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const PROFILE_ITEMS = [
  { label: "Profile photo",      done: true  },
  { label: "Job category",       done: true  },
  { label: "Skills set",         done: true  },
  { label: "Service pricing",    done: false },
  { label: "Portfolio photos",   done: false },
  { label: "Location pinned",    done: true  },
];

export default function WorkerDashboard({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const { user } = useCurrentUser();
  const [botMsg, setBotMsg] = useState("");
  const firstName = user?.fullname?.split(" ")[0] || "Worker";

  const completedItems = PROFILE_ITEMS.filter((i) => i.done).length;
  const completionPct = Math.round((completedItems / PROFILE_ITEMS.length) * 100);

  const jobs = [
    { customer: "Ana Reyes",     title: "Ceiling fan installation", time: "Today 10:00 AM",   address: "45 Rosal St. Fairview",    status: "In Progress", color: "green"  },
    { customer: "Carlo Mendoza", title: "Outlet rewiring",          time: "Today 2:00 PM",    address: "12 Dahlia Ave. Novaliches", status: "Accepted",    color: "blue"   },
    { customer: "Jenny Cruz",    title: "Panel check",              time: "Tomorrow 9:00 AM", address: "88 Iris St. Batasan",      status: "Pending",     color: "yellow" },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div>
            <h1 className="text-2xl font-bold">{greeting}, {firstName}! 👋</h1>
            <p className="text-sm text-muted-foreground">{dateStr}</p>
          </div>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>

        <div className="p-6 space-y-6 max-w-6xl">
          {/* Profile completion banner */}
          {completionPct < 100 && (
            <div className="rounded-2xl border-2 border-dashed p-4 flex items-center gap-4" style={{ borderColor: A, background: `${A}0d` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${A}20` }}>
                <AlertCircle className="w-5 h-5" style={{ color: A }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Your profile is {completionPct}% complete</p>
                <p className="text-xs text-muted-foreground mt-0.5">Complete your profile to be visible to more customers</p>
                <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${completionPct}%`, background: A }} />
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                {PROFILE_ITEMS.slice(0, 3).map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle className={`w-3.5 h-3.5 ${item.done ? "text-emerald-500" : "text-muted-foreground"}`} />
                    <span className={item.done ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Jobs Today",        val: "2",       sub: "+1 from yesterday", icon: <Briefcase className="w-5 h-5" />,   color: "#3B82F6" },
              { label: "Pending Requests",  val: "3",       sub: "Awaiting response",  icon: <Clock className="w-5 h-5" />,       color: "#F59E0B" },
              { label: "This Month",        val: "₱18,500", sub: "7 jobs completed",   icon: <DollarSign className="w-5 h-5" />,  color: "#10B981" },
              { label: "Average Rating",    val: "4.9",     sub: "128 reviews",        icon: <Star className="w-5 h-5" />,        color: "#EC4899" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
                </div>
                <p className="text-2xl font-bold">{s.val}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming jobs */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Upcoming Jobs</h2>
                <a href="/worker/jobs" className="text-xs font-medium" style={{ color: A }}>View all →</a>
              </div>
              {jobs.map((j) => (
                <div key={j.customer} className="bg-card rounded-xl border border-border p-4 flex gap-3 items-start hover:shadow-sm transition-shadow">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>{initials(j.customer)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between flex-wrap gap-1">
                      <p className="font-semibold text-sm">{j.customer}</p>
                      <Badge label={j.status} color={j.color as any} />
                    </div>
                    <p className="text-sm text-muted-foreground">{j.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {j.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {j.address}</span>
                    </p>
                  </div>
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors shrink-0">View</button>
                </div>
              ))}

              {/* Earnings snapshot */}
              <div className="bg-card rounded-2xl border border-border p-5 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Earnings Snapshot</h3>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[["Today", "₱1,200"], ["This Week", "₱6,800"], ["This Month", "₱18,500"]].map(([l, v]) => (
                    <div key={l} className="bg-muted/50 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">{l}</p>
                      <p className="font-bold text-sm mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BlueBot */}
            <div className="bg-card rounded-2xl border border-border flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: P }}><Bot className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="font-bold text-sm">Ask BlueBot</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> Online</p>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-3 text-sm overflow-y-auto">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: P }}><Bot className="w-3.5 h-3.5 text-white" /></div>
                  <div className="bg-muted rounded-xl px-3 py-2 text-xs max-w-[85%]">Hi {firstName}! You have 2 jobs today and 1 pending request. Need help with anything?</div>
                </div>
              </div>
              <div className="p-3 border-t border-border">
                <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2 border border-border">
                  <input value={botMsg} onChange={(e) => setBotMsg(e.target.value)} placeholder="Ask something…" className="flex-1 bg-transparent text-xs focus:outline-none" />
                  <button className="p-1 rounded-lg text-white" style={{ background: P }}><Send className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
