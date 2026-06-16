import { useEffect, useState } from "react";
import { Navigate } from "react-router";
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

// Redirects to /customer/login or /worker/login if not authenticated
export function ProtectedRoute({ children, loginPath }: { children: React.ReactNode; loginPath: string }) {
  const session = useSession();
  if (session === undefined) return null; // still loading
  if (!session) return <Navigate to={loginPath} replace />;
  return <>{children}</>;
}

// Checks role and redirects if wrong portal
export function RoleRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole: "customer" | "worker" }) {
  const session = useSession();
  if (session === undefined) return null;
  if (!session) return <Navigate to={requiredRole === "customer" ? "/customer/login" : "/worker/login"} replace />;
  const role = session.user.user_metadata?.role;
  if (role === "worker" && requiredRole === "customer") return <Navigate to="/worker/dashboard" replace />;
  if (role === "customer" && requiredRole === "worker") return <Navigate to="/app/home" replace />;
  return <>{children}</>;
}
