import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Bell, Home, Briefcase, Calendar, MessageCircle, User, DollarSign, LogOut, Wrench, Users, BarChart2, Settings, AlertTriangle, Bot } from "lucide-react";
import { Logo, DarkToggle } from "./index";
import { A, P } from "../../constants";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";
import { initials } from "./index";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const CUSTOMER_LINKS = [
  { label: "Home",         path: "/app/home",      icon: <Home className="w-5 h-5" /> },
  { label: "Find Workers", path: "/app/discover",  icon: <Users className="w-5 h-5" /> },
  { label: "My Bookings",  path: "/app/bookings",  icon: <Briefcase className="w-5 h-5" /> },
  { label: "Messages",     path: "/app/chat",      icon: <MessageCircle className="w-5 h-5" /> },
  { label: "BlueBot",      path: "/app/bluebot",   icon: <Bot className="w-5 h-5" /> },
];

const NOTIFICATIONS = [
  { id: 1, text: "Juan dela Cruz confirmed your booking for tomorrow.", time: "5 min ago",  read: false },
  { id: 2, text: "Your booking for Leaking Sink Repair is complete.",   time: "2 hrs ago",  read: false },
  { id: 3, text: "Maria Santos sent you a message.",                    time: "Yesterday", read: true  },
];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

export function CustomerNav({ dark, toggleDark, transparent = false }: { dark: boolean; toggleDark: () => void; transparent?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useCurrentUser();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [logoutOpen, setLogoutOpen]   = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef   = useRef<HTMLDivElement>(null);

  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(notifRef,   () => setNotifOpen(false));

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  // Only go fully transparent (white text) when dark mode is on — light mode still needs readable dark text
  const isTransparent = transparent && dark;

  const userInitials = user?.fullname ? user.fullname.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  const userName = user?.fullname || "User";

  return (
    <>
      {/* Top bar */}
      <nav className={`${
        transparent
          ? "fixed top-0 left-0 right-0 z-50"
          : "sticky top-0 z-50 bg-card dark:bg-background border-b border-border"
      } px-4 md:px-6 py-3 flex items-center gap-4`}>
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
                  : isTransparent
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={location.pathname === path ? { backgroundColor: A } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <DarkToggle dark={dark} toggleDark={toggleDark} light={isTransparent} />

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
              className={`relative p-2 rounded-lg transition-colors ${
                isTransparent
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <p className="font-semibold text-sm">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ background: A }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-border">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`px-4 py-3 flex items-start gap-3 ${n.read ? "" : "bg-blue-50 dark:bg-blue-900/10"}`}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: A }}>
                        <Bell className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-snug">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: A }} />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border">
                  <button className="text-xs font-semibold w-full text-center" style={{ color: A }}>Mark all as read</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
              className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity"
              style={{ background: A }}
            >
              {userInitials}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-4 flex items-center gap-3 border-b border-border">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: A }}>{userInitials}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground">Customer</p>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setProfileOpen(false); navigate("/app/home"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-muted-foreground" /> My Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); setLogoutOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center h-[56px]">
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
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>You'll be returned to the login screen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => navigate("/")}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function WorkerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useCurrentUser();

  const items = [
    { icon: <Home className="w-5 h-5" />,         label: "Dashboard", path: "/worker/dashboard" },
    { icon: <Briefcase className="w-5 h-5" />,     label: "My Jobs",   path: "/worker/jobs"      },
    { icon: <Calendar className="w-5 h-5" />,      label: "Schedule",  path: "/worker/schedule"  },
    { icon: <MessageCircle className="w-5 h-5" />, label: "Messages",  path: "/worker/messages"  },
    { icon: <User className="w-5 h-5" />,          label: "My Profile",path: "/worker/profile"   },
    { icon: <DollarSign className="w-5 h-5" />,    label: "Earnings",  path: "/worker/earnings"  },
  ];

  const userInitials = user?.fullname ? user.fullname.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  const userFullname = user?.fullname || "Worker";
  const userRole = user?.role === "worker" ? "Service Provider" : user?.role || "Worker";

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
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: A }}>{userInitials}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{userFullname}</p>
          <p className="text-xs text-white/60">{userRole}</p>
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
