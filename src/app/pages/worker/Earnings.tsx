import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A, EARNINGS_DATA } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const WEEKLY_DATA = [
  { week: "Wk 1", amount: 4200 },
  { week: "Wk 2", amount: 5800 },
  { week: "Wk 3", amount: 3900 },
  { week: "Wk 4", amount: 4600 },
];

const TXNS = [
  { date: "July 15", customer: "Ana Reyes",       job: "Ceiling fan install", amount: 1200, status: "Paid",      type: "Minor"     },
  { date: "July 12", customer: "Mark Lim",         job: "Lighting install",    amount: 2500, status: "Paid",      type: "Minor"     },
  { date: "July 10", customer: "Rose Dela Torre",  job: "Outlet repair",       amount: 800,  status: "Paid",      type: "Minor"     },
  { date: "July 8",  customer: "Bong Santos",      job: "Rewiring",            amount: 4500, status: "Cancelled", type: "Major"     },
  { date: "July 5",  customer: "Jenny Cruz",       job: "Panel check",         amount: 1500, status: "Paid",      type: "Minor"     },
  { date: "July 3",  customer: "Carlo Mendoza",    job: "Emergency repair",    amount: 3200, status: "Paid",      type: "Emergency" },
];

const CHART_TABS = ["Monthly", "Weekly"] as const;

export default function EarningsPage({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [chartTab, setChartTab] = useState<typeof CHART_TABS[number]>("Monthly");

  const totalPaid = TXNS.filter((t) => t.status === "Paid").reduce((sum, t) => sum + t.amount, 0);
  const thisMonth = 18500;
  const lastMonth = 21200;
  const diff = thisMonth - lastMonth;
  const diffPct = Math.abs(Math.round((diff / lastMonth) * 100));
  const isUp = diff >= 0;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Earnings</h1>
            <p className="text-sm text-muted-foreground">Your revenue overview</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <DarkToggle dark={dark} toggleDark={toggleDark} />
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-5xl">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "This Month",    val: `₱${thisMonth.toLocaleString()}`, sub: isUp ? `↑ ${diffPct}% vs last` : `↓ ${diffPct}% vs last`, up: isUp,  icon: <DollarSign className="w-4 h-4" />, color: "#10B981" },
              { label: "Last Month",    val: `₱${lastMonth.toLocaleString()}`, sub: "Previous period",    up: true,  icon: <TrendingDown className="w-4 h-4" />, color: "#3B82F6"  },
              { label: "Total Earned",  val: "₱184,750",                       sub: "All time",           up: true,  icon: <TrendingUp className="w-4 h-4" />,   color: "#8B5CF6"  },
              { label: "Completed Jobs",val: "7",                              sub: "This month",         up: true,  icon: <Briefcase className="w-4 h-4" />,    color: "#EC4899"  },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: s.color }}>{s.icon}</div>
                </div>
                <p className="text-xl font-extrabold">{s.val}</p>
                <p className={`text-xs mt-1 ${s.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Earnings Overview</h2>
              <div className="flex gap-1 border border-border rounded-lg p-0.5">
                {CHART_TABS.map((t) => (
                  <button key={t} onClick={() => setChartTab(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${chartTab === t ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                    style={chartTab === t ? { background: A } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              {chartTab === "Monthly" ? (
                <LineChart data={EARNINGS_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Earnings"]} />
                  <Line type="monotone" dataKey="amount" stroke={A} strokeWidth={2.5} dot={{ fill: A, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              ) : (
                <BarChart data={WEEKLY_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Earnings"]} />
                  <Bar dataKey="amount" fill={A} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Transaction history */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold">Transaction History</h2>
              <span className="text-sm text-muted-foreground">{TXNS.length} transactions</span>
            </div>
            <div className="divide-y divide-border">
              {TXNS.map((t, i) => (
                <div key={i} className={`px-5 py-3.5 flex items-center gap-3 hover:bg-muted/40 transition-colors ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>
                    {initials(t.customer)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{t.customer}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                        ${t.type === "Emergency" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : t.type === "Major" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
                        {t.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.job} · {t.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-sm ${t.status === "Cancelled" ? "text-muted-foreground line-through" : ""}`}>
                      ₱{t.amount.toLocaleString()}
                    </p>
                    <Badge label={t.status} color={t.status === "Paid" ? "green" : "red"} />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-border bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total paid this period</span>
                <span className="font-bold">₱{totalPaid.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
