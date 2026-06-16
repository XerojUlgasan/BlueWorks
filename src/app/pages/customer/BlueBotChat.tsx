import { useState } from "react";
import { useNavigate } from "react-router";
import { Bot, Plus, Mic, Paperclip, Send, Star, ArrowRight } from "lucide-react";
import { CustomerNav } from "../../components/shared/Nav";
import { A } from "../../constants";

function BotMsg({ text, extra }: { text: string; extra?: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}><Bot className="w-5 h-5 text-white" /></div>
      <div className="max-w-md bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3">
        <p className="text-sm">{text}</p>{extra}
      </div>
    </div>
  );
}
function UserMsg({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-md rounded-2xl rounded-tr-none px-4 py-3 text-white text-sm" style={{ background: A }}>{text}</div>
    </div>
  );
}

export default function BlueBotChat({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const history = [
    { label: "Leaking sink repair", ago: "2 days ago" },
    { label: "Electrician for rewiring", ago: "1 week ago" },
    { label: "Aircon cleaning", ago: "2 weeks ago" },
  ];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerNav dark={dark} toggleDark={toggleDark} />
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        <div className="w-64 shrink-0 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: A }}>
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {history.map((h, i) => (
              <button key={i} className={`w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted transition-colors ${i === 0 ? "bg-muted" : ""}`}>
                <p className="text-sm font-medium truncate">{h.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{h.ago}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: A }}><Bot className="w-5 h-5 text-white" /></div>
            <div>
              <p className="font-bold text-sm">BlueBot</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> AI Assistant · Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <BotMsg text="Hi Ana! 👋 What service do you need today? Describe your problem and I'll find the right worker for you." />
            <UserMsg text="My sink is leaking under the kitchen cabinet." />
            <BotMsg text="Got it! Sounds like a pipe or drain leak — you need a plumber. Let me find the best ones near you 🔧" />
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: A }}><Bot className="w-5 h-5 text-white" /></div>
              <div className="flex gap-2 flex-wrap">
                {[{ name: "Maria Santos", rating: 4.7, dist: "1.2km" }, { name: "Dennis Ramos", rating: 4.5, dist: "2.4km" }, { name: "Carlo Abad", rating: 4.4, dist: "3.1km" }].map((w) => (
                  <div key={w.name} className="bg-card rounded-xl border border-border p-3 w-40">
                    <p className="text-xs font-bold">{w.name}</p>
                    <p className="text-xs text-muted-foreground">Plumber</p>
                    <div className="flex items-center gap-1 text-xs mt-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{w.rating} · {w.dist}</div>
                    <button onClick={() => navigate("/app/booking")} className="w-full mt-2 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: A }}>Book</button>
                  </div>
                ))}
              </div>
            </div>
            <BotMsg text="Would you like me to check availability and book one for you?" />
            <UserMsg text="Yes, book Maria Santos for tomorrow morning." />
            <BotMsg text="Maria Santos is available tomorrow morning! Taking you to confirm the booking now. 📅" extra={
              <button onClick={() => navigate("/app/booking")} className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ background: A }}>
                Proceed to Booking <ArrowRight className="w-3 h-3" />
              </button>
            } />
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 bg-input-background rounded-xl px-3 py-2 border border-border">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Ask BlueBot anything..." className="flex-1 bg-transparent text-sm focus:outline-none" />
              <button className="text-muted-foreground hover:text-foreground"><Mic className="w-4 h-4" /></button>
              <button className="text-muted-foreground hover:text-foreground"><Paperclip className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-lg text-white" style={{ background: A }}><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
