import { useState, useRef } from "react";
import {
  User, Upload, X, Star, Plus, Camera, Check,
  Briefcase, Wrench, DollarSign, MapPin, Award, Image as ImageIcon,
} from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle } from "../../components/shared";
import { A, P, BARANGAYS, SECONDARY_SKILLS, JOB_CATEGORIES } from "../../constants";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { supabase } from "../../../lib/supabase";

const TABS = [
  { id: "overview",  label: "Overview",   icon: <User className="w-4 h-4" /> },
  { id: "skills",    label: "Skills",     icon: <Wrench className="w-4 h-4" /> },
  { id: "portfolio", label: "Portfolio",  icon: <ImageIcon className="w-4 h-4" /> },
  { id: "certs",     label: "Certs",      icon: <Award className="w-4 h-4" /> },
  { id: "pricing",   label: "Pricing",    icon: <DollarSign className="w-4 h-4" /> },
  { id: "location",  label: "Location",   icon: <MapPin className="w-4 h-4" /> },
];

interface PortfolioItem { url: string; caption: string; }

const MOCK_CERTS = [
  "TESDA NC II — Electrical Installation",
  "TESDA NC III — Electrical Installation",
];

export default function ProfileEditor({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const { user } = useCurrentUser();
  const [tab, setTab] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Overview
  const [fullName, setFullName]   = useState(user?.fullname || "");
  const [phone, setPhone]         = useState("");
  const [address, setAddress]     = useState("");
  const [bio, setBio]             = useState("Licensed electrician with 8 years of experience in residential and commercial work.");

  // Skills
  const [jobCategory, setJobCategory]       = useState("electrician");
  const [primarySkill, setPrimarySkill]     = useState("Rewiring");
  const [secondarySkills, setSecondarySkills] = useState<string[]>(["Panel Upgrade", "Lighting Install"]);
  const [experienceYears, setExperienceYears] = useState("8");

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { url: "", caption: "Panel upgrade — Fairview QC" },
    { url: "", caption: "New lighting installation"   },
    { url: "", caption: "Complete rewiring project"   },
  ]);

  // Certs
  const [certs, setCerts] = useState<string[]>(MOCK_CERTS);

  // Pricing
  const [hourlyRate, setHourlyRate]         = useState("500");
  const [minorPrice, setMinorPrice]         = useState("300");
  const [majorPrice, setMajorPrice]         = useState("800");
  const [emergencyPrice, setEmergencyPrice] = useState("1500");

  // Location
  const [barangay, setBarangay] = useState("Fairview");

  const availableSkills = SECONDARY_SKILLS[jobCategory] ?? [];
  const selectedCat = JOB_CATEGORIES.find(c => c.id === jobCategory);
  const userInitials = (user?.fullname || "JC").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  function toggleSecondary(skill: string) {
    setSecondarySkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : prev.length < 5 ? [...prev, skill] : prev
    );
  }

  async function handleSave() {
    setSaveError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setSaveError("Session expired."); return; }

      let patch: Record<string, unknown> = {};
      if (tab === "overview") patch = { full_name: fullName, phone, address, bio, barangay };
      else if (tab === "skills") patch = { job_category: jobCategory, job_type: primarySkill, skills: [primarySkill, ...secondarySkills], skill_set: secondarySkills, experience_years: parseInt(experienceYears) || 0 };
      else if (tab === "pricing") patch = { hourly_rate: parseFloat(hourlyRate) || 0, severity_pricing: { minor: parseFloat(minorPrice) || 0, major: parseFloat(majorPrice) || 0, emergency: parseFloat(emergencyPrice) || 0 } };
      else if (tab === "location") patch = { barangay };

      if (Object.keys(patch).length > 0) {
        const { error } = await supabase.from("workers").update(patch).eq("id", session.user.id);
        if (error) { setSaveError(error.message); return; }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setSaveError(e.message || "Something went wrong.");
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-muted-foreground">This is how customers will see you</p>
          </div>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Profile hero card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Cover strip */}
            <div className="h-20 w-full" style={{ background: `linear-gradient(135deg, ${P} 0%, ${A} 100%)` }} />
            <div className="px-6 pb-5">
              {/* Avatar overlapping cover */}
              <div className="flex items-end justify-between -mt-8 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border-4 border-card flex items-center justify-center text-white text-xl font-bold shadow-lg"
                    style={{ background: A }}>
                    {userInitials}
                  </div>
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted transition-colors shadow">
                    <Camera className="w-3 h-3" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                    <Star className="w-4 h-4 fill-amber-400" /> 4.9
                  </span>
                  <span className="text-sm text-muted-foreground">· 128 reviews</span>
                </div>
              </div>

              {/* Name and badges */}
              <div>
                <h2 className="text-xl font-bold">{user?.fullname || "Your Name"}</h2>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge label={selectedCat?.label || "Electrician"} />
                  <Badge label={`${experienceYears} yrs exp`} color="gray" />
                  <Badge label={`📍 ${barangay}`} color="gray" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{bio}</p>
              </div>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 border-b border-border overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px
                  ${tab === t.id ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            {/* OVERVIEW */}
            {tab === "overview" && <>
              <SectionTitle>Basic Information</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Juan dela Cruz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </Field>
                <Field label="Contact Number">
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+63 917 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </Field>
                <Field label="Email Address">
                  <input value={user?.email || ""} disabled placeholder="juan@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted text-sm opacity-60 cursor-not-allowed" />
                </Field>
                <Field label="Address">
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="45 Rosal St."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </Field>
              </div>
              <Field label="Bio">
                <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="Tell customers about your experience and expertise…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                <p className="text-xs text-muted-foreground mt-1">{bio.length}/300 characters</p>
              </Field>
            </>}

            {/* SKILLS */}
            {tab === "skills" && <>
              <SectionTitle>Job Category</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {JOB_CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => { setJobCategory(cat.id); setPrimarySkill(""); setSecondarySkills([]); }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${jobCategory === cat.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border hover:border-blue-300"}`}>
                    <span className="text-xl">{cat.icon}</span>
                    <p className="text-xs font-semibold mt-1.5">{cat.label}</p>
                  </button>
                ))}
              </div>

              <SectionTitle>Primary Skill</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(s => (
                  <button key={s} onClick={() => setPrimarySkill(s)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${primarySkill === s ? "text-white border-transparent" : "border-border hover:border-blue-300"}`}
                    style={primarySkill === s ? { background: A } : {}}>
                    {s}
                  </button>
                ))}
              </div>

              <SectionTitle>Secondary Skills <span className="font-normal text-muted-foreground text-xs">(up to 5)</span></SectionTitle>
              <div className="flex flex-wrap gap-2">
                {availableSkills.filter(s => s !== primarySkill).map(s => (
                  <button key={s} onClick={() => toggleSecondary(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${secondarySkills.includes(s) ? "text-white border-transparent" : "border-border text-muted-foreground hover:border-blue-300"}`}
                    style={secondarySkills.includes(s) ? { background: `${A}cc` } : {}}>
                    {s} {secondarySkills.includes(s) ? "×" : "+"}
                  </button>
                ))}
              </div>

              <Field label="Years of Experience">
                <input type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} placeholder="8"
                  className="w-32 px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </Field>
            </>}

            {/* PORTFOLIO */}
            {tab === "portfolio" && <>
              <div className="flex items-center justify-between">
                <SectionTitle>Portfolio Photos <span className="font-normal text-muted-foreground text-xs">({portfolio.length}/5)</span></SectionTitle>
                {portfolio.length < 5 && (
                  <button onClick={() => setPortfolio(p => [...p, { url: "", caption: "" }])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                    <Plus className="w-4 h-4" /> Add Photo
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-border overflow-hidden group">
                    <div className="aspect-video bg-muted flex items-center justify-center relative">
                      {item.url ? (
                        <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="w-10 h-10 opacity-30" />
                          <p className="text-xs">Click to upload</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-2 bg-white rounded-xl text-gray-800 hover:bg-gray-100 transition-colors">
                          <Upload className="w-4 h-4" />
                        </button>
                        <button onClick={() => setPortfolio(p => p.filter((_, idx) => idx !== i))}
                          className="p-2 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-card">
                      <input value={item.caption}
                        onChange={e => setPortfolio(p => p.map((it, idx) => idx === i ? { ...it, caption: e.target.value } : it))}
                        placeholder={`Caption for photo ${i + 1}…`}
                        className="w-full text-sm bg-transparent focus:outline-none text-muted-foreground placeholder:text-muted-foreground/50" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">These photos are shown on your public profile. Show before/after results for best impact.</p>
            </>}

            {/* CERTS */}
            {tab === "certs" && <>
              <SectionTitle>Certifications & Credentials</SectionTitle>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Drag & drop certificates here</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG — up to 10MB each</p>
              </div>
              <div className="space-y-2">
                {certs.map(c => (
                  <div key={c} className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 border border-border">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm flex-1">{c}</p>
                    <button onClick={() => setCerts(prev => prev.filter(x => x !== c))}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {certs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No certificates uploaded yet.</p>
              )}
            </>}

            {/* PRICING */}
            {tab === "pricing" && <>
              <SectionTitle>Your Rates</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Hourly Rate (₱/hr)">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₱</span>
                      <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="500"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </Field>
                </div>
              </div>

              <SectionTitle>Severity-Based Pricing</SectionTitle>
              <p className="text-sm text-muted-foreground -mt-2">Customers see these so they know what to expect based on job complexity.</p>
              <div className="space-y-3">
                {[
                  { label: "Minor Jobs",     sub: "Small repairs, quick fixes",        val: minorPrice,     set: setMinorPrice,     ph: "300",  color: "#10B981", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
                  { label: "Major Jobs",     sub: "Full installs, extensive work",      val: majorPrice,     set: setMajorPrice,     ph: "800",  color: "#F59E0B", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"       },
                  { label: "Emergency Jobs", sub: "Urgent, after-hours, same-day",      val: emergencyPrice, set: setEmergencyPrice, ph: "1500", color: "#EF4444", badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"              },
                ].map(({ label, sub, val, set, ph, color, badge }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="w-3 h-10 rounded-full shrink-0" style={{ background: color }} />
                    <div className="flex-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
                      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                    </div>
                    <div className="relative w-32 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₱</span>
                      <input type="number" value={val} onChange={e => set(e.target.value)} placeholder={ph}
                        className="w-full pl-6 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </div>
                ))}
              </div>
            </>}

            {/* LOCATION */}
            {tab === "location" && <>
              <SectionTitle>Service Area</SectionTitle>
              <Field label="Barangay">
                <select value={barangay} onChange={e => setBarangay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <p className="text-sm text-muted-foreground">To update your exact pin location, go to <strong>Settings → Location</strong> where you can use the interactive map.</p>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: A }} /> Current Service Area</p>
                <p className="text-sm text-muted-foreground mt-1">Barangay {barangay}, Quezon City</p>
              </div>
            </>}

            {/* Save */}
            {tab !== "portfolio" && tab !== "certs" && (
              <div className="pt-2 border-t border-border flex items-center justify-between">
                {saveError ? (
                  <p className="text-sm text-red-500">{saveError}</p>
                ) : <span />}
                <button onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all ${saved ? "bg-emerald-500" : ""}`}
                  style={!saved ? { background: P } : {}}>
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-base">{children}</h3>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-foreground">{label}</label>
      {children}
    </div>
  );
}
