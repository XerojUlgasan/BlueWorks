import { useState } from "react";
import {
  Wrench, User, Star, MapPin, Shield, Calendar, Zap, Bell, Moon, Sun,
  ChevronRight, MessageCircle, Home, Briefcase, DollarSign, Send, Mic,
  Paperclip, Search, CheckCircle, ArrowRight, LogOut, BarChart2, Users,
  Clock, Phone, Plus, X, Upload, Bot, Settings, FileText, TrendingUp,
  ChevronDown, Eye, AlertTriangle, Check, Hammer, Mail, Sparkles,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

// ── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "landing" | "customer-login" | "customer-register"
  | "worker-login" | "worker-register" | "bluebot-onboard"
  | "worker-discovery" | "worker-profile" | "booking"
  | "bluebot-chat" | "reviews" | "worker-dashboard"
  | "my-jobs" | "schedule" | "messages" | "profile-editor"
  | "earnings" | "admin-dashboard";

type NavProps = { navigate: (p: Page) => void; dark: boolean; toggleDark: () => void };

// ── Constants ────────────────────────────────────────────────────────────────
const P = "#1B3A6B";   // primary blue
const A = "#3B82F6";   // accent sky blue

const WORKERS = [
  { id: 1, name: "Juan dela Cruz",  skill: "Electrician",  rating: 4.9, dist: "0.8 km", status: "Today",       color: "#3B82F6", mx: 270, my: 258 },
  { id: 2, name: "Maria Santos",    skill: "Plumber",      rating: 4.7, dist: "1.2 km", status: "Today",       color: "#10B981", mx: 370, my: 205 },
  { id: 3, name: "Rico Reyes",      skill: "Carpenter",    rating: 4.8, dist: "2.1 km", status: "Tomorrow",    color: "#F59E0B", mx: 435, my: 305 },
  { id: 4, name: "Liza Bautista",   skill: "Painter",      rating: 4.6, dist: "3.5 km", status: "Today",       color: "#EC4899", mx: 188, my: 322 },
  { id: 5, name: "Ben Villanueva",  skill: "Mason",        rating: 4.5, dist: "4.8 km", status: "Unavailable", color: "#8B5CF6", mx: 510, my: 185 },
];

const BARANGAYS = [
  "Fairview","Novaliches","Batasan Hills","Lagro","Commonwealth",
  "Bagong Silangan","Holy Spirit","Payatas","Matandang Balara","Tandang Sora",
];
const SKILLS_LIST = ["Electrician","Plumber","Carpenter","Painter","Mason","Welder","Aircon Technician"];

const EARNINGS_DATA = [
  { month: "Jan", amount: 14000 }, { month: "Feb", amount: 16500 },
  { month: "Mar", amount: 19000 }, { month: "Apr", amount: 17800 },
  { month: "May", amount: 22000 }, { month: "Jun", amount: 21200 },
  { month: "Jul", amount: 18500 },
];

const ADMIN_JOBS = [
  { month: "Jan", jobs: 320 }, { month: "Feb", jobs: 410 }, { month: "Mar", jobs: 580 },
  { month: "Apr", jobs: 620 }, { month: "May", jobs: 750 }, { month: "Jun", jobs: 890 },
  { month: "Jul", jobs: 940 },
];

const SKILL_DEMAND = [
  { skill: "Electrician", count: 1840 }, { skill: "Plumber", count: 1620 },
  { skill: "Carpenter", count: 1100 }, { skill: "Painter", count: 890 },
  { skill: "Aircon Tech", count: 760 }, { skill: "Mason", count: 540 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`${sz} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
      ))}
    </span>
  );
}

function Badge({ label, color = "blue" }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    yellow: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    gray: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] ?? colors.blue}`}>
      {label}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const s = status.toLowerCase();
  const color = s.includes("progress") ? "bg-emerald-500" : s.includes("accept") ? "bg-blue-500" : s.includes("pend") ? "bg-amber-500" : s.includes("cancel") ? "bg-red-500" : s.includes("complete") ? "bg-emerald-600" : "bg-gray-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

// ── Shared Components ────────────────────────────────────────────────────────
function Logo({ size = "md", light = false }: { size?: "sm" | "md" | "lg"; light?: boolean }) {
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const iconSize = size === "lg" ? "w-8 h-8" : size === "sm" ? "w-5 h-5" : "w-6 h-6";
  return (
    <div className="flex items-center gap-2">
      <div className={`${iconSize} rounded-lg flex items-center justify-center`} style={{ background: light ? "rgba(255,255,255,0.2)" : A }}>
        <Wrench className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} text-white`} />
      </div>
      <span className={`font-bold ${textSize} ${light ? "text-white" : ""}`} style={!light ? { color: P } : {}}>
        Blue<span style={{ color: A }}>Works</span>
      </span>
    </div>
  );
}

function DarkToggle({ dark, toggleDark, light = false }: { dark: boolean; toggleDark: () => void; light?: boolean }) {
  return (
    <button
      onClick={toggleDark}
      className={`p-2 rounded-lg transition-colors ${light ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

function CustomerNav({ navigate, dark, toggleDark, activePage }: NavProps & { activePage?: string }) {
  const links: [string, Page][] = [["Home", "bluebot-onboard"], ["Find Workers", "worker-discovery"], ["My Bookings", "booking"], ["Messages", "bluebot-chat"]];
  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border px-6 py-3 flex items-center gap-6">
      <button onClick={() => navigate("landing")}><Logo /></button>
      <div className="hidden md:flex items-center gap-1 ml-4 flex-1">
        {links.map(([label, page]) => (
          <button key={label} onClick={() => navigate(page)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activePage === page ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            style={activePage === page ? { backgroundColor: A } : {}}>{label}</button>
        ))}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <DarkToggle dark={dark} toggleDark={toggleDark} />
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ background: A }}>
          AR
        </button>
      </div>
    </nav>
  );
}

function WorkerSidebar({ navigate, activePage }: { navigate: (p: Page) => void; activePage: Page }) {
  const items: [React.ReactNode, string, Page][] = [
    [<Home className="w-5 h-5" />, "Dashboard", "worker-dashboard"],
    [<Briefcase className="w-5 h-5" />, "My Jobs", "my-jobs"],
    [<Calendar className="w-5 h-5" />, "Schedule", "schedule"],
    [<MessageCircle className="w-5 h-5" />, "Messages", "messages"],
    [<User className="w-5 h-5" />, "My Profile", "profile-editor"],
    [<DollarSign className="w-5 h-5" />, "Earnings", "earnings"],
  ];
  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0" style={{ backgroundColor: P }}>
      <div className="p-5 border-b border-white/10">
        <Logo light />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(([icon, label, page]) => (
          <button key={label} onClick={() => navigate(page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activePage === page ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
            {icon}{label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>JC</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Juan dela Cruz</p>
          <p className="text-xs text-white/60">Electrician</p>
        </div>
        <button className="text-white/50 hover:text-white/80 transition-colors"><LogOut className="w-4 h-4" /></button>
      </div>
    </aside>
  );
}

function AdminSidebar({ navigate, activePage }: { navigate: (p: Page) => void; activePage: string }) {
  const items: [React.ReactNode, string][] = [
    [<Home className="w-5 h-5" />, "Overview"],
    [<Users className="w-5 h-5" />, "Users"],
    [<Wrench className="w-5 h-5" />, "Workers"],
    [<Briefcase className="w-5 h-5" />, "Bookings"],
    [<AlertTriangle className="w-5 h-5" />, "Reports"],
    [<BarChart2 className="w-5 h-5" />, "Analytics"],
    [<Settings className="w-5 h-5" />, "Settings"],
  ];
  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0" style={{ backgroundColor: P }}>
      <div className="p-5 border-b border-white/10">
        <Logo light />
        <span className="mt-1 block text-xs text-white/50 font-medium uppercase tracking-wider">Admin Panel</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(([icon, label]) => (
          <button key={label} onClick={() => navigate("admin-dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activePage === label ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
            {icon}{label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">AD</div>
        <div>
          <p className="text-sm font-semibold text-white">Admin User</p>
          <p className="text-xs text-white/60">Super Admin</p>
        </div>
      </div>
    </aside>
  );
}

// ── Page 1: Landing ──────────────────────────────────────────────────────────
function LandingPage({ navigate, dark, toggleDark }: NavProps) {
  const skills = [
    { label: "Electrician", icon: "⚡" }, { label: "Plumber", icon: "🔧" },
    { label: "Carpenter", icon: "🪚" }, { label: "Painter", icon: "🖌️" },
    { label: "Aircon Tech", icon: "❄️" }, { label: "Mason", icon: "🧱" },
  ];
  const features = [
    { icon: <Sparkles className="w-6 h-6 text-blue-500" />, title: "AI-Powered Matching", desc: "BlueBot finds the right worker for your exact problem in seconds." },
    { icon: <Shield className="w-6 h-6 text-blue-500" />, title: "Verified Professionals", desc: "Every worker is identity and skills verified before joining." },
    { icon: <Calendar className="w-6 h-6 text-blue-500" />, title: "Book in Minutes", desc: "Schedule a service and get confirmations without hassle." },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border px-6 py-3 flex items-center">
        <Logo size="lg" />
        <div className="flex items-center gap-3 ml-auto">
          <DarkToggle dark={dark} toggleDark={toggleDark} />
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">Log In</button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ background: A }}
            onClick={() => navigate("customer-login")}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center" style={{ background: `linear-gradient(160deg, ${P}08 0%, ${A}10 100%)` }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: A }}>The Philippines #1 Blue-Collar Platform</p>
        <h1 className="text-5xl font-extrabold leading-tight mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
          Find Trusted Workers<br /><span style={{ color: A }}>Near You</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
          BlueWorks connects you with verified electricians, plumbers, carpenters and more — right in your barangay.
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          {/* Customer Card */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 w-72 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: `${A}15` }}>👤</div>
            <h3 className="text-xl font-bold mb-1">I'm a Customer</h3>
            <p className="text-sm text-muted-foreground mb-6">I need to hire a skilled worker</p>
            <button onClick={() => navigate("customer-login")}
              className="w-full py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: A }}>
              Find a Worker <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {/* Worker Card */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 w-72 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: `${P}15` }}>🔧</div>
            <h3 className="text-xl font-bold mb-1">I'm a Worker</h3>
            <p className="text-sm text-muted-foreground mb-6">I want to offer my skills</p>
            <button onClick={() => navigate("worker-login")}
              className="w-full py-2.5 rounded-lg font-semibold border-2 transition-colors hover:text-white flex items-center justify-center gap-2"
              style={{ borderColor: P, color: P }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = P; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = P; }}>
              Offer My Skills <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skill Chips */}
      <section className="px-6 pb-10 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Most Requested Skills</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {skills.map((s) => (
            <button key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium">
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Top Rated Workers */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Top Rated Workers Near You</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {WORKERS.slice(0, 4).map((w) => (
            <div key={w.id} className="bg-card rounded-2xl border border-border p-5 min-w-[200px] hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate("worker-profile")}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto" style={{ background: w.color }}>{initials(w.name)}</div>
              <p className="font-semibold text-center text-sm mb-1">{w.name}</p>
              <p className="text-xs text-center text-muted-foreground mb-2">{w.skill}</p>
              <div className="flex items-center justify-center gap-1 text-xs mb-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{w.rating}
                <span className="text-muted-foreground ml-1">· {w.dist}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-3 h-3" /> Verified
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <Logo />
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">Your trusted local workforce, one tap away.</p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            {["About", "How it Works", "For Workers", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© 2025 BlueWorks. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ── Auth Base Card ────────────────────────────────────────────────────────────
function AuthCard({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12" style={{ background: `linear-gradient(135deg, ${P}12 0%, ${A}08 100%)` }}>
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Logo size="lg" /></div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow placeholder:text-muted-foreground" />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <select className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Pages 2–5: Auth ───────────────────────────────────────────────────────────
function CustomerLogin({ navigate }: NavProps) {
  return (
    <AuthCard label="Customer Portal">
      <div className="space-y-4">
        <InputField label="Email Address" type="email" placeholder="juandelacruz@email.com" />
        <InputField label="Password" type="password" placeholder="••••••••" />
        <div className="text-right"><a href="#" className="text-xs font-medium" style={{ color: A }}>Forgot password?</a></div>
        <button onClick={() => navigate("bluebot-onboard")}
          className="w-full py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90" style={{ background: A }}>
          Log In
        </button>
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 border-t border-border" /><span className="text-xs text-muted-foreground">or</span><div className="flex-1 border-t border-border" />
        </div>
        <button className="w-full py-2.5 rounded-lg border border-border text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button onClick={() => navigate("customer-register")} className="font-semibold" style={{ color: A }}>Register here</button>
        </p>
      </div>
    </AuthCard>
  );
}

function CustomerRegister({ navigate }: NavProps) {
  return (
    <AuthCard label="Create a Customer Account">
      <div className="space-y-3">
        <InputField label="Full Name" placeholder="Ana Reyes" />
        <InputField label="Contact Number" placeholder="+63 912 345 6789" />
        <InputField label="Email Address" type="email" placeholder="ana.reyes@email.com" />
        <InputField label="Password" type="password" placeholder="••••••••" />
        <InputField label="Confirm Password" type="password" placeholder="••••••••" />
        <InputField label="Address" placeholder="123 Sampaguita St." />
        <SelectField label="Barangay" options={BARANGAYS} />
        <button onClick={() => navigate("bluebot-onboard")}
          className="w-full py-3 rounded-lg text-white font-semibold mt-2 transition-opacity hover:opacity-90" style={{ background: A }}>
          Create Account
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => navigate("customer-login")} className="font-semibold" style={{ color: A }}>Log in</button>
        </p>
      </div>
    </AuthCard>
  );
}

function WorkerLogin({ navigate }: NavProps) {
  return (
    <AuthCard label="Worker Portal">
      <div className="space-y-4">
        <InputField label="Email Address" type="email" placeholder="juan.delacruz@email.com" />
        <InputField label="Password" type="password" placeholder="••••••••" />
        <div className="text-right"><a href="#" className="text-xs font-medium" style={{ color: A }}>Forgot password?</a></div>
        <button onClick={() => navigate("worker-dashboard")}
          className="w-full py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90" style={{ background: P }}>
          Log In
        </button>
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 border-t border-border" /><span className="text-xs text-muted-foreground">or</span><div className="flex-1 border-t border-border" />
        </div>
        <button className="w-full py-2.5 rounded-lg border border-border text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button onClick={() => navigate("worker-register")} className="font-semibold" style={{ color: P }}>Register here</button>
        </p>
      </div>
    </AuthCard>
  );
}

function WorkerRegister({ navigate }: NavProps) {
  return (
    <AuthCard label="Create a Worker Account">
      <div className="space-y-3">
        <InputField label="Full Name" placeholder="Juan dela Cruz" />
        <InputField label="Contact Number" placeholder="+63 917 123 4567" />
        <InputField label="Email Address" type="email" placeholder="juan.delacruz@email.com" />
        <InputField label="Password" type="password" placeholder="••••••••" />
        <InputField label="Confirm Password" type="password" placeholder="••••••••" />
        <InputField label="Address" placeholder="45 Rosal St." />
        <SelectField label="Barangay" options={BARANGAYS} />
        <SelectField label="Primary Skill" options={SKILLS_LIST} />
        <button onClick={() => navigate("worker-dashboard")}
          className="w-full py-3 rounded-lg text-white font-semibold mt-2 transition-opacity hover:opacity-90" style={{ background: P }}>
          Register as Worker
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => navigate("worker-login")} className="font-semibold" style={{ color: P }}>Log in</button>
        </p>
      </div>
    </AuthCard>
  );
}

// ── Page 6: BlueBot Onboarding ────────────────────────────────────────────────
function BlueBotOnboard({ navigate, dark, toggleDark }: NavProps) {
  const [query, setQuery] = useState("");
  const chips = ["🔧 Leaking pipe", "💡 No electricity", "🪟 Broken door", "❄️ Aircon not cooling", "🪣 Clogged drain"];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1B3A6B 100%)" }}>
      <div className="flex justify-end p-4 gap-3">
        <DarkToggle dark={dark} toggleDark={toggleDark} light />
        <button className="relative p-2 text-white/70 hover:text-white"><Bell className="w-5 h-5" /></button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>AR</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(59,130,246,0.2)", border: "2px solid rgba(59,130,246,0.4)" }}>
          <Bot className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-blue-300 mb-2">BlueBot</h2>
        <h1 className="text-4xl font-extrabold text-white mb-3 text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
          What service do you need?
        </h1>
        <p className="text-blue-200/70 text-center mb-8 max-w-md">
          Describe your problem and I'll find the right worker for you — fast and hassle-free.
        </p>
        {/* Input box */}
        <div className="w-full max-w-2xl rounded-2xl p-4 relative" style={{ background: "rgba(255,255,255,0.05)", border: `1.5px solid ${query ? A : "rgba(255,255,255,0.15)"}`, boxShadow: query ? `0 0 20px ${A}40` : "none", transition: "all 0.2s" }}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. My sink is leaking, I need an electrician..."
            rows={3}
            className="w-full bg-transparent text-white placeholder:text-blue-200/40 text-base resize-none focus:outline-none"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg text-blue-300/60 hover:text-blue-300 transition-colors"><Mic className="w-5 h-5" /></button>
              <button className="p-1.5 rounded-lg text-blue-300/60 hover:text-blue-300 transition-colors"><Paperclip className="w-5 h-5" /></button>
            </div>
            <button onClick={() => navigate("bluebot-chat")}
              className="px-5 py-2 rounded-xl text-white font-semibold flex items-center gap-2 transition-opacity hover:opacity-90" style={{ background: A }}>
              Find Worker <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Chips */}
        <div className="flex flex-wrap gap-2 justify-center mt-5">
          {chips.map((c) => (
            <button key={c} onClick={() => setQuery(c.slice(3))}
              className="px-3 py-1.5 rounded-full text-sm text-blue-200 transition-all hover:text-white"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => navigate("worker-discovery")} className="mt-10 text-sm text-blue-300/60 hover:text-blue-300 transition-colors underline underline-offset-2">
          Prefer to search manually? → Browse Workers
        </button>
      </div>
    </div>
  );
}

// ── Page 7: Worker Discovery + Map ───────────────────────────────────────────
function DarkMap({ onSelectWorker }: { onSelectWorker: (id: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 320, cy = 270;
  const roads = {
    major: [
      { x1: 0, y1: 130, x2: 700, y2: 130 }, { x1: 0, y1: 270, x2: 700, y2: 270 },
      { x1: 0, y1: 400, x2: 700, y2: 400 }, { x1: 100, y1: 0, x2: 100, y2: 520 },
      { x1: 320, y1: 0, x2: 320, y2: 520 }, { x1: 540, y1: 0, x2: 540, y2: 520 },
    ],
    secondary: [
      { x1: 0, y1: 60, x2: 700, y2: 60 }, { x1: 0, y1: 200, x2: 700, y2: 200 },
      { x1: 0, y1: 335, x2: 700, y2: 335 }, { x1: 0, y1: 460, x2: 700, y2: 460 },
      { x1: 210, y1: 0, x2: 210, y2: 520 }, { x1: 430, y1: 0, x2: 430, y2: 520 },
      { x1: 620, y1: 0, x2: 620, y2: 520 },
    ],
    diagonal: [
      { x1: 0, y1: 480, x2: 650, y2: 30 },
    ],
  };
  const streetLabels = [
    { x: 330, y: 125, text: "EDSA" }, { x: 105, y: 265, text: "Commonwealth Ave", angle: -90 },
    { x: 325, y: 265, text: "Quirino Hwy", angle: -90 }, { x: 80, y: 195, text: "Regalado Ave" },
    { x: 340, y: 395, text: "Mindanao Ave" },
  ];
  return (
    <div className="relative w-full h-full" style={{ background: "#0B1120", minHeight: 400 }}>
      <svg width="100%" height="100%" viewBox="0 0 700 520" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        {/* Block fills */}
        {[60,130,200,270,335,400].map((y, i) =>
          [100,210,320,430,540].map((x, j) => (
            <rect key={`${i}-${j}`} x={x+2} y={y+2} width={104} height={(i%2===0?68:128)} rx={1} fill="rgba(255,255,255,0.018)" />
          ))
        )}
        {/* Minor streets */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`mh${i}`} x1={0} y1={i*52} x2={700} y2={i*52} stroke="rgba(200,210,255,0.05)" strokeWidth={0.5} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`mv${i}`} x1={i*52} y1={0} x2={i*52} y2={520} stroke="rgba(200,210,255,0.05)" strokeWidth={0.5} />
        ))}
        {/* Secondary roads */}
        {roads.secondary.map((r, i) => (
          <line key={`s${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(200,210,255,0.1)" strokeWidth={1.5} />
        ))}
        {/* Major roads */}
        {roads.major.map((r, i) => (
          <line key={`m${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(200,210,255,0.18)" strokeWidth={3} />
        ))}
        {/* Diagonal EDSA */}
        {roads.diagonal.map((r, i) => (
          <line key={`d${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(200,210,255,0.22)" strokeWidth={4} />
        ))}
        {/* Road labels */}
        {streetLabels.map((l) => (
          <text key={l.text} x={l.x} y={l.y} fill="rgba(255,255,255,0.28)" fontSize={8} fontFamily="Inter,sans-serif"
            transform={l.angle ? `rotate(${l.angle} ${l.x} ${l.y})` : undefined}>{l.text}</text>
        ))}
        {/* Park */}
        <rect x={160} y={70} width={40} height={50} rx={4} fill="rgba(16,185,129,0.07)" />
        <text x={165} y={100} fill="rgba(16,185,129,0.4)" fontSize={6} fontFamily="Inter,sans-serif">Park</text>
        {/* Radius rings */}
        <circle cx={cx} cy={cy} r={65} fill="none" stroke={A} strokeWidth={1} strokeDasharray="5,4" opacity={0.35} />
        <circle cx={cx} cy={cy} r={125} fill="none" stroke={A} strokeWidth={1} strokeDasharray="5,4" opacity={0.22} />
        <circle cx={cx} cy={cy} r={185} fill="none" stroke={A} strokeWidth={1} strokeDasharray="5,4" opacity={0.13} />
        <text x={cx+68} y={cy-4} fill={A} fontSize={7} opacity={0.5} fontFamily="Inter,sans-serif">1 km</text>
        <text x={cx+128} y={cy-4} fill={A} fontSize={7} opacity={0.4} fontFamily="Inter,sans-serif">3 km</text>
        {/* User dot */}
        <circle cx={cx} cy={cy} r={22} fill={A} opacity={0.08} />
        <circle cx={cx} cy={cy} r={13} fill={A} opacity={0.18} />
        <circle cx={cx} cy={cy} r={7} fill={A} />
        <circle cx={cx} cy={cy} r={3} fill="white" />
        <text x={cx+10} y={cy-10} fill="white" fontSize={8} fontFamily="Inter,sans-serif" opacity={0.7}>You</text>
        {/* Worker pins */}
        {WORKERS.map((w) => (
          <g key={w.id} style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovered(w.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectWorker(w.id)}>
            <circle cx={w.mx} cy={w.my} r={18} fill={w.color} opacity={hovered === w.id ? 1 : 0.85} />
            <circle cx={w.mx} cy={w.my} r={18} fill="none" stroke="white" strokeWidth={2} opacity={hovered === w.id ? 1 : 0.6} />
            <polygon points={`${w.mx-5},${w.my+18} ${w.mx+5},${w.my+18} ${w.mx},${w.my+26}`} fill={w.color} opacity={hovered === w.id ? 1 : 0.85} />
            <text x={w.mx} y={w.my+5} fill="white" fontSize={9} fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="700">{initials(w.name)}</text>
            {hovered === w.id && (
              <g>
                <rect x={w.mx - 60} y={w.my - 75} width={120} height={62} rx={6} fill="#1E293B" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                <text x={w.mx} y={w.my-55} fill="white" fontSize={9} fontFamily="Poppins,sans-serif" textAnchor="middle" fontWeight="600">{w.name}</text>
                <text x={w.mx} y={w.my-42} fill="#94A3B8" fontSize={8} fontFamily="Inter,sans-serif" textAnchor="middle">{w.skill} · ⭐{w.rating} · {w.dist}</text>
                <rect x={w.mx - 28} y={w.my - 34} width={56} height={16} rx={4} fill={A} />
                <text x={w.mx} y={w.my-23} fill="white" fontSize={8} fontFamily="Inter,sans-serif" textAnchor="middle" fontWeight="600">View Profile</text>
              </g>
            )}
          </g>
        ))}
      </svg>
      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {["+", "−", "⊕"].map((c) => (
          <button key={c} className="w-8 h-8 rounded-lg text-white flex items-center justify-center text-sm font-bold transition-colors"
            style={{ background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}>{c}</button>
        ))}
      </div>
    </div>
  );
}

function WorkerDiscovery({ navigate, dark, toggleDark }: NavProps) {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const avail_colors: Record<string, string> = { Today: "text-emerald-500", Tomorrow: "text-amber-500", Unavailable: "text-red-400" };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerNav navigate={navigate} dark={dark} toggleDark={toggleDark} activePage="worker-discovery" />
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {/* Left panel */}
        <div className="w-96 flex flex-col border-r border-border overflow-y-auto shrink-0">
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="Search by name, skill, or service..." className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            {/* Filters */}
            <details open className="group">
              <summary className="flex justify-between items-center cursor-pointer text-sm font-semibold py-1">Skill <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" /></summary>
              <div className="mt-2 space-y-1.5 pl-1">
                {["Plumber","Electrician","Mason","Carpenter","Painter"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />{s}
                  </label>
                ))}
              </div>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-sm font-semibold py-1">Distance <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" /></summary>
              <div className="mt-2 space-y-1.5 pl-1">
                {["Within 1km","Within 3km","Within 5km"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="dist" />{s}</label>
                ))}
              </div>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-sm font-semibold py-1">Rating <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" /></summary>
              <div className="mt-2 space-y-1.5 pl-1">
                {["4★ and above","4.5★ and above"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="rating" />{s}</label>
                ))}
              </div>
            </details>
            <label className="flex items-center justify-between text-sm font-semibold py-1">
              Verified Only
              <div className="w-10 h-5 rounded-full relative cursor-pointer" style={{ background: A }}>
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </label>
          </div>
          {/* Worker cards */}
          <div className="flex-1 border-t border-border p-3 space-y-3">
            {WORKERS.map((w) => (
              <div key={w.id} className="bg-card rounded-xl border border-border p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ background: w.color }}>{initials(w.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm">{w.name}</p>
                      {w.dist !== "4.8 km" && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{w.skill}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="flex items-center gap-0.5 text-xs"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{w.rating}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" />{w.dist}</span>
                      <span className={`text-xs font-medium ${avail_colors[w.status] ?? "text-gray-400"}`}>● {w.status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate("worker-profile")}
                  className="w-full mt-2 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90" style={{ background: A }}>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Map */}
        <div className="flex-1 relative">
          <DarkMap onSelectWorker={() => navigate("worker-profile")} />
        </div>
      </div>
    </div>
  );
}

// ── Page 8: Worker Profile ────────────────────────────────────────────────────
function WorkerProfile({ navigate, dark, toggleDark }: NavProps) {
  const [tab, setTab] = useState("about");
  const tabs = ["about", "portfolio", "reviews", "availability"];
  const reviews = [
    { name: "Ana Reyes", rating: 5, date: "July 10", job: "Electrical Repair", comment: "Very professional. Arrived on time, cleaned up after. Will hire again!" },
    { name: "Carlo Mendoza", rating: 5, date: "June 28", job: "Rewiring", comment: "Fixed our short circuit quickly. Highly recommended!" },
    { name: "Jenny Cruz", rating: 4, date: "June 15", job: "Panel Inspection", comment: "Good work, arrived 30 mins late. Great overall though." },
    { name: "Mark Lim", rating: 5, date: "June 5", job: "Lighting Installation", comment: "Very affordable and honest. My go-to electrician." },
  ];
  const avail = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
    day: d, hours: i === 2 ? null : i === 6 ? null : i === 5 ? "9AM–12PM" : "8AM–5PM"
  }));
  return (
    <div className="min-h-screen bg-background">
      <CustomerNav navigate={navigate} dark={dark} toggleDark={toggleDark} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
          <div className="flex gap-5 flex-wrap">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0" style={{ background: A }}>JC</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold">Juan dela Cruz</h1>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge label="Electrician" /><Badge label="Rewiring" color="purple" /><Badge label="Lighting Installation" color="gray" />
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-4 h-4" /> Verified Identity</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Shield className="w-4 h-4" /> Verified Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 <span className="text-muted-foreground">(128 reviews)</span></span>
                    <span className="flex items-center gap-1 text-muted-foreground"><FileText className="w-4 h-4" /> 143 Jobs</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-4 h-4" /> 87 Repeat</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Brgy. Fairview, Quezon City</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Responds within 30 min</span>
                  </div>
                </div>
                {/* Trust Score */}
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3"/>
                      <circle cx="18" cy="18" r="15" fill="none" stroke={A} strokeWidth="3" strokeDasharray="86 100" strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">92</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Trust Score</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => navigate("booking")}
                  className="px-5 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: A }}>Book Now</button>
                <button onClick={() => navigate("bluebot-chat")}
                  className="px-5 py-2 rounded-lg font-semibold text-sm border border-border hover:bg-muted transition-colors">Message</button>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        {/* Tab content */}
        {tab === "about" && (
          <div className="space-y-5">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">Licensed electrician with 8 years of experience specializing in residential rewiring, panel upgrades, and lighting systems.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["Experience", "8 Years"], ["Service Area", "Fairview, Novaliches, Batasan, Lagro (QC)"]].map(([k, v]) => (
                <div key={k} className="bg-card rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-1">{k}</p><p className="text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold mb-3">Pricing</h3>
              <div className="grid grid-cols-3 gap-3">
                {[["Inspection Fee", "₱300"], ["Hourly Rate", "₱500/hr"], ["Fixed Rate", "from ₱800"]].map(([l, v]) => (
                  <div key={l} className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-lg font-bold" style={{ color: A }}>{v}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold mb-2">Certifications</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge label="TESDA NC II — Electrical Installation" color="blue" />
                <Badge label="TESDA NC III — Electrical Installation" color="blue" />
              </div>
            </div>
          </div>
        )}
        {tab === "portfolio" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Panel upgrade", "Rewiring job", "Lighting install", "Outlet repair", "Circuit fix", "Inspection"].map((label, i) => (
              <div key={label} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="h-32 flex items-center justify-center text-muted-foreground" style={{ background: `linear-gradient(135deg, ${P}15, ${A}15)` }}>
                  <div className="text-center"><Hammer className="w-8 h-8 mx-auto mb-1 opacity-40" /><p className="text-xs opacity-50">Photo {i+1}</p></div>
                </div>
                <div className="p-3"><p className="text-xs font-medium">{label}</p><p className="text-xs text-muted-foreground">Before / After</p></div>
              </div>
            ))}
          </div>
        )}
        {tab === "reviews" && (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.name} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>{initials(r.name)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <StarRating rating={r.rating} />
                    <Badge label={r.job} color="gray" />
                    <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "availability" && (
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-bold mb-4">Weekly Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {avail.map(({ day, hours }) => (
                <div key={day} className={`rounded-xl p-3 text-center ${hours ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-100 dark:bg-gray-800"}`}>
                  <p className="text-xs font-bold mb-1">{day}</p>
                  {hours ? <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{hours}</p> : <p className="text-xs text-red-500">Unavailable</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page 9: Booking Flow ──────────────────────────────────────────────────────
function BookingFlow({ navigate, dark, toggleDark }: NavProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedTime, setSelectedTime] = useState("Morning");
  const steps = ["Job Details", "Schedule", "Confirm", "Done"];
  return (
    <div className="min-h-screen bg-background">
      <CustomerNav navigate={navigate} dark={dark} toggleDark={toggleDark} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "text-white" : "bg-muted text-muted-foreground"}`}
                    style={i + 1 === step ? { background: A } : {}}>
                    {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${i + 1 === step ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}>{s}</p>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${i + 1 < step ? "bg-emerald-400" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        )}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Job Details</h2>
              <InputField label="Job Title" placeholder="e.g. Ceiling Light Installation" />
              <div>
                <label className="block text-sm font-medium mb-1.5">Job Description</label>
                <textarea rows={3} placeholder="Describe the problem in detail..." className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Upload Photos (optional)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                </div>
              </div>
              <InputField label="Address" placeholder="123 Sampaguita St., Brgy. Fairview, Quezon City" />
              <button onClick={() => setStep(2)} className="w-full py-3 rounded-lg text-white font-semibold" style={{ background: A }}>Next →</button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Choose a Schedule</h2>
              <div>
                <p className="text-sm font-semibold mb-3">July 2025</p>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="font-semibold text-muted-foreground py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  <div />{/* July 1 starts Tuesday */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === selectedDate;
                    const isPast = day < 15;
                    return (
                      <button key={day} disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                        className={`h-9 rounded-lg font-medium transition-all ${isSelected ? "text-white" : isPast ? "text-muted-foreground/40" : "hover:bg-muted"}`}
                        style={isSelected ? { background: A } : {}}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Time Slot</p>
                <div className="grid grid-cols-3 gap-3">
                  {["Morning", "Afternoon", "Evening"].map((t) => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${selectedTime === t ? "text-white border-transparent" : "border-border hover:border-blue-400"}`}
                      style={selectedTime === t ? { background: A, borderColor: A } : {}}>
                      <div className="text-lg mb-0.5">{t === "Morning" ? "🌅" : t === "Afternoon" ? "☀️" : "🌙"}</div>
                      {t}
                      <div className="text-xs opacity-70 mt-0.5">{t === "Morning" ? "8AM–12PM" : t === "Afternoon" ? "1PM–5PM" : "6PM–9PM"}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg border border-border font-semibold hover:bg-muted transition-colors">← Back</button>
                <button onClick={() => setStep(3)} className="flex-2 flex-1 py-3 rounded-lg text-white font-semibold" style={{ background: A }}>Next →</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Confirm Booking</h2>
              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-5 space-y-3">
                {[
                  ["Worker", "Juan dela Cruz — Electrician"],
                  ["Job", "Ceiling Light Installation"],
                  ["Date", `Friday, July ${selectedDate}, 2025 — ${selectedTime} (${selectedTime === "Morning" ? "8AM–12PM" : selectedTime === "Afternoon" ? "1PM–5PM" : "6PM–9PM"})`],
                  ["Address", "123 Sampaguita St., Barangay Fairview, Quezon City"],
                  ["Estimated Cost", "₱1,500 – ₱3,000"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 text-sm">
                    <span className="text-muted-foreground w-24 shrink-0">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg border border-border font-semibold hover:bg-muted transition-colors">← Back</button>
                <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-lg text-white font-semibold" style={{ background: A }}>Confirm Booking</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: A }}>
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Booking Sent!</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">Juan dela Cruz will review your request and confirm shortly. You'll be notified once accepted.</p>
              <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg inline-block">#BW-20250718-0042</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate("my-jobs")} className="px-5 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">View Booking Status</button>
                <button onClick={() => navigate("bluebot-onboard")} className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background: A }}>Go to Home</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page 10: BlueBot Chat ─────────────────────────────────────────────────────
function BlueBotChat({ navigate, dark, toggleDark }: NavProps) {
  const [msg, setMsg] = useState("");
  const history = [
    { label: "Leaking sink repair", ago: "2 days ago" },
    { label: "Electrician for rewiring", ago: "1 week ago" },
    { label: "Aircon cleaning", ago: "2 weeks ago" },
  ];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerNav navigate={navigate} dark={dark} toggleDark={toggleDark} activePage="bluebot-chat" />
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {/* Sidebar */}
        <div className="w-64 shrink-0 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: A }}>
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {history.map((h, i) => (
              <button key={i} className={`w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted transition-colors ${i === 0 ? "bg-muted" : ""}`}>
                <p className="text-sm font-medium truncate">{h.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{h.ago}</p>
              </button>
            ))}
          </div>
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: A }}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">BlueBot</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> AI Assistant · Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Messages */}
            <BotMsg text="Hi Ana! 👋 What service do you need today? Describe your problem and I'll find the right worker for you." />
            <UserMsg text="My sink is leaking under the kitchen cabinet." />
            <BotMsg text="Got it! Sounds like a pipe or drain leak — you need a plumber. Let me find the best ones near you 🔧" />
            {/* Inline worker cards */}
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}><Bot className="w-5 h-5 text-white" /></div>
              <div className="flex gap-2 flex-wrap">
                {[{name:"Maria Santos",rating:4.7,dist:"1.2km"},{name:"Dennis Ramos",rating:4.5,dist:"2.4km"},{name:"Carlo Abad",rating:4.4,dist:"3.1km"}].map((w) => (
                  <div key={w.name} className="bg-card rounded-xl border border-border p-3 w-40">
                    <p className="text-xs font-bold">{w.name}</p>
                    <p className="text-xs text-muted-foreground">Plumber</p>
                    <div className="flex items-center gap-1 text-xs mt-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{w.rating} · {w.dist}</div>
                    <button onClick={() => navigate("booking")} className="w-full mt-2 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: A }}>Book</button>
                  </div>
                ))}
              </div>
            </div>
            <BotMsg text="Would you like me to check availability and book one for you?" />
            <UserMsg text="Yes, book Maria Santos for tomorrow morning." />
            <BotMsg text="Maria Santos is available tomorrow morning! Taking you to confirm the booking now. 📅" extra={
              <button onClick={() => navigate("booking")} className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ background: A }}>
                Proceed to Booking <ArrowRight className="w-3 h-3" />
              </button>
            } />
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2 border border-border">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Ask BlueBot anything..."
                className="flex-1 bg-transparent text-sm focus:outline-none" />
              <button className="text-muted-foreground hover:text-foreground"><Mic className="w-4 h-4" /></button>
              <button className="text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-lg text-white" style={{ background: A }}><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BotMsg({ text, extra }: { text: string; extra?: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}><Bot className="w-5 h-5 text-white" /></div>
      <div className="max-w-md bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3">
        <p className="text-sm">{text}</p>{extra}
      </div>
    </div>
  );
}
function UserMsg({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-md rounded-2xl rounded-tr-none px-4 py-3 text-white text-sm" style={{ background: A }}>{text}</div>
    </div>
  );
}

// ── Page 11: Reviews ──────────────────────────────────────────────────────────
function ReviewsPage({ navigate, dark, toggleDark }: NavProps) {
  const [filterTab, setFilterTab] = useState("all");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const reviews = [
    { name: "Ana Reyes", rating: 5, date: "July 10", job: "Electrical Repair", comment: "Very professional. Arrived on time, cleaned up after. Will hire again!" },
    { name: "Carlo Mendoza", rating: 5, date: "June 28", job: "Rewiring", comment: "Fixed our short circuit quickly. Highly recommended!" },
    { name: "Jenny Cruz", rating: 4, date: "June 15", job: "Panel Inspection", comment: "Good work, arrived 30 mins late. Great overall though." },
    { name: "Mark Lim", rating: 5, date: "June 5", job: "Lighting Installation", comment: "Very affordable and honest. My go-to electrician." },
    { name: "Rose Dela Torre", rating: 5, date: "May 29", job: "Outlet Repair", comment: "Fast, efficient, and polite. Highly recommended!" },
  ];
  const metrics = [["Work Quality",4.9],["Professionalism",4.8],["Punctuality",4.7],["Communication",4.9]];
  return (
    <div className="min-h-screen bg-background">
      <CustomerNav navigate={navigate} dark={dark} toggleDark={toggleDark} />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Summary */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-6xl font-extrabold" style={{ color: P }}>4.9</p>
              <StarRating rating={5} size="lg" />
              <p className="text-sm text-muted-foreground mt-1">128 reviews</p>
            </div>
            <div className="flex-1 space-y-3 min-w-48">
              {metrics.map(([label, val]) => (
                <div key={label as string} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-32">{label as string}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(val as number / 5) * 100}%`, background: A }} />
                  </div>
                  <span className="text-sm font-semibold w-6">{val as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-border">
          {["all", "5 stars", "4 stars", "3 stars & below"].map((t) => (
            <button key={t} onClick={() => setFilterTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${filterTab === t ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
        {/* Review cards */}
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.name} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>{initials(r.name)}</div>
                <div className="flex-1">
                  <div className="flex justify-between flex-wrap gap-1">
                    <span className="font-semibold text-sm">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5"><StarRating rating={r.rating} /><Badge label={r.job} color="gray" /></div>
                  <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Leave review */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h3 className="font-bold text-lg">Leave a Review</h3>
          <div>
            <p className="text-sm font-medium mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((i) => (
                <button key={i} onMouseEnter={() => setHoveredStar(i)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setSelectedStar(i)}>
                  <Star className={`w-8 h-8 transition-colors ${i <= (hoveredStar || selectedStar) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>
          {metrics.map(([label]) => (
            <div key={label as string}>
              <div className="flex justify-between mb-1"><span className="text-sm font-medium">{label as string}</span><span className="text-sm text-muted-foreground">5/5</span></div>
              <input type="range" min="1" max="5" defaultValue="5" className="w-full accent-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1.5">Your Experience</label>
            <textarea rows={3} placeholder="Share your experience..." className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-muted-foreground" />
          </div>
          <button className="w-full py-3 rounded-lg text-white font-semibold" style={{ background: A }}>Submit Review</button>
        </div>
      </div>
    </div>
  );
}

// ── Page 12: Worker Dashboard ─────────────────────────────────────────────────
function WorkerDashboard({ navigate, dark, toggleDark }: NavProps) {
  const [botMsg, setBotMsg] = useState("");
  const jobs = [
    { customer: "Ana Reyes", title: "Ceiling fan installation", time: "Today 10:00 AM", address: "45 Rosal St. Fairview", status: "In Progress", color: "green" },
    { customer: "Carlo Mendoza", title: "Outlet rewiring", time: "Today 2:00 PM", address: "12 Dahlia Ave. Novaliches", status: "Accepted", color: "blue" },
    { customer: "Jenny Cruz", title: "Panel check", time: "Tomorrow 9:00 AM", address: "88 Iris St. Batasan", status: "Pending", color: "yellow" },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar navigate={navigate} activePage="worker-dashboard" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div>
            <h1 className="text-2xl font-bold">Good morning, Juan! 👋</h1>
            <p className="text-sm text-muted-foreground">Tuesday, July 15, 2025</p>
          </div>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Jobs Today", val: "2", icon: <Briefcase className="w-5 h-5" />, color: "#3B82F6" },
              { label: "Pending Requests", val: "3", icon: <Clock className="w-5 h-5" />, color: "#F59E0B" },
              { label: "This Month", val: "₱18,500", icon: <DollarSign className="w-5 h-5" />, color: "#10B981" },
              { label: "Average Rating", val: "⭐ 4.9", icon: <Star className="w-5 h-5" />, color: "#EC4899" },
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
            {/* Upcoming jobs */}
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
            {/* BlueBot panel */}
            <div className="bg-card rounded-2xl border border-border flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: A }}><Bot className="w-4 h-4 text-white" /></div>
                <p className="font-bold text-sm">Ask BlueBot</p>
              </div>
              <div className="flex-1 p-4 space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-muted rounded-xl px-3 py-2 text-xs">What jobs do I have tomorrow?</div>
                </div>
                <div className="flex justify-end">
                  <div className="rounded-xl px-3 py-2 text-xs text-white" style={{ background: A }}>What jobs do I have tomorrow?</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-muted rounded-xl px-3 py-2 text-xs">You have 1 job tomorrow — Panel check with Jenny Cruz at 9:00 AM in Batasan. Don't forget your tools! 🔧</div>
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

// ── Page 13: My Jobs ──────────────────────────────────────────────────────────
function MyJobs({ navigate, dark, toggleDark }: NavProps) {
  const [tab, setTab] = useState("All");
  const tabs = ["All","Pending","Accepted","In Progress","Completed","Cancelled"];
  const jobs = [
    { customer: "Ana Reyes",     title: "Ceiling fan install", date: "July 15, 10AM", addr: "Fairview",   status: "In Progress", actions: ["View"] },
    { customer: "Carlo Mendoza", title: "Outlet rewiring",    date: "July 15, 2PM",  addr: "Novaliches",  status: "Accepted",    actions: ["View"] },
    { customer: "Jenny Cruz",    title: "Panel check",        date: "July 16, 9AM",  addr: "Batasan",    status: "Pending",     actions: ["Accept","Reject"] },
    { customer: "Mark Lim",      title: "Lighting install",   date: "July 12",       addr: "Lagro",      status: "Completed",   actions: ["View"] },
    { customer: "Rose Dela Torre",title: "Outlet repair",     date: "July 10",       addr: "Fairview",   status: "Completed",   actions: ["View"] },
    { customer: "Bong Santos",   title: "Rewiring",           date: "July 8",        addr: "Novaliches",  status: "Cancelled",   actions: ["View"] },
  ];
  const statusColor: Record<string, string> = { "In Progress": "green", "Accepted": "blue", "Pending": "yellow", "Completed": "gray", "Cancelled": "red" };
  const filtered = tab === "All" ? jobs : jobs.filter((j) => j.status === tab);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar navigate={navigate} activePage="my-jobs" />
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
                  {["Customer","Job Title","Date & Time","Address","Status","Action"].map((h) => (
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
                          <button key={a} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${a === "Reject" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50" : "text-white"}`}
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

// ── Page 14: Schedule ─────────────────────────────────────────────────────────
function SchedulePage({ navigate, dark, toggleDark }: NavProps) {
  const booked = [15, 18, 22];
  const unavail = [16, 20];
  // July 2025 starts on Tuesday (index 1 in Mon-first week)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const getColor = (d: number) => {
    if (unavail.includes(d)) return "bg-gray-200 dark:bg-gray-700 text-muted-foreground";
    if (booked.includes(d)) return "text-white";
    if (d < 15) return "text-muted-foreground/50";
    return "hover:bg-muted";
  };
  const avail = [
    { day: "Mon", hours: "8AM–5PM", on: true },
    { day: "Tue", hours: "8AM–5PM", on: true },
    { day: "Wed", hours: "Unavailable", on: false },
    { day: "Thu", hours: "8AM–5PM", on: true },
    { day: "Fri", hours: "8AM–5PM", on: true },
    { day: "Sat", hours: "9AM–12PM", on: true },
    { day: "Sun", hours: "Unavailable", on: false },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar navigate={navigate} activePage="schedule" />
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
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="font-semibold text-muted-foreground py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              <div />{/* July 1 = Tuesday */}
              {days.map((d) => (
                <div key={d} className={`h-10 rounded-lg flex items-center justify-center relative font-medium transition-colors ${getColor(d)}`}
                  style={booked.includes(d) ? { background: A } : {}}>
                  {d}
                  {booked.includes(d) && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-white/80 rounded-full text-[8px] leading-none flex items-center justify-center font-bold text-blue-700">2</span>}
                </div>
              ))}
            </div>
          </div>
          {/* Availability */}
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

// ── Page 15: Messages ─────────────────────────────────────────────────────────
function MessagesPage({ navigate, dark, toggleDark }: NavProps) {
  const [active, setActive] = useState(0);
  const convos = [
    { name: "Ana Reyes",      preview: "On my way po!",       time: "10:02 AM", unread: true },
    { name: "Carlo Mendoza",  preview: "Salamat!",            time: "Yesterday" },
    { name: "Jenny Cruz",     preview: "Pwede ba bukas?",     time: "Yesterday" },
    { name: "Mark Lim",       preview: "Kumusta yung parts?", time: "2 days ago" },
  ];
  const chat = [
    { from: "Ana",  text: "Kamusta po, nakalabas na po ba kayo?" },
    { from: "Juan", text: "Oo po, on my way na. 15 mins pa lang." },
    { from: "Ana",  text: "Sige po, bukas na po yung gate." },
    { from: "Juan", text: "Ok po! Salamat." },
    { from: "Ana",  text: "On my way po!" },
  ];
  const [msg, setMsg] = useState("");
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar navigate={navigate} activePage="messages" />
      <main className="flex-1 flex overflow-hidden">
        {/* Conversation list */}
        <div className="w-72 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Messages</h2>
            <DarkToggle dark={dark} toggleDark={toggleDark} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {convos.map((c, i) => (
              <button key={c.name} onClick={() => setActive(i)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-border transition-colors ${active === i ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted"}`}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>{initials(c.name)}</div>
                  {c.unread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>{initials(convos[active].name)}</div>
            <div>
              <p className="font-bold text-sm">{convos[active].name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.from === "Juan" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.from === "Juan" ? "text-white rounded-br-none" : "bg-card border border-border rounded-bl-none"}`}
                  style={m.from === "Juan" ? { background: A } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2 border border-border">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent text-sm focus:outline-none" />
              <button className="text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-lg text-white" style={{ background: A }}><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Page 16: Profile Editor ───────────────────────────────────────────────────
function ProfileEditor({ navigate, dark, toggleDark }: NavProps) {
  const [open, setOpen] = useState<string | null>("basic");
  const sections = [
    { id: "basic", label: "Basic Information" },
    { id: "skills", label: "Skills & Experience" },
    { id: "certs", label: "Certifications" },
    { id: "portfolio", label: "Portfolio" },
    { id: "pricing", label: "Service & Pricing" },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar navigate={navigate} activePage="profile-editor" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 max-w-2xl space-y-4">
          {/* Profile preview */}
          <div className="bg-card rounded-2xl border border-border p-5 flex gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0" style={{ background: A }}>JC</div>
            <div>
              <h2 className="font-bold text-lg">Juan dela Cruz</h2>
              <div className="flex gap-1 mt-1"><Badge label="Electrician" /><Badge label="8 yrs exp" color="gray" /></div>
              <p className="text-xs text-muted-foreground mt-1.5">⭐ 4.9 · 128 reviews · Brgy. Fairview, QC</p>
            </div>
          </div>
          {/* Accordion sections */}
          {sections.map(({ id, label }) => (
            <div key={id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setOpen(open === id ? null : id)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors">
                <span className="font-semibold">{label}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open === id ? "rotate-180" : ""}`} />
              </button>
              {open === id && (
                <div className="px-5 pb-5 border-t border-border space-y-3">
                  {id === "basic" && <>
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center"><User className="w-8 h-8 text-muted-foreground" /></div>
                      <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5"><Upload className="w-4 h-4" /> Upload Photo</button>
                    </div>
                    <InputField label="Full Name" placeholder="Juan dela Cruz" />
                    <div><label className="block text-sm font-medium mb-1.5">Bio</label><textarea rows={2} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-muted-foreground" defaultValue="Licensed electrician with 8 years of experience..." /></div>
                    <InputField label="Contact Number" placeholder="+63 917 123 4567" />
                    <InputField label="Address" placeholder="45 Rosal St." />
                    <SelectField label="Barangay" options={BARANGAYS} />
                  </>}
                  {id === "skills" && <>
                    <SelectField label="Primary Skill" options={SKILLS_LIST} />
                    <div><label className="block text-sm font-medium mb-1.5">Additional Skills</label>
                      <div className="flex flex-wrap gap-2">{["Rewiring","Panel Upgrade","Lighting","Aircon Wiring"].map((s) => <span key={s} className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer" style={{ background: `${A}20`, color: A }}>{s} ×</span>)}</div>
                    </div>
                    <InputField label="Years of Experience" placeholder="8" />
                  </>}
                  {id === "certs" && <>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                      <Upload className="w-7 h-7 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Drag & drop TESDA certificates here</p>
                    </div>
                    {["TESDA NC II — Electrical Installation","TESDA NC III — Electrical Installation"].map((c) => (
                      <div key={c} className="flex items-center justify-between p-3 rounded-lg bg-muted text-sm"><span>{c}</span><button className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button></div>
                    ))}
                  </>}
                  {id === "portfolio" && <>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                      <Upload className="w-7 h-7 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload before/after photos with captions</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">{Array.from({length:3}).map((_,i) => <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center"><FileText className="w-6 h-6 text-muted-foreground" /></div>)}</div>
                  </>}
                  {id === "pricing" && <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Area</label>
                      <div className="grid grid-cols-2 gap-2">{BARANGAYS.slice(0,6).map((b) => <label key={b} className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" defaultChecked={b.includes("Fairview") || b.includes("Nov")} />{b}</label>)}</div>
                    </div>
                    <InputField label="Inspection Fee (₱)" placeholder="300" />
                    <InputField label="Hourly Rate (₱/hr)" placeholder="500" />
                    <InputField label="Fixed Rate (₱)" placeholder="800" />
                  </>}
                  <button className="mt-2 px-5 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: A }}>Save Changes</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ── Page 17: Earnings ─────────────────────────────────────────────────────────
function EarningsPage({ navigate, dark, toggleDark }: NavProps) {
  const txns = [
    { date: "July 15",  customer: "Ana Reyes",      job: "Ceiling fan install", amount: "₱1,200", status: "Paid" },
    { date: "July 12",  customer: "Mark Lim",        job: "Lighting install",    amount: "₱2,500", status: "Paid" },
    { date: "July 10",  customer: "Rose Dela Torre", job: "Outlet repair",       amount: "₱800",   status: "Paid" },
    { date: "July 8",   customer: "Bong Santos",     job: "Rewiring",            amount: "₱4,500", status: "Cancelled" },
    { date: "July 5",   customer: "Jenny Cruz",      job: "Panel check",         amount: "₱1,500", status: "Paid" },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar navigate={navigate} activePage="earnings" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">Earnings</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[["This Month","₱18,500","text-emerald-600 dark:text-emerald-400"],["Last Month","₱21,200","text-blue-600 dark:text-blue-400"],["Total Earned","₱184,750","text-purple-600 dark:text-purple-400"]].map(([l,v,c]) => (
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
                <YAxis tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
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
                  {["Date","Customer","Job","Amount","Status"].map((h) => (
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

// ── Page 18: Admin Dashboard ──────────────────────────────────────────────────
function AdminDashboard({ navigate, dark, toggleDark }: NavProps) {
  const verifications = [
    { name: "Pedro Gomez",    date: "July 14", idType: "PhilSys",  cert: "TESDA NC II" },
    { name: "Lito Fernandez", date: "July 13", idType: "Driver's", cert: "TESDA NC III" },
    { name: "Nena Villalba",  date: "July 12", idType: "Passport", cert: "TESDA NC II" },
    { name: "Ricky Dizon",    date: "July 11", idType: "UMID",     cert: "NC I" },
  ];
  const reports = [
    { id: "#R-001", type: "Fake Profile",       by: "Customer", against: "Rico Delos Santos", date: "July 14", status: "Open",         color: "red" },
    { id: "#R-002", type: "Customer Complaint", by: "Customer", against: "Lito Perez",        date: "July 13", status: "Under Review", color: "yellow" },
    { id: "#R-003", type: "Fraud Report",       by: "Customer", against: "Alma Cruz",         date: "July 10", status: "Resolved",     color: "green" },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar navigate={navigate} activePage="Overview" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Total Users",            val: "4,821",    icon: <Users className="w-5 h-5" />,     color: "#3B82F6" },
              { label: "Total Workers",           val: "1,203",    icon: <Wrench className="w-5 h-5" />,    color: "#8B5CF6" },
              { label: "Jobs Completed",          val: "9,540",    icon: <CheckCircle className="w-5 h-5" />,color: "#10B981" },
              { label: "Pending Verifications",   val: "37",       icon: <Shield className="w-5 h-5" />,    color: "#F59E0B" },
              { label: "Active Reports",          val: "12",       icon: <AlertTriangle className="w-5 h-5" />, color: "#EF4444" },
              { label: "Platform Revenue",        val: "₱245,000", icon: <TrendingUp className="w-5 h-5" />, color: "#0EA5E9" },
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
          {/* Charts */}
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
          {/* Verification table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold">Pending Verifications <Badge label="37" color="yellow" /></h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Worker Name","Date Submitted","ID Type","Skill Cert","Actions"].map((h) => (
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
          {/* Reports table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-bold">Active Reports <Badge label="12" color="red" /></h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Report ID","Type","Filed By","Against","Date","Status","Action"].map((h) => (
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

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [dark, setDark] = useState(false);
  const navigate = (p: Page) => { setPage(p); window.scrollTo(0, 0); };
  const toggleDark = () => setDark((d) => !d);
  const props: NavProps = { navigate, dark, toggleDark };

  const pageMap: Record<Page, React.ReactNode> = {
    "landing":          <LandingPage {...props} />,
    "customer-login":   <CustomerLogin {...props} />,
    "customer-register":<CustomerRegister {...props} />,
    "worker-login":     <WorkerLogin {...props} />,
    "worker-register":  <WorkerRegister {...props} />,
    "bluebot-onboard":  <BlueBotOnboard {...props} />,
    "worker-discovery": <WorkerDiscovery {...props} />,
    "worker-profile":   <WorkerProfile {...props} />,
    "booking":          <BookingFlow {...props} />,
    "bluebot-chat":     <BlueBotChat {...props} />,
    "reviews":          <ReviewsPage {...props} />,
    "worker-dashboard": <WorkerDashboard {...props} />,
    "my-jobs":          <MyJobs {...props} />,
    "schedule":         <SchedulePage {...props} />,
    "messages":         <MessagesPage {...props} />,
    "profile-editor":   <ProfileEditor {...props} />,
    "earnings":         <EarningsPage {...props} />,
    "admin-dashboard":  <AdminDashboard {...props} />,
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {pageMap[page]}
      </div>
    </div>
  );
}
