import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { supabase } from "../../../lib/supabase";
import type { Session } from "@supabase/supabase-js";

function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
  return session;
}

export function ProtectedRoute({ children, loginPath }: { children: React.ReactNode; loginPath: string }) {
  const session = useSession();
  if (session === undefined) return null;
  if (!session) return <Navigate to={loginPath} replace />;
  return <>{children}</>;
}

export function RoleRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole: "customer" | "worker" }) {
  const session = useSession();
  const location = useLocation();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  const isOnboardingPath = location.pathname === "/worker/onboarding";

  useEffect(() => {
    // Skip check if not a worker route or already on the onboarding page
    if (!session || requiredRole !== "worker" || isOnboardingPath) {
      setOnboardingDone(true);
      return;
    }
    supabase
      .from("workers")
      .select("onboarding_complete")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setOnboardingDone(!!data?.onboarding_complete));
  }, [session, requiredRole, isOnboardingPath]);

  if (session === undefined) return null;
  if (!session) return <Navigate to={requiredRole === "customer" ? "/customer/login" : "/worker/login"} replace />;

  const role = session.user.user_metadata?.role;
  if (role === "worker" && requiredRole === "customer") return <Navigate to="/worker/dashboard" replace />;
  if (role === "customer" && requiredRole === "worker") return <Navigate to="/app/home" replace />;

  // Worker onboarding gate
  if (requiredRole === "worker" && !isOnboardingPath && onboardingDone === null) return null;
  if (requiredRole === "worker" && !isOnboardingPath && onboardingDone === false) {
    return <Navigate to="/worker/onboarding" replace />;
  }

  return <>{children}</>;
}
