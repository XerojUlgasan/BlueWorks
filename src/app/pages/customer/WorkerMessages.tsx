import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Search, Send, CheckCheck, ArrowLeft, Image, Camera, X, Info } from "lucide-react";
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
  { id: 1,  workerName: "Juan dela Cruz",   skill: "Electrician",  avatarColor: "#3B82F6", jobContext: "Ceiling Light Installation",  messages: [{ from: "them", text: "I'll be there by 9AM tomorrow, please make sure the main breaker is accessible.", time: "Just now" }] },
  { id: 2,  workerName: "Maria Santos",     skill: "Plumber",      avatarColor: "#10B981", jobContext: "Leaking Sink Repair",         messages: [{ from: "them", text: "The parts I need are available, total cost will be around ₱1,200.", time: "Today, 11:00 AM" }] },
  { id: 3,  workerName: "Rico Reyes",       skill: "Carpenter",    avatarColor: "#F59E0B", jobContext: "Cabinet Installation",        messages: [{ from: "them", text: "Job done! Please leave a review when you get a chance 😊", time: "3 days ago" }] },
  { id: 4,  workerName: "Lito Bautista",    skill: "Painter",      avatarColor: "#8B5CF6", jobContext: "Living Room Repaint",         messages: [{ from: "me",   text: "Can you finish it by Saturday?", time: "Today, 9:00 AM" }] },
  { id: 5,  workerName: "Nena Villanueva",  skill: "Mason",        avatarColor: "#EF4444", jobContext: "Fence Repair",               messages: [{ from: "them", text: "Materials are on the way, see you tomorrow.", time: "Yesterday, 5:30 PM" }] },
  { id: 6,  workerName: "Dennis Aquino",    skill: "Electrician",  avatarColor: "#0EA5E9", jobContext: "Panel Box Upgrade",           messages: [{ from: "me",   text: "Please bring extra breakers just in case.", time: "Yesterday, 2:00 PM" }] },
  { id: 7,  workerName: "Cora Delos Reyes", skill: "Plumber",      avatarColor: "#14B8A6", jobContext: "Bathroom Fixture Install",   messages: [{ from: "them", text: "Done! Hot and cold water lines are both working.", time: "2 days ago" }] },
  { id: 8,  workerName: "Boy Fernandez",    skill: "Carpenter",    avatarColor: "#D97706", jobContext: "Bedroom Door Replacement",  messages: [{ from: "them", text: "The door fits perfectly, no more gaps.", time: "2 days ago" }] },
  { id: 9,  workerName: "Alma Castillo",    skill: "Painter",      avatarColor: "#EC4899", jobContext: "Exterior Wall Painting",    messages: [{ from: "me",   text: "What brand of paint do you recommend?", time: "Today, 8:15 AM" }] },
  { id: 10, workerName: "Jun Tolentino",    skill: "Mason",        avatarColor: "#64748B", jobContext: "Driveway Crack Patching",   messages: [{ from: "them", text: "Cracks are sealed, avoid parking on it for 24 hrs.", time: "Today, 7:00 AM" }] },
  { id: 11, workerName: "Gerry Magsino",    skill: "Electrician",  avatarColor: "#6366F1", jobContext: "CCTV Wiring",               messages: [{ from: "me",   text: "Can you also install an outlet near the gate?", time: "Yesterday, 6:00 PM" }] },
  { id: 12, workerName: "Tess Ocampo",      skill: "Plumber",      avatarColor: "#22C55E", jobContext: "Water Heater Installation", messages: [{ from: "them", text: "Heater is installed and tested. All good!", time: "3 days ago" }] },
  { id: 13, workerName: "Romy Pascual",     skill: "Carpenter",    avatarColor: "#F97316", jobContext: "Kitchen Shelf Build",       messages: [{ from: "me",   text: "Make the top shelf a bit higher please.", time: "Yesterday, 1:00 PM" }] },
  { id: 14, workerName: "Virgie Soriano",   skill: "Painter",      avatarColor: "#A855F7", jobContext: "Ceiling Paint Touch-up",    messages: [{ from: "them", text: "Touch-up done, matches the original color perfectly.", time: "4 days ago" }] },
  { id: 15, workerName: "Mando Cruz",       skill: "Mason",        avatarColor: "#78716C", jobContext: "Garden Wall Construction", messages: [{ from: "me",   text: "How many bags of cement will you need?", time: "Today, 10:30 AM" }] },
  { id: 16, workerName: "Bebang Ramos",     skill: "Electrician",  avatarColor: "#06B6D4", jobContext: "Outdoor Lighting Setup",   messages: [{ from: "them", text: "All lights tested and working. Invoice sent.", time: "5 days ago" }] },
  { id: 17, workerName: "Rudy Domingo",     skill: "Plumber",      avatarColor: "#10B981", jobContext: "Septic Tank Cleaning",     messages: [{ from: "me",   text: "Please let me know when you arrive.", time: "Today, 6:45 AM" }] },
  { id: 18, workerName: "Nanding Guevara",  skill: "Carpenter",    avatarColor: "#FBBF24", jobContext: "Staircase Handrail Repair",messages: [{ from: "them", text: "Handrail is solid now, I reinforced the posts.", time: "1 week ago" }] },
  { id: 19, workerName: "Zeny Medina",      skill: "Painter",      avatarColor: "#F43F5E", jobContext: "Gate Repainting",          messages: [{ from: "me",   text: "Use rust-proof primer before the topcoat.", time: "Yesterday, 4:00 PM" }] },
  { id: 20, workerName: "Totoy Bernal",     skill: "Mason",        avatarColor: "#84CC16", jobContext: "Terrace Tile Replacement", messages: [{ from: "them", text: "Tiles are set. Grout will cure overnight.", time: "2 days ago" }] },
];

function workerInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function WorkerMessages({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workerParam = searchParams.get("worker");
  const initialId = workerParam ? Number(workerParam) : 1;

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId]           = useState(initialId);
  const [mobileShowChat, setMobileShowChat] = useState(!!workerParam);
  const [input, setInput]                 = useState("");
  const [imagePreview, setImagePreview]   = useState<string | null>(null);

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const cameraInputRef  = useRef<HTMLInputElement>(null);

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }} className="bg-background">
      <CustomerNav dark={dark} toggleDark={toggleDark} />

      {/* Main row — fills exact remaining height, no overflow */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* ── Conversation list ── */}
        <aside
          style={{ flexDirection: "column", minHeight: 0 }}
          className={`${mobileShowChat ? "hidden" : "flex"} md:flex w-full md:w-80 shrink-0 border-r border-border bg-card dark:bg-slate-900`}
        >
          {/* Header — fixed, never scrolls */}
          <div className="shrink-0 px-4 pt-4 pb-3 border-b border-border">
            <h2 className="font-bold text-base mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Scrollable list */}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }} className="pb-14 md:pb-0">
            {conversations.map((c) => {
              const isActive = c.id === activeId;
              const last = c.messages[c.messages.length - 1];
              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveId(c.id); setMobileShowChat(true); }}
                  className={`w-full text-left px-4 py-3.5 border-b border-border transition-colors flex items-center gap-3 ${
                    isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted/60 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm" style={{ background: c.avatarColor }}>
                    {workerInitials(c.workerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}>{c.workerName}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{last.image ? "📷 Photo" : last.text}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{last.time.split(",")[0]}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Chat window ── */}
        <div
          style={{ flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
          className={`${mobileShowChat ? "flex" : "hidden"} md:flex bg-background dark:bg-slate-950`}
        >
          {/* Chat header — fixed, never scrolls */}
          <div className="shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 bg-card dark:bg-slate-900 shadow-sm">
            <button onClick={() => setMobileShowChat(false)} className="md:hidden p-1.5 -ml-1 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm" style={{ background: active.avatarColor }}>
              {workerInitials(active.workerName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{active.workerName}</p>
              <p className="text-xs text-muted-foreground truncate">{active.skill} · {active.jobContext}</p>
            </div>
            <button onClick={() => navigate(`/app/worker/${active.id}`)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0" title="View profile">
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable messages */}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, overscrollBehavior: "contain" }} className="px-4 py-4 space-y-3 pb-28 md:pb-4">
            {active.messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                {m.from === "them" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-4" style={{ background: active.avatarColor }}>
                    {workerInitials(active.workerName)}
                  </div>
                )}
                <div className="max-w-[72%] md:max-w-md space-y-1">
                  {m.image && <img src={m.image} alt="sent" className="rounded-2xl max-w-full max-h-52 object-cover" />}
                  {m.text && (
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed ${
                        m.from === "me"
                          ? "text-white rounded-2xl rounded-br-sm"
                          : "bg-card dark:bg-slate-800 border border-border rounded-2xl rounded-bl-sm"
                      }`}
                      style={m.from === "me" ? { background: A } : {}}
                    >
                      {m.text}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 text-[10px] text-muted-foreground px-1 ${m.from === "me" ? "justify-end" : ""}`}>
                    {m.time}{m.from === "me" && <CheckCheck className="w-3 h-3 text-blue-400" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar — fixed on mobile, inline on desktop */}
          <div className="shrink-0 fixed bottom-14 left-0 right-0 md:relative md:bottom-auto bg-card dark:bg-slate-900 border-t border-border">
            {imagePreview && (
              <div className="px-4 pt-3">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-xl border border-border" />
                  <button onClick={() => setImagePreview(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            <div className="px-3 py-3 flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <Image className="w-5 h-5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />

              <button onClick={() => cameraInputRef.current?.click()} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
                <Camera className="w-5 h-5" />
              </button>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />

              <div className="flex-1 flex items-center bg-input-background rounded-xl px-4 py-2 border border-border focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Message ${active.workerName}...`}
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                />
              </div>

              <button onClick={handleSend} disabled={!input.trim() && !imagePreview} className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 hover:opacity-90 active:scale-95 shrink-0" style={{ background: A }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
