import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Bot, Sparkles, Plus, Trash2, ArrowLeft, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { Logo } from "../../components/shared";
import { CustomerNav } from "../../components/shared/Nav";
import { A, BLUEBOT_HISTORY } from "../../constants";

const CHIPS = [
  { emoji: "🔧", label: "Leaking pipe" },
  { emoji: "💡", label: "No electricity" },
  { emoji: "🪟", label: "Broken door" },
  { emoji: "❄️", label: "Aircon not cooling" },
  { emoji: "🪣", label: "Clogged drain" },
  { emoji: "🎨", label: "Need a painter" },
];

export default function BlueBotOnboard({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeHistory, setActiveHistory] = useState<number | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const focused = query.length > 0;

  function handleSubmit() {
    if (query.trim()) navigate("/app/bluebot");
  }

  const contentHeight = "calc(100dvh - 57px)";

  return (
    <div className="bg-background dark:bg-transparent flex flex-col" style={{ height: "100dvh" }}>
      {/* Dark mode background */}
      <div
        className="fixed inset-0 -z-10 hidden dark:block"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1B3A6B 100%)" }}
      />

      <CustomerNav dark={dark} toggleDark={toggleDark} transparent />

      <div className="flex overflow-hidden" style={{ height: contentHeight }}>

        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-50
            w-72 md:w-64 shrink-0 border-r border-border flex flex-col
            bg-card dark:bg-slate-900/80
            transition-transform duration-200
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${desktopSidebarOpen ? "md:translate-x-0" : "md:-translate-x-full md:hidden"}
          `}
        >
          {/* Mobile-only top bar: Logo + close */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <Logo />
            <button
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop-only top bar: Logo + New Chat + collapse */}
          <div className="hidden md:flex flex-col border-b border-border shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <Logo />
              <button
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => setDesktopSidebarOpen(false)}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: A }}
                onClick={() => { setQuery(""); setActiveHistory(null); }}
              >
                <Plus className="w-4 h-4" /> New Chat
              </button>
            </div>
          </div>

          {/* Mobile: New Chat below the logo bar */}
          <div className="md:hidden p-3 border-b border-border shrink-0">
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: A }}
              onClick={() => { setQuery(""); setActiveHistory(null); setMobileSidebarOpen(false); }}
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>

          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            Recent Chats
          </p>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {BLUEBOT_HISTORY.map((h, i) => (
              <button
                key={i}
                onClick={() => { setActiveHistory(i); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors group flex items-center justify-between
                  ${i === activeHistory ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted dark:hover:bg-white/10"}`}
              >
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${i === activeHistory ? "text-blue-600 dark:text-blue-400" : ""}`}>
                    {h.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.ago}</p>
                </div>
                <span className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 transition-all">
                  <Trash2 className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>

          {/* User footer */}
          <div className="shrink-0 border-t border-border p-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: A }}
              >
                AR
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">Ana Reyes</p>
                <p className="text-xs text-muted-foreground truncate">ana.reyes@email.com</p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0">

          {/* Toggle buttons row */}
          <div className="shrink-0 px-3 pt-[61px] pb-2 flex items-center">
            <button
              className="md:hidden p-1.5 rounded-lg text-muted-foreground dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            {!desktopSidebarOpen && (
              <button
                className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:bg-black/5 transition-colors"
                onClick={() => setDesktopSidebarOpen(true)}
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Scrollable centered content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="min-h-full flex flex-col items-center justify-center px-4 py-6 pb-20 md:pb-6">

              {/* Bot icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative
                  bg-blue-100 dark:bg-blue-500/15 border border-blue-300 dark:border-blue-500/35"
                style={{ boxShadow: "0 0 40px rgba(59,130,246,0.15)" }}
              >
                <Bot className="w-7 h-7 text-blue-600 dark:text-blue-300" />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: A }}
                >
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </span>
              </div>

              <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-blue-600 dark:text-blue-400">
                BlueBot AI
              </p>
              <p className="text-base font-semibold mb-1 text-gray-600 dark:text-blue-100/70">
                Hi Ana, welcome back.
              </p>
              <h1
                className="text-2xl md:text-3xl font-extrabold mb-2 text-center leading-tight text-gray-900 dark:text-white"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                What do you need help with?
              </h1>
              <p className="text-center mb-6 max-w-sm text-sm leading-relaxed text-gray-400 dark:text-blue-200/50">
                Describe your problem and I'll find the right worker for you.
              </p>

              {/* Input */}
              <div className="w-full max-w-xl">
                <div
                  className="flex items-center gap-2 px-4 py-3.5 rounded-2xl transition-all duration-200
                    bg-white dark:bg-white/5
                    border-2 border-gray-200 dark:border-white/10
                    shadow-md dark:shadow-none"
                  style={{ borderColor: focused ? A : undefined }}
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="e.g. My sink is leaking..."
                    className="flex-1 min-w-0 bg-transparent text-sm md:text-base focus:outline-none
                      text-gray-800 placeholder:text-gray-400
                      dark:text-white dark:placeholder:text-blue-200/35"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!query.trim()}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-1.5 shrink-0
                      transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                    style={{ background: A }}
                  >
                    <span className="hidden sm:inline">Find Worker</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {CHIPS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setQuery(c.label)}
                      className="px-2.5 py-1 rounded-full text-xs transition-all hover:scale-105 active:scale-95
                        border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600
                        dark:border-blue-500/25 dark:bg-transparent dark:text-blue-200/70 dark:hover:text-blue-300 dark:hover:border-blue-400"
                      style={query === c.label ? { background: `${A}15`, borderColor: A, color: A } : {}}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate("/app/discover")}
                className="mt-8 text-xs underline underline-offset-4 transition-colors
                  text-gray-400 hover:text-blue-600
                  dark:text-blue-300/50 dark:hover:text-blue-300"
              >
                Prefer to search manually? Browse Workers →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
