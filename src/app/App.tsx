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
import BlueBotChat from "./pages/customer/BlueBotChat";
import WorkerDashboard from "./pages/worker/Dashboard";
import MyJobs from "./pages/worker/MyJobs";
import SchedulePage from "./pages/worker/Schedule";
import MessagesPage from "./pages/worker/Messages";
import ProfileEditor from "./pages/worker/ProfileEditor";
import EarningsPage from "./pages/worker/Earnings";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark((d) => !d);
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
            <Route path="/app/booking" element={<RoleRoute requiredRole="customer"><BookingFlow {...dp} /></RoleRoute>} />
            <Route path="/app/chat" element={<RoleRoute requiredRole="customer"><BlueBotChat {...dp} /></RoleRoute>} />

            {/* Worker protected */}
            <Route path="/worker/dashboard" element={<RoleRoute requiredRole="worker"><WorkerDashboard {...dp} /></RoleRoute>} />
            <Route path="/worker/jobs" element={<RoleRoute requiredRole="worker"><MyJobs {...dp} /></RoleRoute>} />
            <Route path="/worker/schedule" element={<RoleRoute requiredRole="worker"><SchedulePage {...dp} /></RoleRoute>} />
            <Route path="/worker/messages" element={<RoleRoute requiredRole="worker"><MessagesPage {...dp} /></RoleRoute>} />
            <Route path="/worker/profile" element={<RoleRoute requiredRole="worker"><ProfileEditor {...dp} /></RoleRoute>} />
            <Route path="/worker/earnings" element={<RoleRoute requiredRole="worker"><EarningsPage {...dp} /></RoleRoute>} />

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
