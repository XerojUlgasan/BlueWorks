import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle, ChevronRight, ChevronLeft, MapPin,
  Briefcase, Wrench, DollarSign, Eye, Plus, X, Sparkles,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { supabase } from "../../../lib/supabase";
import { P, A, JOB_CATEGORIES, SECONDARY_SKILLS, BARANGAYS, BARANGAY_COORDS } from "../../constants";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Types ──────────────────────────────────────────────────────
export interface JobCategoryEntry {
  category:    string;
  label:       string;
  icon:        string;
  skills:      string[];
  description: string;
}

const MAX_CATEGORIES = 3;

const STEPS = [
  { id: 1, label: "Categories", icon: <Briefcase  className="w-4 h-4" /> },
  { id: 2, label: "Skills",     icon: <Wrench     className="w-4 h-4" /> },
  { id: 3, label: "Pricing",    icon: <DollarSign className="w-4 h-4" /> },
  { id: 4, label: "Location",   icon: <MapPin     className="w-4 h-4" /> },
  { id: 5, label: "Review",     icon: <Eye        className="w-4 h-4" /> },
];

function LocationPicker({ lat, lng, onChange }: {
  lat: number; lng: number; onChange: (lat: number, lng: number) => void;
}) {
  function Inner() {
    useMapEvents({ click(e) { onChange(e.latlng.lat, e.latlng.lng); } });
    return null;
  }
  return (
    <MapContainer
      center={[lat, lng]} zoom={15}
      style={{ height: 280, borderRadius: 12, zIndex: 0 }}
      key={`${lat}-${lng}`}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      <Inner />
      {lat && lng && <Marker position={[lat, lng]} />}
    </MapContainer>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-0 gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export default function WorkerOnboarding() {
  const navigate = useNavigate();
  const [step,   setStep]   = useState(1);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  // Step 1 + 2 combined — multi-category with skills + description per category
  const [selectedCats, setSelectedCats] = useState<JobCategoryEntry[]>([]);
  const [activeCatId,  setActiveCatId]  = useState<string | null>(null);
  const [customSkill,  setCustomSkill]  = useState("");

  // Step 3 — pricing
  const [hourlyRate,     setHourlyRate]     = useState("");
  const [minorPrice,     setMinorPrice]     = useState("");
  const [majorPrice,     setMajorPrice]     = useState("");
  const [emergencyPrice, setEmergencyPrice] = useState("");

  // Step 4 — location
  const [barangay, setBarangay] = useState("");
  const [lat,      setLat]      = useState(14.676);
  const [lng,      setLng]      = useState(121.044);

  // ── Category helpers ──
  function toggleCategory(cat: typeof JOB_CATEGORIES[0]) {
    setSelectedCats(prev => {
      const exists = prev.find(c => c.category === cat.id);
      if (exists) return prev.filter(c => c.category !== cat.id);
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, { category: cat.id, label: cat.label, icon: cat.icon, skills: [], description: "" }];
    });
  }

  function updateEntry(catId: string, field: "skills" | "description", value: string | string[]) {
    setSelectedCats(prev =>
      prev.map(c => c.category === catId ? { ...c, [field]: value } : c)
    );
  }

  function toggleSkip(catId: string, skill: string) {
    const entry = selectedCats.find(c => c.category === catId);
    if (!entry) return;
    const has = entry.skills.includes(skill);
    updateEntry(catId, "skills", has ? entry.skills.filter(s => s !== skill) : [...entry.skills, skill]);
  }

  function addCustomSkill(catId: string) {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    const entry = selectedCats.find(c => c.category === catId);
    if (!entry || entry.skills.includes(trimmed)) { setCustomSkill(""); return; }
    updateEntry(catId, "skills", [...entry.skills, trimmed]);
    setCustomSkill("");
  }

  function removeSkill(catId: string, skill: string) {
    const entry = selectedCats.find(c => c.category === catId);
    if (!entry) return;
    updateEntry(catId, "skills", entry.skills.filter(s => s !== skill));
  }

  function handleBarangayChange(b: string) {
    setBarangay(b);
    const coords = BARANGAY_COORDS[b];
    if (coords) { setLat(coords.lat); setLng(coords.lng); }
  }

  const canNext = () => {
    if (step === 1) return selectedCats.length > 0;
    if (step === 2) return selectedCats.every(c => c.description.trim().length >= 10);
    if (step === 3) return !!hourlyRate;
    if (step === 4) return !!barangay && !!lat && !!lng;
    return true;
  };

  async function handleSubmit() {
    setError("");
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setError("Session expired. Please log in again."); setSaving(false); return; }

      const workerData = {
        id:                  session.user.id,
        full_name:           session.user.user_metadata?.full_name || "",
        phone:               session.user.user_metadata?.phone || "",
        address:             session.user.user_metadata?.address || "",
        barangay,
        location:            `SRID=4326;POINT(${lng} ${lat})`,
        job_categories:      selectedCats,          // jsonb array — full structured data
        hourly_rate:         parseFloat(hourlyRate) || 0,
        severity_pricing: {
          minor:             parseFloat(minorPrice)     || 0,
          major:             parseFloat(majorPrice)     || 0,
          emergency:         parseFloat(emergencyPrice) || 0,
        },
        is_verified:         false,
        ratings:             0,
        jobs_finished:       0,
        onboarding_complete: true,
      };

      const { error: upsertErr } = await supabase.from("workers").upsert(workerData);
      if (upsertErr) { setError(upsertErr.message); setSaving(false); return; }

      await supabase.auth.updateUser({ data: { onboarding_complete: true } });
      navigate("/worker/dashboard");
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3" style={{ background: P }}>
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Set up your worker profile to start receiving job requests</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center
                ${step === s.id ? "text-white" : step > s.id ? "text-white" : "text-muted-foreground bg-muted"}`}
                style={step === s.id ? { background: P } : step > s.id ? { background: A } : {}}>
                {step > s.id ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-0.5 w-3 shrink-0 transition-colors"
                  style={step > s.id ? { background: A } : { background: "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
