import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { Bot, Plus, Send, Star, ArrowRight, Trash2, ArrowLeft, History } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { A, BLUEBOT_HISTORY } from "../../constants";

type MsgFrom = "bot" | "user";

interface ChatMessage {
  from: MsgFrom;
  text?: string;
  time: string;
  extra?: React.ReactNode;
}

const SUGGESTED_WORKERS = [
  { name: "Maria Santos", rating: 4.7, dist: "1.2 km" },
  { name: "Dennis Ramos", rating: 4.5, dist: "2.4 km" },
  { name: "Carlo Abad",   rating: 4.4, dist: "3.1 km" },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { from: "bot",  text: "Hi Ana! 👋 What service do you need today? Describe your problem and I'll find the right worker for you.", time: "10:00 AM" },
  { from: "user", text: "My sink is leaking under the kitchen cabinet.", time: "10:01 AM" },
  { from: "bot",  text: "Got it! Sounds like a pipe or drain leak — you need a plumber. Let me find the best ones near you 🔧", time: "10:01 AM" },
  {
    from: "bot",
    text: "Here are the top plumbers near you:",
    time: "10:02 AM",
    extra: (
      <div className="flex gap-2 flex-wrap mt-3">
        {SUGGESTED_WORKERS.map((w) => (
          <div key={w.name} className="bg-muted rounded-xl border border-border p-3 w-32 md:w-36">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-2" style={{ background: A }}>
              {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <p className="text-xs font-bold leading-tight">{w.name}</p>
            <p className="text-xs text-muted-foreground">Plumber</p>
            <div className="flex items-center gap-1 text-xs mt-1 text-muted-foreground">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{w.rating}</span>
              <span>· {w.dist}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  { from: "bot",  text: "Would you like me to check availability and book one for you?", time: "10:02 AM" },
  { from: "user", text: "Yes, book Maria Santos for tomorrow morning.", time: "10:03 AM" },
  { from: "bot",  text: "Maria Santos is available tomorrow morning! Taking you to confirm the booking now. 📅", time: "10:03 AM" },
];

const NAV_H = 57;
const TAB_H = 56;

export default function BlueBotChat({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();

  const initialHistory = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("bluebot_history") || "null") || BLUEBOT_HISTORY; }
    catch { return BLUEBOT_HISTORY; }
  }, []);

  const pendingQuery = useMemo(() => {
    const q = localStorage.getItem("bluebot_pending_query") || "";
    localStorage.removeItem("bluebot_pending_query");
    return q;
  }, []);

  const initialMessages: ChatMessage[] = useMemo(() => {
    if (pendingQuery) {
      return [
        { from: "bot",  text: "Hi! 👋 Describe your problem and I'll find the right worker for you.", time: now() },
        { from: "user", text: pendingQuery, time: now() },
        { from: "bot",  text: "Got it! Let me find the best workers nearby for you 🔧", time: now() },
      ];
    }
    return INITIAL_MESSAGES;
  }, [pendingQuery]);

  const [history, setHistory]               = useState(initialHistory);
  const [messages, setMessages]             = useState<ChatMessage[]>(initialMessages);
  const [activeHistory, setActiveHistory]   = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [input, setInput]                   = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef   = useRef<HTMLTextAreaElement>(null);
  const isFirstMount   = useRef(true);

  useEffect(() => {
    const behavior = isFirstMount.current ? "instant" : "smooth";
    isFirstMount.current = false;
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [messages]);

  function handleSend() {
    const hasText = input.trim();
    if (!hasText) return;
    const userMsg: ChatMessage  = { from: "user", text: hasText, time: now() };
    const botReply: ChatMessage = { from: "bot", text: "I'm on it! Give me a moment to find the best workers nearby 🔧", time: now() };
    setMessages((prev) => [...prev, userMsg, botReply]);
    if (history[activeHistory]?.label === "New chat") {
      const updated = history.map((h, i) => i === activeHistory ? { ...h, label: hasText.slice(0, 40) } : h);
      setHistory(updated);
      localStorage.setItem("bluebot_history", JSON.stringify(updated));
    }
    setInput("");
  }

  function startNewChat() {
    const newEntry = { label: "New chat", ago: "Just now" };
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem("bluebot_history", JSON.stringify(updated));
    setMessages([{ from: "bot", text: "Hi! 👋 What service do you need today?", time: now() }]);
    setActiveHistory(0);
    setMobileSidebarOpen(false);
  }

  const sidebarContent = (showClose: boolean) => (
    <>
      <div className="shrink-0 px-4 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #3B82F6, #1B3A6B)" }}
            >
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">BlueBot</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                AI Assistant · Online
              </p>
            </div>
          </div>
          {showClose && (
            <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors" onClick={() => setMobileSidebarOpen(false)}>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #1E3A8A)" }}
          onClick={startNewChat}
        >
          <Plus className="w-4 h-4" /> New Chat
        </button>
      </div>
      <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Recent Chats</p>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => { setActiveHistory(i); setMobileSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors group flex items-center justify-between ${
              i === activeHistory ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted"
            }`}
          >
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${i === activeHistory ? "text-blue-600 dark:text-blue-400" : ""}`}>{h.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{h.ago}</p>
            </div>
            <span className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 transition-all">
              <Trash2 className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>
    </>
  );

  return (
    <>
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      {/* ── Desktop layout ── */}
      <div className="hidden md:flex overflow-hidden" style={{ height: `calc(100vh - ${NAV_H}px)` }}>
        <aside className="w-64 shrink-0 border-r border-border flex flex-col bg-card dark:bg-slate-900" style={{ minHeight: 0, overflow: "hidden" }}>
          {sidebarContent(false)}
        </aside>
        <div className="flex-1 flex flex-col min-w-0 bg-background dark:bg-slate-950" style={{ minHeight: 0, overflow: "hidden" }}>
          <MessageArea messages={messages} messagesEndRef={messagesEndRef} onNavigate={() => navigate("/app/booking/new")} />
          <InputBar input={input} inputRef={chatInputRef} onInput={setInput} onSend={handleSend} />
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div
        className="md:hidden fixed left-0 right-0 flex flex-col overflow-hidden"
        style={{ top: NAV_H, bottom: TAB_H }}
      >
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSidebarOpen(false)} />
        )}
        <aside
          className={`fixed left-0 z-50 w-72 shrink-0 border-r border-border flex flex-col bg-card dark:bg-slate-900 transition-transform duration-200 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ top: NAV_H, bottom: TAB_H }}
        >
          {sidebarContent(true)}
        </aside>

        <ChatHeader onOpenSidebar={() => setMobileSidebarOpen(true)} onNewChat={startNewChat} />
        <MessageArea messages={messages} messagesEndRef={messagesEndRef} onNavigate={() => navigate("/app/booking/new")} />
        <InputBar input={input} inputRef={chatInputRef} onInput={setInput} onSend={handleSend} />
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ChatHeader({ onOpenSidebar, onNewChat }: { onOpenSidebar: () => void; onNewChat: () => void }) {
  return (
    <div className="shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 bg-card dark:bg-slate-900 shadow-sm">
      <button className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors" onClick={onOpenSidebar}>
        <History className="w-5 h-5" />
      </button>
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #3B82F6, #1B3A6B)" }}>
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm">BlueBot</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
          AI Assistant · Online
        </p>
      </div>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onNewChat}
        className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        title="New Chat"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

function MessageArea({ messages, messagesEndRef, onNavigate }: {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onNavigate: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-5 bg-background dark:bg-slate-950" style={{ overscrollBehavior: "contain" }}>
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "gap-3 items-end"}`}>
          {m.from === "bot" && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-5" style={{ background: "linear-gradient(135deg, #3B82F6, #1B3A6B)" }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          <div className={`${m.from === "user" ? "max-w-[75%] md:max-w-md" : "max-w-[82%] md:max-w-lg"} space-y-1`}>
            {(m.text || m.extra) && (
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.from === "user" ? "text-white rounded-br-sm" : "bg-card dark:bg-slate-800 border border-border rounded-bl-sm"
                }`}
                style={m.from === "user" ? { background: A } : {}}
              >
                {m.text}
                {m.extra}
              </div>
            )}
            <p className={`text-xs text-muted-foreground ${m.from === "user" ? "text-right" : ""}`}>{m.time}</p>
          </div>
        </div>
      ))}
      {messages[messages.length - 1]?.text?.includes("confirm the booking") && (
        <div className="flex gap-3 items-center pl-11">
          <button
            onClick={onNavigate}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: A }}
          >
            Proceed to Booking <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function InputBar({ input, inputRef, onInput, onSend }: {
  input: string;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInput: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="shrink-0 bg-card dark:bg-slate-900 border-t border-border">
      <div className="px-3 py-3 flex items-center gap-2">
        <div className="flex-1 flex items-center bg-input-background rounded-xl px-4 py-2 border border-border focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder="Ask BlueBot anything..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground resize-none leading-5"
            style={{ maxHeight: 80, overflowY: "auto" }}
          />
        </div>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onSend}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shrink-0"
          style={{ background: A }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-2">BlueBot can make mistakes. Always verify worker credentials.</p>
    </div>
  );
}
