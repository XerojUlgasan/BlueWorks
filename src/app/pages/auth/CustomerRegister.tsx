import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { AuthCard, InputField, SelectField } from "../../components/shared";
import { A, BARANGAYS } from "../../constants";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [address, setAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleRegister() {
    setError("");
    if (!name || !phone || !email || !password || !confirm || !address || !barangay) {
      setError("Please fill in all fields."); return;
    }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role: "customer", phone, address, barangay } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setCooldown(60);
  }

  async function handleResend() {
    if (cooldown > 0) return;
    const { error: err } = await supabase.auth.resend({ type: "signup", email });
    if (err) { setError(err.message); return; }
    setCooldown(60);
  }

  if (done) {
    return (
      <AuthCard label="Almost there!" portalType="customer">
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: `${A}20` }}>
            <Mail className="w-8 h-8" style={{ color: A }} />
          </div>
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="text-sm text-muted-foreground">We sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>. Click it to activate your account.</p>
          <button onClick={handleResend} disabled={cooldown > 0}
            className="text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed" style={{ color: A }}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend confirmation email"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button onClick={() => navigate("/customer/login")} className="w-full py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors mt-2">
            Back to Login
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard label="Create your account" portalType="customer">
      <div className="space-y-3">
        <InputField label="Full Name" placeholder="Ana Reyes" value={name} onChange={setName} />
        <InputField label="Contact Number" placeholder="+63 912 345 6789" value={phone} onChange={setPhone} />
        <InputField label="Email Address" type="email" placeholder="ana.reyes@email.com" value={email} onChange={setEmail} />
        <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
        <InputField label="Confirm Password" type="password" placeholder="••••••••" value={confirm} onChange={setConfirm} />
        <InputField label="Address" placeholder="123 Sampaguita St." value={address} onChange={setAddress} />
        <SelectField label="Barangay" options={BARANGAYS} value={barangay} onChange={setBarangay} />
        {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
        <button onClick={handleRegister} disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold mt-2 transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: A }}>
          {loading ? "Creating account…" : "Create Account"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => navigate("/customer/login")} className="font-semibold" style={{ color: A }}>Log in</button>
        </p>
      </div>
    </AuthCard>
  );
}
