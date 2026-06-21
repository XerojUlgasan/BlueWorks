import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Bot, Sparkles, Plus, Trash2, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { Logo } from "../../components/shared";
import { CustomerNav } from "../../components/shared/Nav";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { A, BLUEBOT_HISTORY } from "../../constants";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "../../components/ui/alert-dialog";

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
  const { user } = useCurrentUser();
  const [query, setQuery] = useState("");
  const [activeHistory, setActiveHistory] = useState<number | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState(BLUEBOT_HISTORY);
  const [chatInput, setChatInput] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);

  const activeChatIndex = activeHistory;
  const focused = query.length > 0;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chatHistory, activeHistory]);

  const userInitials = user?.fullname ? user.fullname.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  const userFullname = user?.fullname || "User";

  function handleSubmit() {
    if (!query.trim()) return;
    const newChat = {
      label: query.trim(),
      ago: "Just now",
      messages: [
        { from: "user" as const, text: query.trim() },
        { from: "bot" as const, text: "Thanks for reaching out! Let me find the best worker for your request." },
      ],
    };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveHistory(0);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (e.key === "Enter" && !e.shiftKey && !isTouchDevice) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleChatSend() {
    if (!chatInput.trim() || activeChatIndex === null) return;
    setChatHistory(prev => prev.map((chat, i) =>
      i === activeChatIndex
        ? { ...chat, messages: [
            ...chat.messages,
            { from: "user" as const, text: chatInput.trim() },
            { from: "bot" as const, text: "I'm looking into that for you right now!" },
          ]}
        : chat
    ));
    setChatInput("");
  }

  function handleChatKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (e.key === "Enter" && !e.shiftKey && !isTouchDevice) {
      e.preventDefault();
      handleChatSend();
    }
  }

  return (
    <div className="bg-background dark:bg-transparent relative" style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        className="fixed inset-0 -z-10 hidden dark:block"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1B3A6B 100%)" }}
      />

      <CustomerNav dark={dark} toggleDark={toggleDark} transparent />

      {/* Mobile sidebar toggle — onboard view only */}
      {activeChatIndex === null && (
        <button
          className="md:hidden fixed z-40 p-1.5 rounded-lg text-muted-foreground dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          style={{ top: "52px", left: "12px" }}
          onClick={() => setMobileSidebarOpen(true)}
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden md:pt-[56px]">

        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-[55]" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-[60]
            w-72 md:w-[260px] shrink-0 border-r border-border flex flex-col md:h-full
            bg-card dark:bg-slate-900/80 md:dark:bg-slate-900
            transition-transform duration-200
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${desktopSidebarOpen ? "md:translate-x-0" : "md:-translate-x-full md:hidden"}
          `}
        >
          {/* Mobile top bar: Logo + close */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <Logo />
            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile: New Chat */}
          <div className="md:hidden p-3 border-b border-border shrink-0">
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #1D4ED8, #1E3A8A)" }}
              onClick={() => { setQuery(""); setActiveHistory(null); setMobileSidebarOpen(false); }}
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>

          {/* Desktop top bar: New Chat + close */}
          <div className="hidden md:flex items-center gap-2 px-3 py-3 border-b border-border shrink-0">
            <button
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #1D4ED8, #1E3A8A)" }}
              onClick={() => { setQuery(""); setActiveHistory(null); }}
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors shrink-0"
              onClick={() => setDesktopSidebarOpen(false)}
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            Recent Chats
          </p>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {chatHistory.map((h, i) => (
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
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{userFullname}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "user@email.com"}</p>
              </div>
              <button
                onClick={() => setLogoutOpen(true)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0">

          {/* ── CHAT view ── */}
          {activeChatIndex !== null && (
            <div
              className={`flex flex-col bg-background dark:bg-transparent md:flex-1 md:h-full ${
                // mobile only: fixed between top nav and bottom tab bar
                "max-md:fixed max-md:inset-x-0"
              }`}
              style={{ top: "62px", bottom: "56px" }}
            >
              {/* Chat header */}
              <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
                <button
                  className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
                {!desktopSidebarOpen && (
                  <button
                    className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                    onClick={() => setDesktopSidebarOpen(true)}
                  >
                    <PanelLeft className="w-5 h-5" />
                  </button>
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #1B3A6B)" }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">BlueBot</p>
                  <p className="text-xs text-muted-foreground mt-0.5">AI Assistant · Online</p>
                </div>
                <div className="flex-1" />
                <button
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                  onClick={() => { setQuery(""); setActiveHistory(null); }}
                  title="New Chat"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Messages — only this scrolls */}
              <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-3">
                {chatHistory[activeChatIndex]?.messages.map((msg, i) => (
                  <div key={i} className={`flex items-end ${msg.from === "user" ? "justify-end" : "gap-3"}`}>
                    {msg.from === "bot" && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #3B82F6, #1B3A6B)" }}
                      >
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "text-white rounded-br-sm"
                          : "bg-muted dark:bg-white/10 text-foreground rounded-bl-sm"
                      }`}
                      style={msg.from === "user" ? { background: A } : {}}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 px-4 py-3 border-t border-border bg-card">
                <div className="flex gap-2">
                  <textarea
                    ref={chatInputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Continue the conversation..."
                    rows={1}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none resize-none
                      text-gray-800 placeholder:text-gray-400 dark:text-white dark:placeholder:text-blue-200/35"
                    style={{ maxHeight: "80px", overflowY: "auto" }}
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
                    }}
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim()}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                    style={{ background: A }}
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">BlueBot can make mistakes. Please verify important information.</p>
              </div>
            </div>
          )}

          {/* ── ONBOARD view ── */}
          {activeChatIndex === null && (
            <div className="flex-1 overflow-hidden overflow-x-hidden pt-[48px] md:pt-0">
              {!desktopSidebarOpen && (
                <div className="hidden md:flex px-3 pt-3">
                  <button
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    onClick={() => setDesktopSidebarOpen(true)}
                  >
                    <PanelLeft className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className={`min-h-full flex flex-col items-center justify-center px-4 py-6 pb-20 md:justify-start md:pb-6 ${desktopSidebarOpen ? "md:pt-12" : "md:-mt-4"}`}>

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
                  Hi {userFullname}, welcome back.
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

                <div className="w-full max-w-xl">
                  <div
                    className="flex flex-col gap-2 px-4 pt-3.5 pb-3 rounded-2xl transition-all duration-200
                      bg-white dark:bg-white/5
                      border-2 border-gray-200 dark:border-white/10
                      shadow-md dark:shadow-none"
                    style={{ borderColor: focused ? A : undefined }}
                  >
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. My sink is leaking..."
                      rows={1}
                      className="w-full bg-transparent text-sm md:text-base focus:outline-none resize-none
                        text-gray-800 placeholder:text-gray-400
                        dark:text-white dark:placeholder:text-blue-200/35"
                      style={{ maxHeight: "120px", overflowY: "auto" }}
                      onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = "auto";
                        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                      }}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmit}
                        disabled={!query.trim()}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-1.5 shrink-0
                          transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                        style={{ background: A }}
                      >
                        <span>Find Worker</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

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
                  className="mt-8 text-xs font-semibold transition-colors text-blue-500 hover:text-blue-700 underline underline-offset-4 decoration-blue-400 hover:decoration-blue-700 dark:text-blue-400 dark:hover:text-blue-300 dark:decoration-blue-500 dark:hover:decoration-blue-300"
                >
                  Prefer to search manually? Browse Workers →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>You'll be returned to the login screen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 sm:gap-3">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => navigate("/")}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
