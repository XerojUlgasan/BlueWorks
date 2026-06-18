import { useNavigate, useLocation } from "react-router";
import { Bell, Home, Briefcase, Calendar, MessageCircle, User, DollarSign, LogOut, Wrench, Users, BarChart2, Settings, AlertTriangle, Bot } from "lucide-react";
import { Logo, DarkToggle } from "./index";
import { A, P } from "../../constants";
import { initials } from "./index";

const CUSTOMER_LINKS = [
  { label: "Home",         path: "/app/home",      icon: <Home className="w-5 h-5" /> },
  { label: "Find Workers", path: "/app/discover",  icon: <Users className="w-5 h-5" /> },
  { label: "My Bookings",  path: "/app/bookings",  icon: <Briefcase className="w-5 h-5" /> },
  { label: "Messages",     path: "/app/chat",      icon: <MessageCircle className="w-5 h-5" /> },
  { label: "BlueBot",      path: "/app/bluebot",   icon: <Bot className="w-5 h-5" /> },
];

export function CustomerNav({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border px-4 md:px-6 py-3 flex items-center gap-4">
        <button onClick={() => navigate("/")}><Logo /></button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 ml-4 flex-1">
          {CUSTOMER_LINKS.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === path
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={location.pathname === path ? { backgroundColor: A } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <DarkToggle dark={dark} toggleDark={toggleDark} />
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button
            className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold"
            style={{ background: A }}
          >
            AR
          </button>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center safe-area-pb">
        {CUSTOMER_LINKS.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
              style={{ color: isActive ? A : undefined }}
            >
              <span className={`transition-colors ${isActive ? "" : "text-muted-foreground"}`}>
                {icon}
              </span>
              <span className={`text-[10px] font-medium leading-none ${isActive ? "" : "text-muted-foreground"}`}>
                {label === "Find Workers" ? "Find" : label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export function WorkerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    { icon: <Home className="w-5 h-5" />,         label: "Dashboard", path: "/worker/dashboard" },
    { icon: <Briefcase className="w-5 h-5" />,     label: "My Jobs",   path: "/worker/jobs"      },
    { icon: <Calendar className="w-5 h-5" />,      label: "Schedule",  path: "/worker/schedule"  },
    { icon: <MessageCircle className="w-5 h-5" />, label: "Messages",  path: "/worker/messages"  },
    { icon: <User className="w-5 h-5" />,          label: "My Profile",path: "/worker/profile"   },
    { icon: <DollarSign className="w-5 h-5" />,    label: "Earnings",  path: "/worker/earnings"  },
  ];
  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0" style={{ backgroundColor: P }}>
      <div className="p-5 border-b border-white/10"><Logo light /></div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === path ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>JC</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Juan dela Cruz</p>
          <p className="text-xs text-white/60">Electrician</p>
        </div>
        <button className="text-white/50 hover:text-white/80 transition-colors"><LogOut className="w-4 h-4" /></button>
      </div>
    </aside>
  );
}

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    { icon: <Home className="w-5 h-5" />,          label: "Overview"  },
    { icon: <Users className="w-5 h-5" />,         label: "Users"     },
    { icon: <Wrench className="w-5 h-5" />,        label: "Workers"   },
    { icon: <Briefcase className="w-5 h-5" />,     label: "Bookings"  },
    { icon: <AlertTriangle className="w-5 h-5" />, label: "Reports"   },
    { icon: <BarChart2 className="w-5 h-5" />,     label: "Analytics" },
    { icon: <Settings className="w-5 h-5" />,      label: "Settings"  },
  ];
  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0" style={{ backgroundColor: P }}>
      <div className="p-5 border-b border-white/10">
        <Logo light />
        <span className="mt-1 block text-xs text-white/50 font-medium uppercase tracking-wider">Admin Panel</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ icon, label }) => (
          <button
            key={label}
            onClick={() => navigate("/admin")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === "/admin" && label === "Overview" ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">AD</div>
        <div>
          <p className="text-sm font-semibold text-white">Admin User</p>
          <p className="text-xs text-white/60">Super Admin</p>
        </div>
      </div>
    </aside>
  );
}
