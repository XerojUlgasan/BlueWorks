import { useState } from "react";
import { Bell, Shield, Eye, EyeOff, LogOut, Trash2, MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { WorkerSidebar } from "../../components/shared/Nav";
import { DarkToggle, InputField, SelectField } from "../../components/shared";
import { A, P, BARANGAYS, JOB_CATEGORIES, SECONDARY_SKILLS } from "../../constants";
import { supabase } from "../../../lib/supabase";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SETTING_TABS = [
  { id: "profile",   label: "Profile Info"      },
  { id: "skills",    label: "Skills & Category" },
  { id: "portfolio", label: "Portfolio"         },
  { id: "pricing",   label: "Pricing"           },
  { id: "location",  label: "Location"          },
  { id: "account",   label: "Account Settings"  },
];

function LocationMarker({
  lat, lng, onChange,
}: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
  function Inner() {
    useMapEvents({ click(e) { onChange(e.latlng.lat, e.latlng.lng); } });
    return null;
  }
  return (
    <MapContainer center={[lat, lng]} zoom={15} style={{ height: 240, borderRadius: 12 }} key={`${lat}-${lng}`}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Inner />
      {lat && lng && <Marker position={[lat, lng]} />}
    </MapContainer>
  );
}

export default function Settings({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const [activeTab,  setActiveTab]  = useState("profile");
  const [saved,      setSaved]      = useState(false);
  const [saveError,  setSaveError]  = useState("");

  // ── Profile ──────────────────────────────────────────────
  const [fullName, setFullName] = useState(user?.fullname || "");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [bio,      setBio]      = useState("");

  // ── Skills ───────────────────────────────────────────────
  const [jobCategory,     setJobCategory]     = useState("electrician");
  const [primarySkill,    setPrimarySkill]    = useState("Rewiring");
  const [secondarySkills, setSecondarySkills] = useState<string[]>(["Panel Upgrade"]);
  const [experienceYears, setExperienceYears] = useState("8");

  // ── Pricing ──────────────────────────────────────────────
  const [hourlyRate,      setHourlyRate]      = useState("500");
  const [minorPrice,      setMinorPrice]      = useState("300");
  const [majorPrice,      setMajorPrice]      = useState("800");
  const [emergencyPrice,  setEmergencyPrice]  = useState("1500");

  // ── Location ─────────────────────────────────────────────
  const [barangay, setBarangay] = useState("Fairview");
  const [lat,      setLat]      = useState(14.7325);
  const [lng,      setLng]      = useState(121.0588);

  // ── Account ──────────────────────────────────────────────
  const [showPass,      setShowPass]      = useState(false);
  const [currentPass,   setCurrentPass]   = useState("");
  const [newPass,       setNewPass]       = useState("");
  const [confirmPass,   setConfirmPass]   = useState("");
  const [notifJobs,     setNotifJobs]     = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifEarnings, setNotifEarnings] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [deleteError,   setDeleteError]   = useState("");

  const availableSkills = SECONDARY_SKILLS[jobCategory] ?? [];

  function toggleSecondary(skill: string) {
    setSecondarySkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : prev.length < 5 ? [...prev, skill] : prev
    );
  }

  function handleBarangayChange(b: string) {
    setBarangay(b);
    const COORDS: Record<string, [number, number]> = {
      "Fairview":      [14.7325, 121.0588],
      "Novaliches":    [14.7294, 121.0448],
      "Batasan Hills": [14.6870, 121.0980],
      "Lagro":         [14.7176, 121.0490],
    };
    if (COORDS[b]) { setLat(COORDS[b][0]); setLng(COORDS[b][1]); }
  }

  async function handleSave() {
    setSaved(false);
    setSaveError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setSaveError("Session expired. Please log in again."); return; }

      let patch: Record<string, unknown> = {};

      if (activeTab === "profile") {
        patch = { full_name: fullName, phone, address, bio, barangay };
      } else if (activeTab === "skills") {
        patch = {
          job_category:     jobCategory,
          job_type:         primarySkill,
          skills:           [primarySkill, ...secondarySkills].filter(Boolean),
          skill_set:        secondarySkills,
          experience_years: parseInt(experienceYears) || 0,
        };
      } else if (activeTab === "pricing") {
        patch = {
          hourly_rate:      parseFloat(hourlyRate) || 0,
          severity_pricing: {
            minor:     parseFloat(minorPrice)     || 0,
            major:     parseFloat(majorPrice)     || 0,
            emergency: parseFloat(emergencyPrice) || 0,
          },
        };
      } else if (activeTab === "location") {
        patch = {
          barangay,
          location: `SRID=4326;POINT(${lng} ${lat})`,
        };
      }

      if (Object.keys(patch).length === 0) return;

      const { error } = await supabase
        .from("workers")
        .update(patch)
        .eq("id", session.user.id);

      if (error) { setSaveError(error.message); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setSaveError(e.message || "Something went wrong.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/worker/login");
  }

  async function handleDeleteAccount() {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    setDeleting(true);
    setDeleteError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/worker/login"); return; }
      const { error } = await supabase
        .from("workers")
        .update({ is_verified: false, onboarding_complete: false, bio: "[ACCOUNT DEACTIVATED]" })
        .eq("id", session.user.id);
      if (error) { setDeleteError(error.message); setDeleting(false); setDeleteConfirm(false); return; }
      await supabase.auth.signOut();
      navigate("/worker/login");
    } catch (e: any) {
      setDeleteError(e.message || "Failed to deactivate account.");
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 overflow-y-auto">

        {/* ── Header ── */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>
          <DarkToggle dark={dark} toggleDark={toggleDark} />
        </div>

        <div className="flex h-[calc(100vh-89px)]">

          {/* ── Left tab nav ── */}
          <div className="w-52 shrink-0 border-r border-border p-3 space-y-1">
            {SETTING_TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between
                  ${activeTab === t.id ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                style={activeTab === t.id ? { background: A } : {}}>
                {t.label}
                {activeTab === t.id && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            ))}
          </div>

          {/* ── Content ── */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-xl space-y-5">

              {/* ── Profile Info ── */}
              {activeTab === "profile" && (
                <>
                  <div>
                    <h2 className="font-bold text-lg">Profile Info</h2>
                    <p className="text-sm text-muted-foreground">Update your basic information</p>
                  </div>
                  <div className="space-y-3">
                    <InputField label="Full Name" placeholder="Juan dela Cruz" value={fullName} onChange={setFullName} />
                    <InputField label="Contact Number" placeholder="+63 917 123 4567" value={phone} onChange={setPhone} />
                    <InputField label="Email Address" type="email" placeholder="juan@email.com" value={user?.email ?? ""} />
                    <InputField label="Address" placeholder="45 Rosal St." value={address} onChange={setAddress} />
                    <SelectField label="Barangay" options={BARANGAYS} value={barangay} onChange={b => setBarangay(b)} />
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Bio</label>
                      <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Tell customers about yourself and your experience…"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                    </div>
                  </div>
                </>
              )}

              {/* ── Skills & Category ── */}
              {activeTab === "skills" && (
                <>
                  <div>
                    <h2 className="font-bold text-lg">Skills & Job Category</h2>
                    <p className="text-sm text-muted-foreground">What kind of work do you do?</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {JOB_CATEGORIES.map(cat => (
                        <button key={cat.id}
                          onClick={() => { setJobCategory(cat.id); setPrimarySkill(""); setSecondarySkills([]); }}
                          className={`p-3 rounded-xl border-2 text-left text-sm transition-all
                            ${jobCategory === cat.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border hover:border-blue-300"}`}>
                          <span className="mr-1.5">{cat.icon}</span>{cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Skill</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.map(s => (
                        <button key={s} onClick={() => setPrimarySkill(s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                            ${primarySkill === s ? "text-white border-transparent" : "border-border hover:border-blue-300"}`}
                          style={primarySkill === s ? { background: A } : {}}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Secondary Skills <span className="font-normal text-muted-foreground">(up to 5)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.filter(s => s !== primarySkill).map(s => (
                        <button key={s} onClick={() => toggleSecondary(s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                            ${secondarySkills.includes(s) ? "text-white border-transparent" : "border-border hover:border-blue-300"}`}
                          style={secondarySkills.includes(s) ? { background: `${A}cc` } : {}}>
                          {s} {secondarySkills.includes(s) ? "×" : "+"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <InputField label="Years of Experience" placeholder="8" value={experienceYears} onChange={setExperienceYears} />
                </>
              )}

              {/* ── Portfolio ── */}
              {activeTab === "portfolio" && (
                <>
                  <div>
                    <h2 className="font-bold text-lg">Portfolio</h2>
                    <p className="text-sm text-muted-foreground">Show customers examples of your work (max 5 photos)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}
                        className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors
                          ${i < 3 ? "border-border bg-muted/50" : "border-border hover:border-blue-400"}`}>
                        {i < 3 ? (
                          <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center text-xs text-muted-foreground font-medium">
                            Photo {i + 1}
                          </div>
                        ) : (
                          <>
                            <span className="text-2xl text-muted-foreground">+</span>
                            <span className="text-xs text-muted-foreground">Add photo</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Pricing ── */}
              {activeTab === "pricing" && (
                <>
                  <div>
                    <h2 className="font-bold text-lg">Pricing</h2>
                    <p className="text-sm text-muted-foreground">Set your rates — customers see these on your profile</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Hourly Rate (₱/hr)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₱</span>
                      <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-semibold">Severity-Based Pricing</p>
                    {[
                      { label: "Minor Jobs",     val: minorPrice,     set: setMinorPrice,     color: "#10B981" },
                      { label: "Major Jobs",     val: majorPrice,     set: setMajorPrice,     color: "#F59E0B" },
                      { label: "Emergency Jobs", val: emergencyPrice, set: setEmergencyPrice, color: "#EF4444" },
                    ].map(({ label, val, set, color }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                        <span className="text-sm flex-1">{label}</span>
                        <div className="relative w-28">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₱</span>
                          <input type="number" value={val} onChange={e => set(e.target.value)}
                            className="w-full pl-6 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Location ── */}
              {activeTab === "location" && (
                <>
                  <div>
                    <h2 className="font-bold text-lg">Location</h2>
                    <p className="text-sm text-muted-foreground">Update your service area and pin your exact location on the map</p>
                  </div>
                  <SelectField label="Barangay" options={BARANGAYS} value={barangay} onChange={handleBarangayChange} />
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Pin your location <span className="font-normal text-muted-foreground text-xs">(tap the map)</span>
                    </label>
                    <LocationMarker lat={lat} lng={lng} onChange={(la, ln) => { setLat(la); setLng(ln); }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-xl p-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Latitude</span>
                      <p className="font-mono font-medium mt-0.5">{lat.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Longitude</span>
                      <p className="font-mono font-medium mt-0.5">{lng.toFixed(6)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Stored as <code className="font-mono bg-muted px-1 py-0.5 rounded">GEOGRAPHY(POINT, 4326)</code> in PostGIS
                  </p>
                </>
              )}

              {/* ── Account Settings ── */}
              {activeTab === "account" && (
                <>
                  <div>
                    <h2 className="font-bold text-lg">Account Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage your password and account preferences</p>
                  </div>

                  {/* Change password */}
                  <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-sm">Change Password</p>
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                      <button onClick={() => setShowPass(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                      placeholder="New password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <button className="px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: A }}>
                      Update Password
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-sm">Notifications</p>
                    </div>
                    {[
                      { label: "New job requests", sub: "Get notified when a customer books you", val: notifJobs,     set: setNotifJobs     },
                      { label: "Messages",         sub: "Get notified for new messages",          val: notifMessages, set: setNotifMessages },
                      { label: "Earnings updates", sub: "Payment confirmations and summaries",    val: notifEarnings, set: setNotifEarnings },
                    ].map(({ label, sub, val, set }) => (
                      <div key={label} className="flex items-center justify-between py-1">
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                        <button onClick={() => set(v => !v)}
                          className="w-10 h-5 rounded-full relative transition-colors shrink-0"
                          style={{ background: val ? A : undefined }}>
                          {!val && <span className="absolute inset-0 rounded-full bg-gray-300 dark:bg-gray-600" />}
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${val ? "right-0.5" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Danger zone */}
                  <div className="bg-card rounded-2xl border border-red-200 dark:border-red-800 p-4 space-y-3">
                    <p className="font-semibold text-sm text-red-600 dark:text-red-400">Danger Zone</p>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
                      <LogOut className="w-4 h-4 text-muted-foreground" /> Sign out of this device
                    </button>
                    {!deleteConfirm ? (
                      <button onClick={handleDeleteAccount}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors text-sm font-medium">
                        <Trash2 className="w-4 h-4" /> Deactivate my account
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
                          This will deactivate your account and remove you from the marketplace. You'll be signed out immediately.
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeleteConfirm(false)}
                            className="flex-1 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                            Cancel
                          </button>
                          <button onClick={handleDeleteAccount} disabled={deleting}
                            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">
                            {deleting ? "Deactivating…" : "Yes, deactivate"}
                          </button>
                        </div>
                      </div>
                    )}
                    {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
                  </div>
                </>
              )}

              {/* ── Save button (not for account or portfolio tabs) ── */}
              {activeTab !== "account" && activeTab !== "portfolio" && (
                <div className="space-y-2 pt-1">
                  {saveError && (
                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{saveError}</p>
                  )}
                  <button onClick={handleSave}
                    className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all ${saved ? "bg-emerald-500" : ""}`}
                    style={!saved ? { background: P } : {}}>
                    {saved ? "✓ Saved!" : "Save Changes"}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
