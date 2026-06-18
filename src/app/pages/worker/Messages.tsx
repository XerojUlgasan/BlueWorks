import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { WorkerSidebar } from "../../components/shared/Nav";
import { DarkToggle } from "../../components/shared";
import { A } from "../../constants";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function MessagesPage({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");
  const convos = [
    { name: "Ana Reyes",     preview: "On my way po!",       time: "10:02 AM",  unread: true },
    { name: "Carlo Mendoza", preview: "Salamat!",            time: "Yesterday", unread: false },
    { name: "Jenny Cruz",    preview: "Pwede ba bukas?",     time: "Yesterday", unread: false },
    { name: "Mark Lim",      preview: "Kumusta yung parts?", time: "2 days ago",unread: false },
  ];
  const chat = [
    { from: "Ana",  text: "Kamusta po, nakalabas na po ba kayo?" },
    { from: "Juan", text: "Oo po, on my way na. 15 mins pa lang." },
    { from: "Ana",  text: "Sige po, bukas na po yung gate." },
    { from: "Juan", text: "Ok po! Salamat." },
    { from: "Ana",  text: "On my way po!" },
  ];
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkerSidebar />
      <main className="flex-1 flex overflow-hidden">
        <div className="w-72 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Messages</h2>
            <DarkToggle dark={dark} toggleDark={toggleDark} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {convos.map((c, i) => (
              <button key={c.name} onClick={() => setActive(i)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-border transition-colors ${active === i ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-muted"}`}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>{initials(c.name)}</div>
                  {c.unread && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="px-5 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: A }}>{initials(convos[active].name)}</div>
            <div>
              <p className="font-bold text-sm">{convos[active].name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.from === "Juan" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.from === "Juan" ? "text-white rounded-br-none" : "bg-card border border-border rounded-bl-none"}`}
                  style={m.from === "Juan" ? { background: A } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border shrink-0">
            <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2 border border-border">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent text-sm focus:outline-none" />
              <button className="text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-lg text-white" style={{ background: A }}><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
