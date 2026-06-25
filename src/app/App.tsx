import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { RoleRoute, ProtectedRoute } from "./components/shared/RouteGuards";

// Pages
import Landing from "./pages/Landing";
import CustomerLogin from "./pages/auth/CustomerLogin";
import CustomerRegister from "./pages/auth/CustomerRegister";
import WorkerLogin from "./pages/auth/WorkerLogin";
import WorkerRegister from "./pages/auth/WorkerRegister";
import BlueBotOnboard from "./pages/customer/BlueBotOnboard";
import WorkerDiscovery from "./pages/customer/WorkerDiscovery";
import WorkerProfile from "./pages/customer/WorkerProfile";
import BookingFlow from "./pages/customer/BookingFlow";
import MyBookings from "./pages/customer/MyBookings";
import BlueBotChat from "./pages/customer/BlueBotChat";
import WorkerMessages from "./pages/customer/WorkerMessages";
import WorkerDashboard from "./pages/worker/Dashboard";
import MyJobs from "./pages/worker/MyJobs";
import SchedulePage from "./pages/worker/Schedule";
import MessagesPage from "./pages/worker/Messages";
import ProfileEditor from "./pages/worker/ProfileEditor";
import EarningsPage from "./pages/worker/Earnings";
import WorkerSettings from "./pages/worker/Settings";
import WorkerOnboarding from "./pages/worker/WorkerOnboarding";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const toggleDark = () => setDark((d) => {
    const next = !d;
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    return next;
  });

  // Sync on mount in case localStorage already has dark
  if (dark) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  const dp = { dark, toggleDark };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing {...dp} />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/worker/login" element={<WorkerLogin />} />
            <Route path="/worker/register" element={<WorkerRegister />} />

            {/* Customer protected */}
            <Route path="/app/home" element={<RoleRoute requiredRole="customer"><BlueBotOnboard {...dp} /></RoleRoute>} />
            <Route path="/app/discover" element={<RoleRoute requiredRole="customer"><WorkerDiscovery {...dp} /></RoleRoute>} />
            <Route path="/app/worker/:id" element={<RoleRoute requiredRole="customer"><WorkerProfile {...dp} /></RoleRoute>} />
            <Route path="/app/bookings" element={<RoleRoute requiredRole="customer"><MyBookings {...dp} /></RoleRoute>} />
            <Route path="/app/booking/new" element={<RoleRoute requiredRole="customer"><BookingFlow {...dp} /></RoleRoute>} />
            <Route path="/app/booking" element={<RoleRoute requiredRole="customer"><BookingFlow {...dp} /></RoleRoute>} />
            <Route path="/app/chat" element={<RoleRoute requiredRole="customer"><WorkerMessages {...dp} /></RoleRoute>} />
            <Route path="/app/bluebot" element={<RoleRoute requiredRole="customer"><BlueBotChat {...dp} /></RoleRoute>} />

            {/* Worker onboarding — only needs auth, NOT the onboarding gate */}
            <Route path="/worker/onboarding" element={<ProtectedRoute loginPath="/worker/login"><WorkerOnboarding /></ProtectedRoute>} />

            {/* Worker protected */}
            <Route path="/worker/dashboard" element={<RoleRoute requiredRole="worker"><WorkerDashboard {...dp} /></RoleRoute>} />
            <Route path="/worker/jobs" element={<RoleRoute requiredRole="worker"><MyJobs {...dp} /></RoleRoute>} />
            <Route path="/worker/schedule" element={<RoleRoute requiredRole="worker"><SchedulePage {...dp} /></RoleRoute>} />
            <Route path="/worker/messages" element={<RoleRoute requiredRole="worker"><MessagesPage {...dp} /></RoleRoute>} />
            <Route path="/worker/profile" element={<RoleRoute requiredRole="worker"><ProfileEditor {...dp} /></RoleRoute>} />
            <Route path="/worker/earnings" element={<RoleRoute requiredRole="worker"><EarningsPage {...dp} /></RoleRoute>} />
            <Route path="/worker/settings" element={<RoleRoute requiredRole="worker"><WorkerSettings {...dp} /></RoleRoute>} />

            {/* Admin (unprotected for now) */}
            <Route path="/admin" element={<AdminDashboard {...dp} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
