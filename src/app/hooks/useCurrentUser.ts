import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export interface CurrentUser {
  id: string;
  fullname: string;
  role: string;
  email?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user.id) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Extract fullname from user metadata
        const fullname = session.user.user_metadata?.full_name || session.user.email || "User";
        const role = session.user.user_metadata?.role || "customer";
        const email = session.user.email || "";

        setUser({
          id: session.user.id,
          fullname,
          role,
          email,
        });
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
