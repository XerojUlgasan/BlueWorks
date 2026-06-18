import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus, CalendarDays, Clock, MapPin, ChevronRight,
  CheckCircle, XCircle, Loader2, Star, MessageSquare, RotateCcw,
} from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { A } from "../../constants";

type BookingStatus = "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";

interface Booking {
  id: string;
  worker: string;
  skill: string;
  workerColor: string;
  job: string;
  date: string;
  time: string;
  address: string;
  cost: string;
  status: BookingStatus;
  timeline: { label: string; desc: string; done: boolean; active?: boolean }[];
}

const BOOKINGS: Booking[] = [
  {
    id: "BW-20250718-0042",
    worker: "Juan dela Cruz",
    skill: "Electrician",
    workerColor: "#3B82F6",
    job: "Ceiling Light Installation",
    date: "July 18, 2025",
    time: "Morning · 8AM – 12PM",
    address: "123 Sampaguita St., Brgy. Fairview, QC",
    cost: "₱1,500 – ₱3,000",
    status: "In Progress",
    timeline: [
      { label: "Booking Sent",      desc: "Your request was submitted",          done: true  },
      { label: "Worker Confirmed",  desc: "Juan accepted your booking",           done: true  },
      { label: "Worker On The Way", desc: "Juan is heading to your location",     done: true, active: true },
      { label: "Job In Progress",   desc: "Work has started at your address",     done: false },
      { label: "Completed",         desc: "Job finished and payment released",    done: false },
    ],
  },
  {
    id: "BW-20250715-0038",
    worker: "Maria Santos",
    skill: "Plumber",
    workerColor: "#10B981",
    job: "Leaking Sink Repair",
    date: "July 15, 2025",
    time: "Afternoon · 1PM – 5PM",
    address: "123 Sampaguita St., Brgy. Fairview, QC",
    cost: "₱1,200",
    status: "Completed",
    timeline: [
      { label: "Booking Sent",      desc: "Your request was submitted",        done: true },
      { label: "Worker Confirmed",  desc: "Maria accepted your booking",        done: true },
      { label: "Worker On The Way", desc: "Maria headed to your location",      done: true },
      { label: "Job In Progress",   desc: "Work was completed at your address", done: true },
      { label: "Completed",         desc: "Job finished and payment released",  done: true },
    ],
  },
  {
    id: "BW-20250720-0051",
    worker: "Rico Reyes",
    skill: "Carpenter",
    workerColor: "#F59E0B",
    job: "Cabinet Installation",
    date: "July 20, 2025",
    time: "Morning · 8AM – 12PM",
    address: "123 Sampaguita St., Brgy. Fairview, QC",
    cost: "₱2,500 – ₱4,000",
    status: "Confirmed",
    timeline: [
      { label: "Booking Sent",      desc: "Your request was submitted",       done: true  },
      { label: "Worker Confirmed",  desc: "Rico accepted your booking",        done: true, active: true },
      { label: "Worker On The Way", desc: "Waiting for the scheduled date",   done: false },
      { label: "Job In Progress",   desc: "Work will start at your address",  done: false },
      { label: "Completed",         desc: "Job finished and payment released", done: false },
    ],
  },
  {
    id: "BW-20250710-0029",
    worker: "Liza Bautista",
    skill: "Painter",
    workerColor: "#EC4899",
    job: "Living Room Repainting",
    date: "July 10, 2025",
    time: "Afternoon · 1PM – 5PM",
    address: "123 Sampaguita St., Brgy. Fairview, QC",
    cost: "₱3,500",
    status: "Cancelled",
    timeline: [
      { label: "Booking Sent",      desc: "Your request was submitted",  done: true  },
      { label: "Cancelled",         desc: "Booking was cancelled",       done: true  },
    ],
  },
];

const STATUS_STYLES: Record<BookingStatus, { pill: string; icon: React.ReactNode }> = {
  "Pending":     { pill: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  "Confirmed":   { pill: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",        icon: <CheckCircle className="w-3.5 h-3.5" /> },
  "In Progress": { pill: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  "Completed":   { pill: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  "Cancelled":   { pill: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400",            icon: <XCircle className="w-3.5 h-3.5" /> },
};

function workerInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const FILTER_TABS: { label: string; value: BookingStatus | "All" }[] = [
  { label: "All",         value: "All"         },
  { label: "Active",      value: "In Progress" },
  { label: "Upcoming",    value: "Confirmed"   },
  { label: "Pending",     value: "Pending"     },
  { label: "Completed",   value: "Completed"   },
  { label: "Cancelled",   value: "Cancelled"   },
];

function BookingDetail({ booking, onBack }: { booking: Booking; onBack: () => void }) {
  const navigate = useNavigate();
  const { icon, pill } = STATUS_STYLES[booking.status];

  return (
    <div className="space-y-4">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to bookings
      </button>

      {/* Header card */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-1">#{booking.id}</p>
            <h2 className="text-lg font-bold">{booking.job}</h2>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${pill}`}>
            {icon} {booking.status}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: booking.workerColor }}
          >
            {workerInitials(booking.worker)}
          </div>
          <div>
            <p className="font-semibold text-sm">{booking.worker}</p>
            <p className="text-xs text-muted-foreground">{booking.skill}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 text-sm">
          {[
            { icon: <CalendarDays className="w-4 h-4" />, val: booking.date },
            { icon: <Clock className="w-4 h-4" />,        val: booking.time },
            { icon: <MapPin className="w-4 h-4" />,       val: booking.address },
          ].map(({ icon, val }) => (
            <div key={val} className="flex items-center gap-2 text-muted-foreground">
              {icon}
              <span className="text-foreground">{val}</span>
            </div>
          ))}
        </div>

        <div
          className="mt-4 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between"
          style={{ background: `${A}10`, color: A }}
        >
          <span>Estimated Cost</span>
          <span>{booking.cost}</span>
        </div>
      </div>

      {/* Status timeline */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="font-bold mb-5">Booking Status</h3>
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-5">
            {booking.timeline.map((step, i) => {
              const isActive = step.active;
              const isDone = step.done && !isActive;
              return (
                <div key={i} className="flex gap-4 items-start relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                      isActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : isDone
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-border bg-background"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <p className={`text-sm font-semibold ${isActive ? "text-blue-600 dark:text-blue-400" : isDone ? "" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      {booking.status === "Completed" && (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-3">Rate Your Experience</h3>
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s}>
                <Star className="w-7 h-7 text-amber-400 fill-amber-400 hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>
          <textarea
            rows={2}
            placeholder="Leave a comment about your experience..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-muted-foreground"
          />
          <button
            className="mt-3 w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: A }}
          >
            Submit Review
          </button>
        </div>
      )}

      <div className="flex gap-3">
        {booking.status !== "Cancelled" && booking.status !== "Completed" && (
          <button
            onClick={() => navigate("/app/chat")}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Message Worker
          </button>
        )}
        {booking.status === "Completed" && (
          <button
            onClick={() => navigate("/app/booking/new")}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ background: A }}
          >
            <RotateCcw className="w-4 h-4" /> Book Again
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyBookings({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = filter === "All" ? BOOKINGS : BOOKINGS.filter((b) => b.status === filter);
  const selectedBooking = BOOKINGS.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {selectedBooking ? (
          <BookingDetail booking={selectedBooking} onBack={() => setSelectedId(null)} />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">My Bookings</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{BOOKINGS.length} bookings total</p>
              </div>
              <button
                onClick={() => navigate("/app/booking/new")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95"
                style={{ background: A }}
              >
                <Plus className="w-4 h-4" /> New Booking
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap mb-5">
              {FILTER_TABS.map((tab) => {
                const count = tab.value === "All"
                  ? BOOKINGS.length
                  : BOOKINGS.filter((b) => b.status === tab.value).length;
                if (count === 0 && tab.value !== "All") return null;
                const isActive = filter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive ? "text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    style={isActive ? { background: A } : {}}
                  >
                    {tab.label} {count > 0 && <span className={isActive ? "opacity-70" : ""}>{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Booking cards */}
            <div className="space-y-3">
              {filtered.map((b) => {
                const { icon, pill } = STATUS_STYLES[b.status];
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className="w-full text-left bg-card rounded-2xl border border-border p-5 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ background: b.workerColor }}
                        >
                          {workerInitials(b.worker)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{b.job}</p>
                          <p className="text-xs text-muted-foreground">{b.worker} · {b.skill}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${pill}`}>
                          {icon} {b.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {b.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {b.time}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-mono text-muted-foreground">#{b.id}</p>
                      <p className="text-sm font-semibold" style={{ color: A }}>{b.cost}</p>
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No bookings here</p>
                  <p className="text-xs mt-1">Try a different filter or book a new service</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
