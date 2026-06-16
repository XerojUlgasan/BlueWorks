import { useState } from "react";
import { Briefcase, Clock, DollarSign, Star, Send, Bot } from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function WorkerDashboard({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [botMsg, setBotMsg] = useState("");
  const jobs = [
    { customer: "Ana Reyes",    title: "Ceiling fan installation", time: "Today 10:00 AM",   address: "45 Rosal St. Fairview",   status: "In Progress", color: "green" },
    { customer: "Carlo Mendoza",title: "Outlet rewiring",         time: "Today 2:00 PM",    address: "12 Dahlia Ave. Novaliches",status: "Accepted",    color: "blue"  },
    { customer: "Jenny Cruz",   title: "Panel check",             time: "Tomorrow 9:00 AM", address: "88 Iris St. Batasan",     status: "Pending",     color: "yellow"},
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div>
            <h1 className="text-2xl font-bold">Good morning, Juan! 👋</h1>
            <p className="text-sm text-muted-foreground">Tuesday, July 15, 2025</p>
          </div>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Jobs Today",       val: "2",       icon: <Briefcase className="w-5 h-5" />, color: "#3B82F6" },
              { label: "Pending Requests", val: "3",       icon: <Clock className="w-5 h-5" />,     color: "#F59E0B" },
              { label: "This Month",       val: "₱18,500", icon: <DollarSign className="w-5 h-5" />,color: "#10B981" },
              { label: "Average Rating",   val: "⭐ 4.9",  icon: <Star className="w-5 h-5" />,      color: "#EC4899" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
                </div>
                <p className="text-2xl font-bold">{s.val}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-bold text-lg">Upcoming Jobs</h2>
              {jobs.map((j) => (
                <div key={j.customer} className="bg-card rounded-xl border border-border p-4 flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>{initials(j.customer)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between flex-wrap gap-1">
                      <p className="font-semibold text-sm">{j.customer}</p>
                      <Badge label={j.status} color={j.color === "green" ? "green" : j.color === "blue" ? "blue" : "yellow"} />
                    </div>
                    <p className="text-sm text-muted-foreground">{j.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">📅 {j.time} · 📍 {j.address}</p>
                  </div>
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">View</button>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-2xl border border-border flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: A }}><Bot className="w-4 h-4 text-white" /></div>
                <p className="font-bold text-sm">Ask BlueBot</p>
              </div>
              <div className="flex-1 p-4 space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-muted rounded-xl px-3 py-2 text-xs">Hi Juan! You have 2 jobs today and 1 pending request.</div>
                </div>
              </div>
              <div className="p-3 border-t border-border">
                <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2 border border-border">
                  <input value={botMsg} onChange={(e) => setBotMsg(e.target.value)} placeholder="Ask something..." className="flex-1 bg-transparent text-xs focus:outline-none" />
                  <button className="p-1 rounded-lg text-white" style={{ background: A }}><Send className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
