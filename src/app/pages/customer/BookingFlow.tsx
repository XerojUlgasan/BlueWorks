import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Check, CalendarDays, Clock, MapPin, User, Briefcase, CircleDollarSign } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { InputField } from "../../components/shared";
import { A } from "../../constants";

const STEPS = ["Job Details", "Schedule", "Confirm", "Done"];

const TIME_SLOTS = [
  { label: "Morning",   emoji: "🌅", hours: "8AM – 12PM" },
  { label: "Afternoon", emoji: "☀️", hours: "1PM – 5PM"  },
  { label: "Evening",   emoji: "🌙", hours: "6PM – 9PM"  },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8 overflow-x-auto pb-1">
      {STEPS.slice(0, -1).map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "text-white shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
                style={isActive ? { background: A, boxShadow: `0 0 0 4px ${A}25` } : {}}
              >
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <p
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                }`}
              >
                {label}
              </p>
            </div>
            {i < STEPS.length - 2 && (
              <div
                className={`flex-1 h-0.5 mx-3 mt-[-18px] transition-colors ${
                  isDone ? "bg-emerald-400" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingFlow({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedTime, setSelectedTime] = useState("Morning");

  const selectedSlot = TIME_SLOTS.find((t) => t.label === selectedTime)!;
  const today = 15; // simulate "today" for demo

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {step < 4 && <StepIndicator current={step} />}

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">

          {/* Step 1 — Job Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-2">
                <h2 className="text-xl font-bold">Job Details</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Describe what you need done</p>
              </div>
              <InputField label="Job Title" placeholder="e.g. Ceiling Light Installation" />
              <div>
                <label className="block text-sm font-medium mb-1.5">Job Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the problem in detail..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-muted-foreground transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Upload Photos <span className="text-muted-foreground font-normal">(optional)</span></label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2 group-hover:text-blue-400 transition-colors" />
                  <p className="text-sm text-muted-foreground">Drag & drop or <span className="text-blue-500 font-medium">click to upload</span></p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <InputField label="Address" placeholder="123 Sampaguita St., Brgy. Fairview, Quezon City" />
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity active:scale-[0.99]"
                style={{ background: A }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Choose a Schedule</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Pick a date and preferred time</p>
              </div>

              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold">July 2025</p>
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div key={d} className="font-semibold text-muted-foreground py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  <div /> {/* July 1 starts on Tuesday */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === selectedDate;
                    const isPast = day < today;
                    return (
                      <button
                        key={day}
                        disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                        className={`h-9 w-full rounded-lg font-medium transition-all ${
                          isSelected
                            ? "text-white shadow-sm"
                            : isPast
                            ? "text-muted-foreground/30 cursor-not-allowed"
                            : "hover:bg-muted"
                        }`}
                        style={isSelected ? { background: A } : {}}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <p className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" /> Time Slot
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isActive = selectedTime === slot.label;
                    return (
                      <button
                        key={slot.label}
                        onClick={() => setSelectedTime(slot.label)}
                        className={`py-4 rounded-xl text-sm font-medium border-2 transition-all hover:shadow-sm ${
                          isActive
                            ? "text-white border-transparent shadow-md"
                            : "border-border hover:border-blue-300 dark:hover:border-blue-600"
                        }`}
                        style={isActive ? { background: A, borderColor: A } : {}}
                      >
                        <div className="text-2xl mb-1">{slot.emoji}</div>
                        <div className="font-semibold">{slot.label}</div>
                        <div className={`text-xs mt-0.5 ${isActive ? "opacity-80" : "text-muted-foreground"}`}>
                          {slot.hours}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors text-sm"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                  style={{ background: A }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Confirm Booking</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Review your booking before submitting</p>
              </div>

              <div className="rounded-xl border border-blue-100 dark:border-blue-800 overflow-hidden">
                <div className="px-5 py-3 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30">
                  Booking Summary
                </div>
                <div className="divide-y divide-border">
                  {[
                    { icon: <User className="w-4 h-4" />,              key: "Worker",         val: "Juan dela Cruz — Electrician" },
                    { icon: <Briefcase className="w-4 h-4" />,         key: "Job",            val: "Ceiling Light Installation" },
                    { icon: <CalendarDays className="w-4 h-4" />,      key: "Date",           val: `Friday, July ${selectedDate}, 2025` },
                    { icon: <Clock className="w-4 h-4" />,             key: "Time",           val: `${selectedSlot.label} · ${selectedSlot.hours}` },
                    { icon: <MapPin className="w-4 h-4" />,            key: "Address",        val: "123 Sampaguita St., Barangay Fairview, QC" },
                    { icon: <CircleDollarSign className="w-4 h-4" />,  key: "Est. Cost",      val: "₱1,500 – ₱3,000" },
                  ].map(({ icon, key, val }) => (
                    <div key={key} className="flex items-start gap-3 px-5 py-3 bg-card">
                      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
                      <span className="text-sm text-muted-foreground w-24 shrink-0">{key}</span>
                      <span className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By confirming, you agree to BlueWorks' service terms. No payment until the job is done.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors text-sm"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                  style={{ background: A }}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <div className="text-center py-8 space-y-4">
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, #10B981, #059669)` }}
              >
                <Check className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Booking Sent!</h2>
                <p className="text-muted-foreground mt-1 text-sm max-w-xs mx-auto">
                  Juan dela Cruz will review your request and confirm shortly.
                </p>
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-semibold"
                style={{ background: `${A}12`, color: A }}
              >
                #BW-20250718-0042
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1.5 text-left max-w-xs mx-auto">
                <p className="text-muted-foreground">📅 <span className="text-foreground font-medium">July {selectedDate}, 2025</span></p>
                <p className="text-muted-foreground">⏰ <span className="text-foreground font-medium">{selectedSlot.label} · {selectedSlot.hours}</span></p>
                <p className="text-muted-foreground">🔧 <span className="text-foreground font-medium">Juan dela Cruz</span></p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => navigate("/app/bookings")}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Track Booking
                </button>
                <button
                  onClick={() => navigate("/app/bookings")}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: A }}
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
