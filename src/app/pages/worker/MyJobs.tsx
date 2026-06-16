import { useState } from "react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function MyJobs({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [tab, setTab] = useState("All");
  const tabs = ["All", "Pending", "Accepted", "In Progress", "Completed", "Cancelled"];
  const jobs = [
    { customer: "Ana Reyes",      title: "Ceiling fan install", date: "July 15, 10AM", addr: "Fairview",   status: "In Progress", actions: ["View"] },
    { customer: "Carlo Mendoza",  title: "Outlet rewiring",     date: "July 15, 2PM",  addr: "Novaliches", status: "Accepted",    actions: ["View"] },
    { customer: "Jenny Cruz",     title: "Panel check",         date: "July 16, 9AM",  addr: "Batasan",    status: "Pending",     actions: ["Accept", "Reject"] },
    { customer: "Mark Lim",       title: "Lighting install",    date: "July 12",       addr: "Lagro",      status: "Completed",   actions: ["View"] },
    { customer: "Rose Dela Torre",title: "Outlet repair",       date: "July 10",       addr: "Fairview",   status: "Completed",   actions: ["View"] },
    { customer: "Bong Santos",    title: "Rewiring",            date: "July 8",        addr: "Novaliches", status: "Cancelled",   actions: ["View"] },
  ];
  const statusColor: Record<string, string> = { "In Progress": "green", "Accepted": "blue", "Pending": "yellow", "Completed": "gray", "Cancelled": "red" };
  const filtered = tab === "All" ? jobs : jobs.filter((j) => j.status === tab);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6">
          <div className="flex gap-1 mb-5 border-b border-border overflow-x-auto">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === t ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Customer", "Job Title", "Date & Time", "Address", "Status", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((j, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/30" : ""} hover:bg-muted/50 transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>{initials(j.customer)}</div>
                        <span className="font-medium">{j.customer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{j.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{j.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{j.addr}</td>
                    <td className="px-4 py-3"><Badge label={j.status} color={statusColor[j.status]} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {j.actions.map((a) => (
                          <button key={a} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${a === "Reject" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200" : "text-white"}`}
                            style={a !== "Reject" ? { background: a === "Accept" ? "#10B981" : A } : {}}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
