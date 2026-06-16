import { useState } from "react";
import { User, Upload, X, ChevronDown } from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { Badge, DarkToggle, InputField, SelectField } from "../../components/shared";
import { A, BARANGAYS, SKILLS_LIST } from "../../constants";

export default function ProfileEditor({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [open, setOpen] = useState<string | null>("basic");
  const sections = [
    { id: "basic",     label: "Basic Information"  },
    { id: "skills",    label: "Skills & Experience"},
    { id: "certs",     label: "Certifications"     },
    { id: "portfolio", label: "Portfolio"          },
    { id: "pricing",   label: "Service & Pricing"  },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>
        <div className="p-6 max-w-2xl space-y-4">
          <div className="bg-card rounded-2xl border border-border p-5 flex gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0" style={{ background: A }}>JC</div>
            <div>
              <h2 className="font-bold text-lg">Juan dela Cruz</h2>
              <div className="flex gap-1 mt-1"><Badge label="Electrician" /><Badge label="8 yrs exp" color="gray" /></div>
              <p className="text-xs text-muted-foreground mt-1.5">⭐ 4.9 · 128 reviews · Brgy. Fairview, QC</p>
            </div>
          </div>
          {sections.map(({ id, label }) => (
            <div key={id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setOpen(open === id ? null : id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors">
                <span className="font-semibold">{label}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open === id ? "rotate-180" : ""}`} />
              </button>
              {open === id && (
                <div className="px-5 pb-5 border-t border-border space-y-3">
                  {id === "basic" && <>
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center"><User className="w-8 h-8 text-muted-foreground" /></div>
                      <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted flex items-center gap-1.5"><Upload className="w-4 h-4" /> Upload Photo</button>
                    </div>
                    <InputField label="Full Name" placeholder="Juan dela Cruz" />
                    <div><label className="block text-sm font-medium mb-1.5">Bio</label><textarea rows={2} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" defaultValue="Licensed electrician with 8 years of experience..." /></div>
                    <InputField label="Contact Number" placeholder="+63 917 123 4567" />
                    <InputField label="Address" placeholder="45 Rosal St." />
                    <SelectField label="Barangay" options={BARANGAYS} />
                  </>}
                  {id === "skills" && <>
                    <SelectField label="Primary Skill" options={SKILLS_LIST} />
                    <div><label className="block text-sm font-medium mb-1.5">Additional Skills</label>
                      <div className="flex flex-wrap gap-2">{["Rewiring", "Panel Upgrade", "Lighting", "Aircon Wiring"].map((s) => <span key={s} className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer" style={{ background: `${A}20`, color: A }}>{s} ×</span>)}</div>
                    </div>
                    <InputField label="Years of Experience" placeholder="8" />
                  </>}
                  {id === "certs" && <>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                      <Upload className="w-7 h-7 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Drag & drop TESDA certificates here</p>
                    </div>
                    {["TESDA NC II — Electrical Installation", "TESDA NC III — Electrical Installation"].map((c) => (
                      <div key={c} className="flex items-center justify-between p-3 rounded-lg bg-muted text-sm">
                        <span>{c}</span><button className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </>}
                  {id === "portfolio" && <>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                      <Upload className="w-7 h-7 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload before/after photos with captions</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-square rounded-lg bg-muted" />)}</div>
                  </>}
                  {id === "pricing" && <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Area</label>
                      <div className="grid grid-cols-2 gap-2">{BARANGAYS.slice(0, 6).map((b) => <label key={b} className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" defaultChecked={b.includes("Fairview") || b.includes("Nov")} />{b}</label>)}</div>
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
