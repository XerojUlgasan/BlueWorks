import { useState, useRef, useEffect } from "react";
import { Search, Send, CheckCheck, ArrowLeft, Image, Camera, X } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { A } from "../../constants";

type MessageFrom = "me" | "them";

interface Message {
  from: MessageFrom;
  text?: string;
  image?: string;
  time: string;
}

interface Conversation {
  id: number;
  workerName: string;
  skill: string;
  avatarColor: string;
  jobContext: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    workerName: "Juan dela Cruz",
    skill: "Electrician",
    avatarColor: "#3B82F6",
    jobContext: "Ceiling Light Installation",
    messages: [
      { from: "me",   text: "Hi Juan, just confirming our booking for tomorrow morning.", time: "Yesterday, 3:00 PM" },
      { from: "them", text: "Hi Ana! Yes confirmed, I'll arrive between 8–9AM.",           time: "Yesterday, 3:05 PM" },
      { from: "me",   text: "Perfect! Any things I should prepare?",                       time: "Yesterday, 3:10 PM" },
      { from: "them", text: "I'll be there by 9AM tomorrow, please make sure the main breaker is accessible.", time: "Just now" },
    ],
  },
  {
    id: 2,
    workerName: "Maria Santos",
    skill: "Plumber",
    avatarColor: "#10B981",
    jobContext: "Leaking Sink Repair",
    messages: [
      { from: "me",   text: "Hi Maria, the sink under the kitchen is still dripping.",           time: "Today, 10:00 AM" },
      { from: "them", text: "I can check it today around 2PM if that works?",                    time: "Today, 10:15 AM" },
      { from: "me",   text: "That works! See you then.",                                         time: "Today, 10:20 AM" },
      { from: "them", text: "The parts I need are available, total cost will be around ₱1,200.", time: "Today, 11:00 AM" },
    ],
  },
  {
    id: 3,
    workerName: "Rico Reyes",
    skill: "Carpenter",
    avatarColor: "#F59E0B",
    jobContext: "Cabinet Installation",
    messages: [
      { from: "them", text: "All done! The cabinets are installed and secured.",         time: "3 days ago" },
      { from: "me",   text: "Looks great, thank you!",                                  time: "3 days ago" },
      { from: "them", text: "Job done! Please leave a review when you get a chance 😊", time: "3 days ago" },
    ],
  },
];

function workerInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function WorkerMessages({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(1);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active.messages]);

  function handleSend() {
    const hasText = input.trim();
    if (!hasText && !imagePreview) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { from: "me", text: hasText || undefined, image: imagePreview || undefined, time: now() }] }
          : c
      )
    );
    setInput("");
    setImagePreview(null);
  }

  function handleImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  // Nav height ~57px, mobile tab bar ~56px
  const chatHeight = "calc(100dvh - 57px)";

  return (
    <div className="bg-background flex flex-col" style={{ height: "100dvh" }}>
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      <div className="flex overflow-hidden" style={{ height: chatHeight }}>

        {/* Conversation list */}
        <aside
          className={`${mobileShowChat ? "hidden" : "flex"} md:flex w-full md:w-80 shrink-0 border-r border-border flex-col bg-card`}
        >
          <div className="p-4 border-b border-border shrink-0">
            <h2 className="font-bold text-base mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pb-14 md:pb-0">
            {conversations.map((c) => {
              const isActive = c.id === activeId;
              const last = c.messages[c.messages.length - 1];
              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveId(c.id); setMobileShowChat(true); }}
                  className={`w-full text-left px-4 py-3.5 border-b border-border transition-colors flex items-start gap-3 ${isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted"}`}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: c.avatarColor }}>
                    {workerInitials(c.workerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}>{c.workerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.skill}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{last.image ? "📷 Photo" : last.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat window */}
        <div className={`${mobileShowChat ? "flex" : "hidden"} md:flex flex-1 flex-col overflow-hidden min-h-0`}>

          {/* Header — sticky, never scrolls */}
          <div className="sticky top-0 z-20 px-4 py-3 border-b border-border flex items-center gap-3 bg-card shrink-0">
            <button onClick={() => setMobileShowChat(false)} className="md:hidden p-1.5 -ml-1 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: active.avatarColor }}>
              {workerInitials(active.workerName)}
            </div>
            <div>
              <p className="font-bold text-sm">{active.workerName}</p>
              <p className="text-xs text-muted-foreground">{active.skill} · {active.jobContext}</p>
            </div>
          </div>

          {/* Messages — only this scrolls */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 md:pb-4">
            {active.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} gap-2 items-end`}>
                {m.from === "them" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1" style={{ background: active.avatarColor }}>
                    {workerInitials(active.workerName)}
                  </div>
                )}
                <div className="max-w-[75%] md:max-w-sm space-y-1">
                  {m.image && <img src={m.image} alt="sent" className="rounded-2xl max-w-full max-h-48 object-cover border border-border" />}
                  {m.text && (
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "me" ? "text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}
                      style={m.from === "me" ? { background: A } : {}}
                    >
                      {m.text}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 text-xs text-muted-foreground ${m.from === "me" ? "justify-end" : ""}`}>
                    {m.time}
                    {m.from === "me" && <CheckCheck className="w-3 h-3 text-blue-400" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input — fixed to viewport on mobile, normal flex on desktop */}
          <div className="fixed bottom-[56px] left-0 right-0 md:relative md:bottom-auto bg-card border-t border-border shrink-0" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
            {imagePreview && (
              <div className="px-3 pt-3">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-xl border border-border" />
                  <button onClick={() => setImagePreview(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            <div className="px-3 pt-3 pb-2 flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <Image className="w-5 h-5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />

              <button onClick={() => cameraInputRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <Camera className="w-5 h-5" />
              </button>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />

              <div className="flex-1 flex items-center bg-input-background rounded-xl px-4 py-2.5 border border-border focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Message ${active.workerName}...`}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim() && !imagePreview}
                className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shrink-0"
                style={{ background: A }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
