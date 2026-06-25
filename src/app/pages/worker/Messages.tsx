import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Search, Phone, MoreVertical, Image, Smile, CheckCheck } from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { DarkToggle } from "../../components/shared";
import { A } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const CONVOS = [
  {
    id: 0, name: "Ana Reyes",     preview: "On my way po!",          time: "10:02 AM",  unread: 2, online: true,
    messages: [
      { from: "Ana",  text: "Kamusta po, nakalabas na po ba kayo?",      time: "9:50 AM",  read: true  },
      { from: "Juan", text: "Oo po, on my way na. 15 mins pa lang.",      time: "9:52 AM",  read: true  },
      { from: "Ana",  text: "Sige po, bukas na po yung gate.",            time: "9:55 AM",  read: true  },
      { from: "Juan", text: "Ok po! Salamat.",                            time: "9:58 AM",  read: true  },
      { from: "Ana",  text: "On my way po!",                              time: "10:02 AM", read: false },
    ],
  },
  {
    id: 1, name: "Carlo Mendoza", preview: "Salamat!",                time: "Yesterday", unread: 0, online: false,
    messages: [
      { from: "Carlo", text: "Tapos na po ba ang inspection?",            time: "2:00 PM",  read: true  },
      { from: "Juan",  text: "Oo, tapos na. Kailangan palitan yung outlet.",time: "2:05 PM", read: true  },
      { from: "Carlo", text: "Salamat!",                                  time: "2:06 PM",  read: true  },
    ],
  },
  {
    id: 2, name: "Jenny Cruz",    preview: "Pwede ba bukas?",         time: "Yesterday", unread: 0, online: true,
    messages: [
      { from: "Jenny", text: "Hello po! Pwede ba bukas ang trabaho?",     time: "4:00 PM",  read: true  },
      { from: "Juan",  text: "Pwede po bukas ng 9AM. Ok ba?",             time: "4:10 PM",  read: true  },
      { from: "Jenny", text: "Pwede ba bukas?",                           time: "4:12 PM",  read: true  },
    ],
  },
  {
    id: 3, name: "Mark Lim",      preview: "Kumusta yung parts?",    time: "2 days ago", unread: 0, online: false,
    messages: [
      { from: "Mark",  text: "Kumusta yung parts? Nasa stocks pa ba?",   time: "Mon 3PM",  read: true  },
      { from: "Juan",  text: "Meron pa naman, ipapa-order ko na lang.",   time: "Mon 3PM",  read: true  },
    ],
  },
];

export default function MessagesPage({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [convos, setConvos] = useState(CONVOS);
  const bottomRef = useRef<HTMLDivElement>(null);

  const convo = convos[active];
  const filtered = convos.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active, convos]);

  function sendMessage() {
    if (!msg.trim()) return;
    setConvos((prev) => prev.map((c, i) =>
      i === active
        ? { ...c, preview: msg, messages: [...c.messages, { from: "Juan", text: msg, time: "now", read: false }] }
        : c
    ));
    setMsg("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: conversation list */}
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Messages</h2>
            <DarkToggle dark={dark} toggleDark={toggleDark} />
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations…"
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-muted text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-border transition-colors
                  ${active === c.id ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted"}`}>
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>
                    {initials(c.name)}
                  </div>
                  {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm truncate ${c.unread > 0 ? "font-bold" : "font-semibold"}`}>{c.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate flex-1">{c.preview}</p>
                    {c.unread > 0 && (
                      <span className="ml-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                        style={{ background: A }}>{c.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Chat header */}
          <div className="px-5 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>
                {initials(convo.name)}
              </div>
              {convo.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{convo.name}</p>
              <p className="text-xs text-muted-foreground">
                {convo.online ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" /> Online</span> : "Last seen recently"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Phone className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            {convo.messages.map((m, i) => {
              const isMine = m.from === "Juan";
              return (
                <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white mr-2 mt-auto mb-0.5 shrink-0" style={{ background: A }}>
                      {initials(m.from)}
                    </div>
                  )}
                  <div className="max-w-[65%]">
                    <div className={`px-4 py-2.5 text-sm rounded-2xl
                      ${isMine ? "text-white rounded-br-none" : "bg-card border border-border rounded-bl-none"}`}
                      style={isMine ? { background: A } : {}}>
                      {m.text}
                    </div>
                    <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-muted-foreground">{m.time}</span>
                      {isMine && <CheckCheck className={`w-3 h-3 ${m.read ? "text-blue-400" : "text-muted-foreground"}`} />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border shrink-0">
            <div className="flex items-center gap-2 bg-card rounded-2xl px-3 py-2.5 border border-border">
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><Smile className="w-4 h-4" /></button>
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><Image className="w-4 h-4" /></button>
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><Paperclip className="w-4 h-4" /></button>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={handleKey}
                placeholder="Type a message…"
                className="flex-1 bg-transparent text-sm focus:outline-none px-1" />
              <button onClick={sendMessage} disabled={!msg.trim()}
                className="p-2 rounded-xl text-white transition-opacity disabled:opacity-40 shrink-0" style={{ background: A }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1.5">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </main>
    </div>
  );
}
