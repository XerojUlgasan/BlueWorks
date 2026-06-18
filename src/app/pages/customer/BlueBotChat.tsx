import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bot, Plus, Send, Star, ArrowRight, Trash2, ArrowLeft, History, Image, Camera, X } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { A } from "../../constants";

type MsgType = "bot" | "user";

interface ChatMessage {
  from: MsgType;
  text?: string;
  image?: string;
  time: string;
  extra?: React.ReactNode;
}

const HISTORY = [
  { label: "Leaking sink repair",      ago: "2 days ago"  },
  { label: "Electrician for rewiring", ago: "1 week ago"  },
  { label: "Aircon cleaning",          ago: "2 weeks ago" },
];

const SUGGESTED_WORKERS = [
  { name: "Maria Santos", rating: 4.7, dist: "1.2 km" },
  { name: "Dennis Ramos", rating: 4.5, dist: "2.4 km" },
  { name: "Carlo Abad",   rating: 4.4, dist: "3.1 km" },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function BlueBotChat({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [activeHistory, setActiveHistory] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Hi Ana! 👋 What service do you need today? Describe your problem and I'll find the right worker for you.", time: "10:00 AM" },
    { from: "user", text: "My sink is leaking under the kitchen cabinet.", time: "10:01 AM" },
    { from: "bot", text: "Got it! Sounds like a pipe or drain leak — you need a plumber. Let me find the best ones near you 🔧", time: "10:01 AM" },
    {
      from: "bot",
      text: "Here are the top plumbers near you:",
      time: "10:02 AM",
      extra: (
        <div className="flex gap-2 flex-wrap mt-3">
          {SUGGESTED_WORKERS.map((w) => (
            <div key={w.name} className="bg-background rounded-xl border border-border p-3 w-36 shadow-sm">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-2" style={{ background: A }}>
                {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <p className="text-xs font-bold leading-tight">{w.name}</p>
              <p className="text-xs text-muted-foreground">Plumber</p>
              <div className="flex items-center gap-1 text-xs mt-1.5 text-muted-foreground">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{w.rating}</span>
                <span>· {w.dist}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    { from: "bot", text: "Would you like me to check availability and book one for you?", time: "10:02 AM" },
    { from: "user", text: "Yes, book Maria Santos for tomorrow morning.", time: "10:03 AM" },
    {
      from: "bot",
      text: "Maria Santos is available tomorrow morning! Taking you to confirm the booking now. 📅",
      time: "10:03 AM",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const hasText = input.trim();
    if (!hasText && !imagePreview) return;

    const userMsg: ChatMessage = {
      from: "user",
      text: hasText || undefined,
      image: imagePreview || undefined,
      time: now(),
    };

    const botReply: ChatMessage = {
      from: "bot",
      text: imagePreview
        ? "I can see the photo! Let me assess the issue and find the right worker for you 🔍"
        : "I'm looking into that for you. Give me a moment to find the best workers nearby! 🔧",
      time: now(),
    };

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
    setImagePreview(null);
  }

  function handleImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      <div className="flex flex-1 min-h-0">
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-50
            w-72 md:w-64 shrink-0 border-r border-border flex flex-col bg-card
            transition-transform duration-200
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="p-3 border-b border-border flex items-center gap-2 shrink-0">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: A }}
              onClick={() => setMessages([{ from: "bot", text: "Hi! 👋 What service do you need today?", time: now() }])}
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
            <button className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors" onClick={() => setMobileSidebarOpen(false)}>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Recent Chats</p>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {HISTORY.map((h, i) => (
              <button
                key={i}
                onClick={() => { setActiveHistory(i); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors group flex items-center justify-between ${i === activeHistory ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted"}`}
              >
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${i === activeHistory ? "text-blue-600 dark:text-blue-400" : ""}`}>{h.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.ago}</p>
                </div>
                <span className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-500 transition-all shrink-0">
                  <Trash2 className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Header — anchored */}
          <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-card shrink-0">
            <button className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors" onClick={() => setMobileSidebarOpen(true)}>
              <History className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">BlueBot</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                AI Assistant · Online
              </p>
            </div>
          </div>

          {/* Messages — scrollable middle */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "gap-3 items-end"}`}>
                {m.from === "bot" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1" style={{ background: A }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`${m.from === "user" ? "max-w-[75%] md:max-w-md" : "max-w-[80%] md:max-w-lg"} space-y-1`}>
                  {m.image && (
                    <img src={m.image} alt="sent" className="rounded-2xl max-w-full max-h-48 object-cover border border-border" />
                  )}
                  {m.text && (
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.from === "user" ? "text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}
                      style={m.from === "user" ? { background: A } : {}}
                    >
                      {m.text}
                      {m.extra}
                    </div>
                  )}
                  {!m.text && m.from === "bot" && m.extra && (
                    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      {m.extra}
                    </div>
                  )}
                  <p className={`text-xs text-muted-foreground ${m.from === "user" ? "text-right" : ""}`}>{m.time}</p>
                </div>
              </div>
            ))}

            {/* Booking CTA after last bot message */}
            {messages[messages.length - 1]?.text?.includes("confirm the booking") && (
              <div className="flex gap-3 items-end">
                <div className="w-8 h-8 opacity-0 shrink-0" />
                <button
                  onClick={() => navigate("/app/booking/new")}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  style={{ background: A }}
                >
                  Proceed to Booking <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input — anchored at bottom */}
          <div className="border-t border-border bg-card shrink-0 pb-14 md:pb-0">
            {/* Image preview */}
            {imagePreview && (
              <div className="px-3 pt-3">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-xl border border-border" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="p-3 flex items-center gap-2">
              {/* Gallery */}
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <Image className="w-5 h-5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />

              {/* Camera */}
              <button onClick={() => cameraInputRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <Camera className="w-5 h-5" />
              </button>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />

              {/* Text input */}
              <div className="flex-1 flex items-center bg-input-background rounded-xl px-4 py-2.5 border border-border focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask BlueBot anything..."
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
              </div>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!input.trim() && !imagePreview}
                className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shrink-0"
                style={{ background: A }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground pb-2">
              BlueBot can make mistakes. Always verify worker credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
