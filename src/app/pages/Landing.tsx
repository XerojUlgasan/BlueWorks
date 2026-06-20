import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Shield, Calendar, ArrowRight, Star, CheckCircle, Bell, MapPin } from "lucide-react";
import { Logo, DarkToggle, Badge, StarRating } from "../components/shared";
import { A, P, WORKERS } from "../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Landing({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
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
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border px-6 py-3 flex items-center">
        <Logo size="lg" />
        <div className="flex items-center gap-3 ml-auto">
          <DarkToggle dark={dark} toggleDark={toggleDark} />
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">Log In</button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ background: A }}
            onClick={() => navigate("/customer/login")}>Get Started</button>
        </div>
      </nav>

      <section className="px-6 py-20 text-center" style={{ background: `linear-gradient(160deg, ${P}08 0%, ${A}10 100%)` }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: A }}>The Philippines #1 Blue-Collar Platform</p>
        <h1 className="text-5xl font-extrabold leading-tight mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
          Find Trusted Workers<br /><span style={{ color: A }}>Near You</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
          BlueWorks connects you with verified electricians, plumbers, carpenters and more — right in your barangay.
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 w-72 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: `${A}15` }}>👤</div>
            <h3 className="text-xl font-bold mb-1">I'm a Customer</h3>
            <p className="text-sm text-muted-foreground mb-6">I need to hire a skilled worker</p>
            <button onClick={() => navigate("/customer/login")}
              className="w-full py-2.5 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: A }}>
              Find a Worker <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 w-72 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: `${P}15` }}>🔧</div>
            <h3 className="text-xl font-bold mb-1">I'm a Worker</h3>
            <p className="text-sm text-muted-foreground mb-6">I want to offer my skills</p>
            <button onClick={() => navigate("/worker/login")}
              className="w-full py-2.5 rounded-lg font-semibold border-2 transition-colors hover:text-white flex items-center justify-center gap-2"
              style={{ borderColor: P, color: P }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = P; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = P; }}>
              Offer My Skills <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

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

      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Top Rated Workers Near You</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {WORKERS.slice(0, 4).map((w) => (
            <div key={w.id} className="bg-card rounded-2xl border border-border p-5 min-w-[200px] hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate("/app/worker/1")}>
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
