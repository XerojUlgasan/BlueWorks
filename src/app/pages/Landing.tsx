import { useNavigate } from "react-router";
import { Sparkles, Shield, Calendar, Star, CheckCircle, MapPin, Zap, Clock3, BadgeCheck, MessageSquare, Lightbulb } from "lucide-react";
import { Logo, DarkToggle } from "../components/shared";
import { A, P, WORKERS } from "../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Landing({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const skills = [
    { label: "Electrician", icon: "⚡" },
    { label: "Plumber", icon: "🔧" },
    { label: "Carpenter", icon: "🪚" },
    { label: "Painter", icon: "🖌️" },
    { label: "Aircon Tech", icon: "❄️" },
    { label: "Mason", icon: "🧱" },
  ];
  const features = [
    { icon: <Sparkles className="w-5 h-5" />, title: "AI-powered matching", desc: "BlueBot narrows the best worker for your exact issue in seconds." },
    { icon: <Shield className="w-5 h-5" />, title: "Verified professionals", desc: "Identity, skills, and service history are visible before you book." },
    { icon: <Calendar className="w-5 h-5" />, title: "Book in minutes", desc: "Pick a slot, confirm details, and keep everything organized in one place." },
  ];

  const stats = [
    { value: "1,200+", label: "skilled workers onboarded" },
    { value: "4.9/5", label: "average customer rating" },
    { value: "24/7", label: "support through BlueBot" },
  ];

  const highlights = [
    { icon: <BadgeCheck className="h-4 w-4" />, text: "Verified workers" },
    { icon: <Clock3 className="h-4 w-4" />, text: "Quick booking" },
    { icon: <Zap className="h-4 w-4" />, text: "Fast matching" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div
          className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${A}26 0%, transparent 70%)` }}
        />
        <div
          className="absolute top-40 right-[-5rem] h-80 w-80 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${P}20 0%, transparent 72%)` }}
        />
        <div
          className="absolute bottom-12 left-[-5rem] h-72 w-72 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${A}18 0%, transparent 72%)` }}
        />
      </div>

      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4 lg:px-8">
          <Logo size="lg" />
          <div className="ml-auto flex items-center gap-3">
            <DarkToggle dark={dark} toggleDark={toggleDark} />
            <button
              className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: `linear-gradient(135deg, ${A} 0%, ${P} 100%)` }}
              onClick={() => navigate("/customer/login")}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur"
            style={{ color: A }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Trusted home services, reimagined
          </div>

          <h1 className="mt-6 max-w-xl text-5xl font-black leading-[0.92] tracking-tight md:text-6xl xl:text-7xl" style={{ fontFamily: "Poppins, sans-serif" }}>
            Find trusted workers
            <span className="block" style={{ color: A }}>
              near you.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-lg">
            Your home, handled with care. BlueWorks links you to verified experts for every repair and renovation. Fast, reliable, and stress‑free.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.text} className="group flex items-center gap-2.5 rounded-full border border-border/60 bg-gradient-to-br from-card/85 to-card/70 px-4 py-3 text-sm font-medium transition-all duration-200 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10">
                <span className="transition-transform duration-200 group-hover:scale-110" style={{ color: A }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="group flex items-center gap-2.5 rounded-full border border-border/60 bg-gradient-to-br from-card/85 to-card/70 px-4 py-3 shadow-sm transition-all duration-200 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10">
              <MapPin className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" style={{ color: A }} />
              <span className="text-sm font-medium">Serving nearby</span>
            </div>
            <div className="group flex items-center gap-2.5 rounded-full border border-border/60 bg-gradient-to-br from-card/85 to-card/70 px-4 py-3 shadow-sm transition-all duration-200 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10">
              <CheckCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" style={{ color: P }} />
              <span className="text-sm font-medium">Verified workers</span>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-border/70 bg-card/82 p-5 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-0.5">
                <p className="text-2xl font-black tracking-tight" style={{ color: A }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 pt-8 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">How it works</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Three simple steps to find your perfect match</h3>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {[
            { 
              icon: <MessageSquare className="w-6 h-6" />, 
              title: "Tell us what you need", 
              desc: "Describe the problem in plain language.",
              color: A
            },
            { 
              icon: <Lightbulb className="w-6 h-6" />, 
              title: "Get matched instantly", 
              desc: "BlueBot surfaces nearby workers with the right skill.",
              color: A
            },
            { 
              icon: <CheckCircle className="w-6 h-6" />, 
              title: "Book with confidence", 
              desc: "Compare ratings, availability, and verify before confirming.",
              color: P
            },
          ].map((step, index) => (
            <div key={step.title} className="group relative">
              {/* Connector line for desktop */}
              {index < 2 && (
                <div className="absolute left-full top-12 hidden w-6 md:block">
                  <div className="h-0.5 bg-gradient-to-r from-blue-400 to-transparent" />
                </div>
              )}
              
              <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-card/90 to-card/70 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-400/50 md:p-7">
                {/* Gradient background on hover */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{
                  background: `linear-gradient(135deg, ${A}08 0%, ${P}08 100%)`
                }} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1" style={{
                    background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`
                  }}>
                    {step.icon}
                  </div>
                  
                  <h4 className="mt-5 text-lg font-bold tracking-tight">{step.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.desc}</p>
                  
                  {/* Step number in corner */}
                  <div className="absolute right-6 top-6 text-3xl font-black opacity-20 transition-opacity duration-300 group-hover:opacity-40" style={{ color: step.color }}>
                    {index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="mb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Why people choose BlueWorks</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Designed to feel fast and reassuring</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-[1.75rem] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${A} 0%, ${P} 100%)` }}>
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Social proof</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Top rated workers near you</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {WORKERS.slice(0, 4).map((w) => (
            <div
              key={w.id}
              className="cursor-pointer rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              onClick={() => navigate("/app/worker/1")}
            >
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl text-lg font-black text-white shadow-lg" style={{ background: w.color }}>
                  {initials(w.name)}
                </div>
              </div>
              <p className="mt-4 text-center text-sm font-semibold">{w.name}</p>
              <p className="text-center text-xs text-muted-foreground">{w.skill}</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {w.rating}
                <span className="ml-1 text-xs font-normal text-muted-foreground">· {w.dist}</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-4 lg:px-8 lg:pb-14">
        <div className="rounded-[2rem] border border-border/70 bg-card/72 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-bold md:text-xl">Most requested skills</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tap a skill to see the kinds of services people book most often.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {skills.map((s) => (
              <button
                key={s.label}
                className="group flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400/50 hover:shadow-md"
              >
                <span className="transition-transform duration-200 group-hover:scale-110">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>



      <footer className="border-t border-border/70 bg-card/70 px-6 py-10 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
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
