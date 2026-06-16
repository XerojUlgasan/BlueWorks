import { Users, Wrench, CheckCircle, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AdminSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A, ADMIN_JOBS, SKILL_DEMAND } from "../../constants";

export default function AdminDashboard({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const verifications = [
    { name: "Pedro Gomez",    date: "July 14", idType: "PhilSys",  cert: "TESDA NC II"  },
    { name: "Lito Fernandez", date: "July 13", idType: "Driver's", cert: "TESDA NC III" },
    { name: "Nena Villalba",  date: "July 12", idType: "Passport", cert: "TESDA NC II"  },
    { name: "Ricky Dizon",    date: "July 11", idType: "UMID",     cert: "NC I"         },
  ];
  const reports = [
    { id: "#R-001", type: "Fake Profile",       by: "Customer", against: "Rico Delos Santos", date: "July 14", status: "Open",         color: "red"    },
    { id: "#R-002", type: "Customer Complaint", by: "Customer", against: "Lito Perez",        date: "July 13", status: "Under Review", color: "yellow" },
    { id: "#R-003", type: "Fraud Report",       by: "Customer", against: "Alma Cruz",         date: "July 10", status: "Resolved",     color: "green"  },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Total Users",           val: "4,821",    icon: <Users className="w-5 h-5" />,          color: "#3B82F6" },
              { label: "Total Workers",          val: "1,203",    icon: <Wrench className="w-5 h-5" />,         color: "#8B5CF6" },
              { label: "Jobs Completed",         val: "9,540",    icon: <CheckCircle className="w-5 h-5" />,    color: "#10B981" },
              { label: "Pending Verifications",  val: "37",       icon: <Shield className="w-5 h-5" />,         color: "#F59E0B" },
              { label: "Active Reports",         val: "12",       icon: <AlertTriangle className="w-5 h-5" />,  color: "#EF4444" },
              { label: "Platform Revenue",       val: "₱245,000", icon: <TrendingUp className="w-5 h-5" />,    color: "#0EA5E9" },
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Jobs Completed Per Month</h2>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={ADMIN_JOBS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="jobs" stroke={A} strokeWidth={2.5} dot={{ fill: A, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h2 className="font-bold mb-4">Most Requested Skills</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={SKILL_DEMAND} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={A} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-bold">Pending Verifications <Badge label="37" color="yellow" /></h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Worker Name", "Date Submitted", "ID Type", "Skill Cert", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {verifications.map((v, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/30" : ""} hover:bg-muted/50 transition-colors`}>
                    <td className="px-4 py-3 font-medium">{v.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.date}</td>
                    <td className="px-4 py-3">{v.idType}</td>
                    <td className="px-4 py-3">{v.cert}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">✅ Approve</button>
                        <button className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 transition-colors">❌ Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-bold">Active Reports <Badge label="12" color="red" /></h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Report ID", "Type", "Filed By", "Against", "Date", "Status", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/30" : ""} hover:bg-muted/50 transition-colors`}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{r.id}</td>
                    <td className="px-4 py-3">{r.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.by}</td>
                    <td className="px-4 py-3 font-medium">{r.against}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3"><Badge label={r.status} color={r.color} /></td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: A }}>
                        {r.status === "Resolved" ? "View" : "Review"}
                      </button>
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
