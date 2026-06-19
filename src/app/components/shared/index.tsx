import { useLocation, useNavigate } from "react-router";
import { Wrench, Moon, Sun } from "lucide-react";
import { A, P } from "../../constants";

export function initials(name: string) {
  const parts = name.split(" ");
  return parts[0][0].toUpperCase();
}

export function Logo({ size = "md", light = false }: { size?: "sm" | "md" | "lg"; light?: boolean }) {
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const iconSize = size === "lg" ? "w-8 h-8" : size === "sm" ? "w-5 h-5" : "w-6 h-6";
  return (
    <div className="flex items-center gap-2">
      <div className={`${iconSize} rounded-lg flex items-center justify-center`} style={{ background: light ? "rgba(255,255,255,0.2)" : A }}>
        <Wrench className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} text-white`} />
      </div>
      <span className={`font-bold ${textSize} ${light ? "text-white" : "logo-blue-text"}`}>
        Blue<span style={{ color: A }}>Works</span>
      </span>
    </div>
  );
}

export function DarkToggle({ dark, toggleDark, light = false }: { dark: boolean; toggleDark: () => void; light?: boolean }) {
  return (
    <button
      onClick={toggleDark}
      className={`p-2 rounded-lg transition-colors ${light ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export function Badge({ label, color = "blue" }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    green:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    yellow: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    red:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    gray:   "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] ?? colors.blue}`}>
      {label}
    </span>
  );
}

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`${sz} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </span>
  );
}

export function InputField({ label, type = "text", placeholder, value = "", onChange }: {
  label: string; type?: string; placeholder?: string;
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow placeholder:text-muted-foreground" />
    </div>
  );
}

export function SelectField({ label, options, value = "", onChange }: {
  label: string; options: string[];
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function PortalBanner({ type }: { type: "customer" | "worker" }) {
  const isCustomer = type === "customer";
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isRegister = pathname.includes("/register");
  const destinationFor = (portal: "customer" | "worker") =>
    isRegister ? `/${portal}/register` : `/${portal}/login`;

  return (
    <div className="mb-5 grid grid-cols-2 gap-2">
      {(["customer", "worker"] as const).map((portal) => {
        const active = portal === type;
        return (
          <button
            key={portal}
            onClick={() => navigate(destinationFor(portal))}
            className="flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: active ? `linear-gradient(135deg, ${A} 0%, ${P} 100%)` : "rgba(255,255,255,0.65)",
              color: active ? "#ffffff" : isCustomer ? A : P,
              boxShadow: active ? "0 10px 20px rgba(30, 41, 59, 0.12)" : "inset 0 0 0 1px rgba(148, 163, 184, 0.35)",
            }}
          >
            {portal === "customer" ? "Customer" : "Worker"}
          </button>
        );
      })}
    </div>
  );
}

export function AuthCard({ children, label, portalType }: { children: React.ReactNode; label: string; portalType: "customer" | "worker" }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: `linear-gradient(135deg, ${P}12 0%, ${A}08 100%)` }}>
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8 w-full max-w-md">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3"><Logo size="lg" /></div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <PortalBanner type={portalType} />
        {children}
      </div>
    </div>
  );
}
