import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A, EARNINGS_DATA } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function EarningsPage({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const txns = [
    { date: "July 15", customer: "Ana Reyes",      job: "Ceiling fan install", amount: "₱1,200", status: "Paid"      },
    { date: "July 12", customer: "Mark Lim",        job: "Lighting install",    amount: "₱2,500", status: "Paid"      },
    { date: "July 10", customer: "Rose Dela Torre", job: "Outlet repair",       amount: "₱800",   status: "Paid"      },
    { date: "July 8",  customer: "Bong Santos",     job: "Rewiring",            amount: "₱4,500", status: "Cancelled" },
    { date: "July 5",  customer: "Jenny Cruz",      job: "Panel check",         amount: "₱1,500", status: "Paid"      },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">Earnings</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[["This Month", "₱18,500", "text-emerald-600 dark:text-emerald-400"], ["Last Month", "₱21,200", "text-blue-600 dark:text-blue-400"], ["Total Earned", "₱184,750", "text-purple-600 dark:text-purple-400"]].map(([l, v, c]) => (
              <div key={l as string} className="bg-card rounded-2xl border border-border p-5">
                <p className="text-sm text-muted-foreground mb-1">{l as string}</p>
                <p className={`text-2xl font-extrabold ${c as string}`}>{v as string}</p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-bold mb-4">Monthly Earnings (2025)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={EARNINGS_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Earnings"]} />
                <Line type="monotone" dataKey="amount" stroke={A} strokeWidth={2.5} dot={{ fill: A, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border"><h2 className="font-bold">Transaction History</h2></div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Customer", "Job", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {txns.map((t, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/30" : ""} hover:bg-muted/50 transition-colors`}>
                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-3 font-medium">{t.customer}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.job}</td>
                    <td className="px-4 py-3 font-bold">{t.amount}</td>
                    <td className="px-4 py-3"><Badge label={t.status} color={t.status === "Paid" ? "green" : "red"} /></td>
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
