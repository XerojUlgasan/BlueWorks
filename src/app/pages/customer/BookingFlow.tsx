import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Check } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { InputField } from "../../components/shared";
import { A } from "../../constants";

export default function BookingFlow({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedTime, setSelectedTime] = useState("Morning");
  const steps = ["Job Details", "Schedule", "Confirm", "Done"];
  return (
    <div className="min-h-screen bg-background">
      <CustomerNav dark={dark} toggleDark={toggleDark} />
      <div className="max-w-2xl mx-auto px-4 py-8">
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
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="font-semibold text-muted-foreground py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  <div />
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === selectedDate;
                    const isPast = day < 15;
                    return (
                      <button key={day} disabled={isPast} onClick={() => setSelectedDate(day)}
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
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg text-white font-semibold" style={{ background: A }}>Next →</button>
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
              <p className="text-muted-foreground max-w-sm mx-auto">Juan dela Cruz will review your request and confirm shortly.</p>
              <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg inline-block">#BW-20250718-0042</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate("/app/home")} className="px-5 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">View Booking Status</button>
                <button onClick={() => navigate("/app/home")} className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background: A }}>Go to Home</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
