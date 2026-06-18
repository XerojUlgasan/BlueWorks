import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
import { AuthCard, InputField } from "../../components/shared";
import { A } from "../../constants";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    console.log("JWT token:", data.session?.access_token);
    const role = data.user?.user_metadata?.role;
    if (role === "worker") { navigate("/worker/dashboard"); }
    else { navigate("/app/home"); }
  }

  return (
    <AuthCard label="Sign in to your account" portalType="customer">
      <div className="space-y-4">
        <InputField label="Email Address" type="email" placeholder="juandelacruz@email.com" value={email} onChange={setEmail} />
        <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
        <div className="text-right"><a href="#" className="text-xs font-medium" style={{ color: A }}>Forgot password?</a></div>
        {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
        <button onClick={handleLogin} disabled={loading}
          className="w-full py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: A }}>
          {loading ? "Signing in…" : "Log In"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button onClick={() => navigate("/customer/register")} className="font-semibold" style={{ color: A }}>Register here</button>
        </p>
      </div>
    </AuthCard>
  );
}
